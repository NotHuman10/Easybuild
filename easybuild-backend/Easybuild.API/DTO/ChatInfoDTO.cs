using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API
{
    public class ChatInfoDTO
    {
        public int Id { get; set; }

        [StringLength(64)]
        public string Name { get; set; }

        public Guid? ImageId { get; set; }

        public int ParticipantsCount { get; set; }

        public UserDTO PrivateChatUser { get; set; }

        public MessageDTO LastMessage { get; set; }

        public int MessagesCount { get; set; }

        public int LastSeenCount { get; set; }
    }
}