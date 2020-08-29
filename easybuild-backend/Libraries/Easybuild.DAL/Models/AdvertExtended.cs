using Easybuild.DAL.Entities;

namespace Easybuild.DAL.Models
{
    public class AdvertExtended
    {
        public Advert BaseAdvert { get; set; }

        public bool IsFavorite { get; set; }
    }
}