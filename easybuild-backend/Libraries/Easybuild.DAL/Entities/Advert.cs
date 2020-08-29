using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class Advert : IEntity<int>
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public ICollection<JobProposal> JobProposals { get; set; }

        [Required]
        [StringLength(128)]
        public string Title { get; set; }

        [Required]
        [StringLength(2048)]
        public string Description { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool Closed { get; set; }

        public Guid? ImageId { get; set; }

        [Required]
        [StringLength(256)]
        public string Address { get; set; }

        public ICollection<AdvertFavorite> FavoriteUsers { get; set; }

        public Advert()
        {
            JobProposals = new List<JobProposal>();
            FavoriteUsers = new List<AdvertFavorite>();
        }
    }
}