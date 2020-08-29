using Easybuild.DAL.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Models
{
    public class ChatInfo
    {
        public int Id { get; set; }

        [StringLength(64)]
        public string Name { get; set; }

        public Guid? ImageId { get; set; }

        public int ParticipantsCount { get; set; }

        public User PrivateChatUser { get; set; }

        public Message LastMessage { get; set; }

        public int MessagesCount { get; set; }

        public int LastSeenCount { get; set; }
    }
}