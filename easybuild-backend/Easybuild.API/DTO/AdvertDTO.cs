using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class AdvertDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public UserDTO User { get; set; }

        [Required]
        [MinLength(1)]
        public JobProposalDTO[] JobProposals { get; set; }

        [Required]
        [MaxLength(128)]
        public string Title { get; set; }

        [Required]
        [MaxLength(2048)]
        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool Closed { get; set; }

        public Guid? ImageId { get; set; }

        [Required]
        [StringLength(256)]
        public string Address { get; set; }
    }
}