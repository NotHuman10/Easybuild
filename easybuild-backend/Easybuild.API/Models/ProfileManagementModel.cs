using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class ProfileManagementModel
    {
        [Required]
        [StringLength(32, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 2)]
        public string LastName { get; set; }

        [RegularExpression(@"^\d{12,15}$")]
        public string Mobile { get; set; }

        [StringLength(128)]
        public string Bio { get; set; }

        public Guid? AvatarId { get; set; }
    }
}