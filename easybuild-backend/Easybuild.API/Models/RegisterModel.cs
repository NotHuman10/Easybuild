using Easybuild.API.Attributes;
using Easybuild.DAL;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class RegisterModel
    {
        [Required]
        [StringLength(64)]
        [EmailAddress]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 2)]
        public string LastName { get; set; }

        [RegularExpression(@"^\d{12,15}$")]
        public string Mobile { get; set; }

        [Required]
        [WhiteList(Role.Customer, Role.Performer)]
        public Role Role { get; set; }
    }
}