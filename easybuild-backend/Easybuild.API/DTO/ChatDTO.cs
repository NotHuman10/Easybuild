using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class ChatDTO
    {
        public int Id { get; set; }
        
        public DateTime CreatedDate { get; set; }

        public int? OwnerId { get; set; }

        public UserDTO Owner { get; set; }

        [StringLength(64)]
        public string Name { get; set; }

        public Guid? ImageId { get; set; }

        [MaxLength(100)]
        public ICollection<UserDTO> Participants { get; set; }

        public ChatDTO()
        {
            Participants = new List<UserDTO>();
        }
    }
}