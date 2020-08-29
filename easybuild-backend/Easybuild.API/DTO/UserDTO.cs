using Easybuild.DAL;
using System;

namespace Easybuild.API
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public Role RoleId { get; set; }

        public DateTime CreateDate { get; set; }

        public string Name { get; set; }

        public string LastName { get; set; }

        public string Mobile { get; set; }

        public int Rating { get; set; }

        public Guid? AvatarId { get; set; }

        public string Bio { get; set; }
    }
}