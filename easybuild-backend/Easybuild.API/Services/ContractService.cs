using AutoMapper;
using Easybuild.DAL;
using Easybuild.DAL.Entities;
using Easybuild.DAL.Files;
using Easybuild.Reporting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Easybuild.API.Services
{
    public class ContractService
    {
        private readonly IDatabaseUnitOfWork db;
        private readonly IMapper _mapper;
        private readonly PDFRender _pdfRender;
        private IFileRepository fileRepository;

        public ContractService(IDatabaseUnitOfWork uow, IMapper mapper, PDFRender pdfRender, IFileRepository fileRepository)
        {
            db = uow;
            _mapper = mapper;
            _pdfRender = pdfRender;
            this.fileRepository = fileRepository;
        }

        public int Create(ContractDTO model, Role initiatorRole)
        {
            if (!ValidateContractForCreate(model, initiatorRole, out string error))
            {
                throw new EBValidationException(error);
            }

            try
            {
                db.StartTransaction();

                int createdId = db.Contracts.Create(_mapper.Map<Contract>(model));
                var fullEntity = db.Contracts.Read(createdId);
                
                var report = GeneratePdfReport(_mapper.Map<ContractDTO>(fullEntity));
                fileRepository.Create(report);
                
                fullEntity.ReportId = report.Metadata.Id;
                db.Contracts.Update(fullEntity);
                
                db.Commit();
                return createdId;
            }
            catch
            {
                db.Rollback();
                throw;
            }
        }

        public bool ValidateContractForCreate(ContractDTO model, Role initiatorRole, out string error)
        {
            var usersId = new int[] { model.CustomerId, model.PerformerId };
            var existingEntities = db.Users.ReadMultiple(usersId).ToList();
            if (existingEntities.Count() < 2)
            {
                error = "User is not exist";
            }
            if (existingEntities.Select(u => u.RoleId).Distinct().Count() < 2)
            {
                error = "Can't create contract for users with the same roles";
            }
            else if (model.ConstructionSiteAddress == null && initiatorRole == Role.Customer)
            {
                error = "Construction Site Address is required for customers";
            }
            else if (model.ExpirationDate < DateTime.Now.AddDays(1).Date)
            {
                error = "ExpirationDate must be in the future start from tomorrow";
            }
            else
            {
                error = null;
            }

            return error == null;
        }

        public IEnumerable<ContractDTO> GetForUser(int userId)
        {
            var result = db.Contracts.GetForUser(userId).Select(c => _mapper.Map<ContractDTO>(c)).ToList();
            return result;
        }

        public Stream GetReport(int contractId, int userId)
        {
            var contractEntity = db.Contracts.Read(contractId);
            if (contractEntity?.CustomerId != userId && contractEntity?.PerformerId != userId)
            {
                throw new EBValidationException("User doesn't have access to this contract");
            }
            else if (contractEntity.ReportId == null)
            {
                throw new EBValidationException("Report for this contract does not exist");
            }

            var res = fileRepository.Read(new FileMetadata
            {
                OriginalFileName = ".pdf",
                Id = contractEntity.ReportId.Value,
                FileType = FileType.Pdf
            });

            return new MemoryStream(res.Data);
        }

        private FileModel GeneratePdfReport(ContractDTO model)
        {
            using (var pdfStream = _pdfRender.RenderAsync("Contract", model).GetAwaiter().GetResult())
            using (var ms = new MemoryStream())
            {
                pdfStream.CopyTo(ms);

                var result = new FileModel
                {
                    Metadata = new FileMetadata
                    {
                        Id = Guid.NewGuid(),
                        OriginalFileName = "Contract.pdf",
                        FileType = FileType.Pdf,
                        UploadDate = DateTime.Now,
                        Assigned = false
                    },
                    Data = ms.ToArray()
                };

                return result;
            }
        }
    }
}