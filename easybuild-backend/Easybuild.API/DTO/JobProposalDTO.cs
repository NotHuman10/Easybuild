using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class JobProposalDTO
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string PricingUnit { get; set; }

        public int JobCategoryId { get; set; }

        public JobCategoryDTO JobCategory { get; set; }

        public int? AdvertId { get; set; }

        public int? ContractId { get; set; }

        [Range(0, int.MaxValue)]
        public double Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Amount { get; set; }
    }
}