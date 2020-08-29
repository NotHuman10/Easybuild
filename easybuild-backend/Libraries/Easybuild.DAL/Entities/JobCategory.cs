using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class JobCategory : IEntity<int>
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public int? ParentId { get; set; }

        public JobCategory Parent { get; set; }

        public ICollection<JobCategory> SubCategories { get; set; }

        public bool Active { get; set; }

        public JobCategory()
        {
            SubCategories = new List<JobCategory>();
        }
    }
}