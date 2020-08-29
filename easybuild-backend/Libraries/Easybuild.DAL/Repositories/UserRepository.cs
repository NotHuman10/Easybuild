using Easybuild.DAL.Entities;
using System.Linq;

namespace Easybuild.DAL
{
    internal sealed class UserRepository : BaseRepository<User, int>, IUserRepository
    {
        public UserRepository(ApplicationDBContext dbContext) : base(dbContext) { }

        public User GetByUsername(string username)
        {
            return _table.FirstOrDefault(u => u.Username == username);
        }
    }
}