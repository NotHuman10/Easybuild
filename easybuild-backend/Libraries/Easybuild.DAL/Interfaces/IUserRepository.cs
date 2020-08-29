using Easybuild.DAL.Entities;

namespace Easybuild.DAL
{
    public interface IUserRepository : IBaseRepository<User, int>
    {
        User GetByUsername(string username);
    }
}