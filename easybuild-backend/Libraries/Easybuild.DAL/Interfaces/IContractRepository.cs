using Easybuild.DAL.Entities;
using System.Collections.Generic;

namespace Easybuild.DAL.Interfaces
{
    public interface IContractRepository : IBaseRepository<Contract, int>
    {
        public IEnumerable<Contract> GetForUser(int userId);
    }
}