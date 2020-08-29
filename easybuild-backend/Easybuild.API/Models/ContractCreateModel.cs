using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API.Models
{
    public class ContractCreateModel
    {
        public int UserId { get; set; }

        [MaxLength(100)]
        public JobProposalDTO[] Proposals { get; set; }

        [Required]
        public DateTime ExpirationDate { get; set; }

        [StringLength(256)]
        public string ConstructionSiteAddress { get; set; }
    }
}