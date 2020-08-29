using Easybuild.DAL.Entities;
using Easybuild.DAL.Models;
using System.Collections.Generic;

namespace Easybuild.DAL.Interfaces
{
    public interface IChatRepository : IBaseRepository<Chat, int>
    {
        Chat GetPrivate(int userA, int userB);

        IEnumerable<ChatInfo> GetInfoList(int userId);

        void ResetLastSeenCounter(int userId, int chatId);
    }
}