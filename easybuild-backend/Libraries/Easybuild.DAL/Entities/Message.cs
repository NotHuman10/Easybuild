using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class Message : IEntity<long>
    {
        public long Id { get; set; }

        [Required]
        public int CreatorId { get; set; }

        [Required]
        public User Creator { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public int ChatId { get; set; }

        [Required]
        public Chat Chat { get; set; }

        [Required]
        [StringLength(2048)]
        public string Text { get; set; }
    }
}