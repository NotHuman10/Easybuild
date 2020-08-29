using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class ChatUser
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public int ChatId { get; set; }

        [Required]
        public Chat Chat { get; set; }

        [Required]
        public DateTime AddedDate { get; set; }

        [Required]
        public int LastSeenCount { get; set; }
    }
}