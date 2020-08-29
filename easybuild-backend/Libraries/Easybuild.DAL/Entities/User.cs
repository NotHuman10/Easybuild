using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class User : IEntity<int>
    {
        public int Id { get; set; }

        [Required]
        [StringLength(64)]
        public string Username { get; set; }

        [Required]
        [StringLength(64)]
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(64)]
        public string Salt { get; set; }

        public bool Active { get; set; }

        public Role RoleId { get; set; }

        public DateTime CreateDate { get; set; }

        [Required]
        [StringLength(32)]
        public string Name { get; set; }

        [Required]
        [StringLength(32)]
        public string LastName { get; set; }

        [StringLength(16)]
        public string Mobile { get; set; }

        public int Rating { get; set; }

        public Guid? AvatarId { get; set; }

        [StringLength(128)]
        public string Bio { get; set; }

        public ICollection<Contract> Contracts { get; set; }

        public ICollection<AdvertFavorite> FavoriteAdverts { get; set; }

        public ICollection<ChatUser> Chats { get; set; }

        public User()
        {
            Contracts = new List<Contract>();
            FavoriteAdverts = new List<AdvertFavorite>();
            Chats = new List<ChatUser>();
        }
    }
}