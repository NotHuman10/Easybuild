using Easybuild.DAL.Entities;
using System.Collections.Generic;

namespace Easybuild.DAL.Interfaces
{
    public interface IMessageRepository : IBaseRepository<Message, long>
    {
        IEnumerable<Message> GetHistory(int chatId, int count, int offset);
    }
}