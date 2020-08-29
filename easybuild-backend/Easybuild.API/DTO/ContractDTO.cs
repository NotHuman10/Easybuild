using Easybuild.DAL;
using System;
using System.Collections.Generic;

namespace Easybuild.API
{
    public class ContractDTO
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public UserDTO Customer { get; set; }

        public int PerformerId { get; set; }

        public UserDTO Performer { get; set; }

        public ICollection<JobProposalDTO> JobProposals { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public DateTime? SignOffDate { get; set; }

        public ContractStatus Status { get; set; }

        public Guid? ReportId { get; set; }

        public string ConstructionSiteAddress { get; set; }

        public ContractDTO()
        {
            JobProposals = new List<JobProposalDTO>();
        }
    }
}