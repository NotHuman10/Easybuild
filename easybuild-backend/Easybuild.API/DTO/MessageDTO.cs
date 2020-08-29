using System;

namespace Easybuild.API
{
    public class MessageDTO
    {
        public long Id { get; set; }

        public int CreatorId { get; set; }

        public UserDTO Creator { get; set; }

        public DateTime CreatedDate { get; set; }

        public int ChatId { get; set; }

        public ChatDTO Chat { get; set; }

        public string Text { get; set; }
    }
}