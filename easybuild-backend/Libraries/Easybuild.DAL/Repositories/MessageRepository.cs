using Easybuild.DAL.Entities;
using Easybuild.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.DAL
{
    internal class MessageRepository : BaseRepository<Message, long>, IMessageRepository
    {
        public MessageRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
        }

        public IEnumerable<Message> GetHistory(int chatId, int count, int offset)
        {
            return _table.Where(m => m.ChatId == chatId)
                .OrderByDescending(c => c.CreatedDate)
                .Skip(offset)
                .Take(count)
                .Include(m => m.Creator)
                .ToList();
        }
    }
}