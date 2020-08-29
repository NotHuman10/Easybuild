using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class Chat : IEntity<int>
    {
        public int Id { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public int? OwnerId { get; set; }

        public User Owner { get; set; }

        [StringLength(64)]
        public string Name { get; set; }

        public Guid? ImageId { get; set; }

        public ICollection<ChatUser> Participants { get; set; }

        public ICollection<Message> Messages { get; set; }

        public Chat()
        {
            Participants = new List<ChatUser>();
            Messages = new List<Message>();
        }
    }
}