using AutoMapper;
using Easybuild.API.Models;
using Easybuild.API.Services;
using Easybuild.API.Utilities;
using Easybuild.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ContractController : Controller
    {
        private readonly ContractService _contractService;

        public ContractController(IDatabaseUnitOfWork uow, IMapper mapper, ContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpGet("list")]
        public IActionResult GetList()
        {
            var result = _contractService.GetForUser(User.GetId());
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(ContractCreateModel model)
        {
            var contract = new ContractDTO
            {
                CustomerId = User.GetRole() == Role.Customer ? User.GetId() : model.UserId,
                PerformerId = User.GetRole() == Role.Performer ? User.GetId() : model.UserId,
                CreatedDate = DateTime.Now,
                Status = ContractStatus.Proposed,
                ExpirationDate = model.ExpirationDate,
                ConstructionSiteAddress = model.ConstructionSiteAddress
            };

            foreach (var p in model.Proposals)
            {
                p.AdvertId = null;
                p.ContractId = null;
                p.Id = 0;
                contract.JobProposals.Add(p);
            }

            try
            {
                var id = _contractService.Create(contract, User.GetRole());
                return Ok(id);
            }
            catch (EBValidationException ex)
            {
                ModelState.AddModelError(nameof(model), ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpGet("{id}/report")]
        public IActionResult GetReport(int id)
        {
            var res = _contractService.GetReport(id, User.GetId());
            return File(res, "application/pdf");
        }
    }
}