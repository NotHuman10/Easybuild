using System.Collections.Generic;

namespace Easybuild.API
{
    public class JobCategoryDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? ParentId { get; set; }

        public ICollection<JobCategoryDTO> SubCategories { get; set; }

        public bool Active { get; set; }

        public JobCategoryDTO()
        {
            SubCategories = new List<JobCategoryDTO>();
        }
    }
}