using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class Contract : IEntity<int>
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public User Customer { get; set; }

        public int PerformerId { get; set; }

        public User Performer { get; set; }

        public ICollection<JobProposal> JobProposals { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public DateTime? SignOffDate { get; set; }

        public ContractStatus Status { get; set; }

        public Guid? ReportId { get; set; }

        [StringLength(256)]
        public string ConstructionSiteAddress { get; set; }

        public Contract()
        {
            JobProposals = new List<JobProposal>();
        }
    }
}