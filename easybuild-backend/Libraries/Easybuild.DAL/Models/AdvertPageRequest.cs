using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Models
{
    public class AdvertPageRequest : PageRequest
    {
        public AdvertSortingOption AdvertSortingOption { get; set; }

        [StringLength(256)]
        public string SearchKeywords { get; set; }

        public bool SearchInDescription { get; set; }

        public List<int> JobCategoriesId { get; set; }

        public Role? Role { get; set; }

        public int UserId { get; set; }
    }
}