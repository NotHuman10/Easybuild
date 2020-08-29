using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class JobProposal : IEntity<int>
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string PricingUnit { get; set; }

        public int Amount { get; set; }

        public int JobCategoryId { get; set; }

        public JobCategory JobCategory { get; set; }

        public int? AdvertId { get; set; }

        public Advert Advert { get; set; }

        public int? ContractId { get; set; }

        public Contract Contract { get; set; }

        public double Price { get; set; }
    }
}