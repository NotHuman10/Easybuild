using Easybuild.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.DAL.Repositories
{
    internal sealed class JobCategoryRepository : BaseRepository<JobCategory, int>, IJobCategoryRepository
    {
        public JobCategoryRepository(ApplicationDBContext dbContext) : base(dbContext) { }

        public ICollection<JobCategory> GetAllActive()
        {
            return _table
                .Where(c => c.Active)
                .Include(c => c.SubCategories)
                .ToList()
                .Where(c => c.ParentId == null)
                .ToList();
        }

        public ICollection<JobCategory> GetAllActiveFlat()
        {
            return _table.Where(c => c.Active).ToList();
        }
    }
}