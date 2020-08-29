using Easybuild.DAL.Entities;
using System.Collections.Generic;

namespace Easybuild.DAL
{
    public interface IJobCategoryRepository : IBaseRepository<JobCategory, int>
    {
        ICollection<JobCategory> GetAllActive();

        ICollection<JobCategory> GetAllActiveFlat();
    }
}