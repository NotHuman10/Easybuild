using Easybuild.DAL.Entities;
using Easybuild.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.DAL.Repositories
{
    internal class ContractRepository : BaseRepository<Contract, int>, IContractRepository
    {
        public ContractRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
        }

        public override Contract Read(int id)
        {
            return _table
                .Include(c => c.Customer)
                .Include(c => c.Performer)
                .Include(c => c.JobProposals)
                .ThenInclude(p => p.JobCategory)
                .FirstOrDefault(c => c.Id == id);
        }

        public IEnumerable<Contract> GetForUser(int userId)
        {
            return _table
                .Where(c => c.CustomerId == userId || c.PerformerId == userId)
                .Include(c => c.Customer)
                .Include(c => c.Performer)
                .ToList();
        }
    }
}