namespace Easybuild.DAL.Models
{
    public class AdvertFavoritePageRequest : PageRequest
    {
        public int UserId { get; set; }

        public bool ShowOnlyMy {get; set;}
    }
}