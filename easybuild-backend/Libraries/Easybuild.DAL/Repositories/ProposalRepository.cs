using Easybuild.DAL.Entities;

namespace Easybuild.DAL.Repositories
{
    internal sealed class ProposalRepository : BaseRepository<JobProposal, int>, IProposalRepository
    {
        public ProposalRepository(ApplicationDBContext dbContext) : base(dbContext) { }
    }
}