using Easybuild.DAL.Entities;
using Easybuild.DAL.Interfaces;
using Easybuild.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.DAL
{
    internal class ChatRepository : BaseRepository<Chat, int>, IChatRepository
    {
        public ChatRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
        }

        public override Chat Read(int id)
        {
            return _table
                .Include(c => c.Participants)
                .ThenInclude(c=> c.User)
                .SingleOrDefault(c => c.Id == id);
        }

        public Chat GetPrivate(int userA, int userB)
        {
            return _table
                .Where(c => c.Participants.Any(p => p.UserId == userA || p.UserId == userB))
                .Where(c => c.Participants.Count() == 2)
                .Include(c => c.Participants)
                .ThenInclude(c => c.User)
                .SingleOrDefault();
        }

        public IEnumerable<ChatInfo> GetInfoList(int userId)
        {
            var result = _db.Set<ChatUser>()
                .Where(u => u.UserId == userId)
                .Select(u => new ChatInfo()
                {
                    Id = u.ChatId,
                    Name = u.Chat.Name,
                    ImageId = u.Chat.ImageId,
                    ParticipantsCount = u.Chat.Participants.Count(),
                    LastMessage = u.Chat.Messages.OrderByDescending(m => m.CreatedDate).First(),
                    MessagesCount = u.Chat.Messages.Count(),
                    LastSeenCount = u.LastSeenCount
                })
                .ToList();

            var privateChats = result.Where(i => i.ParticipantsCount == 2).Select(i => i.Id).ToList();
            var privateChatUsers = _db.Set<ChatUser>()
                .Where(c => privateChats.Contains(c.ChatId))
                .Where(c => c.UserId != userId)
                .Include(c => c.User)
                .ToDictionary(c => c.ChatId, c => c.User);

            foreach (var info in result)
            {
                if (privateChatUsers.TryGetValue(info.Id, out User user))
                {
                    info.PrivateChatUser = user;
                }
            }

            return result;
        }

        public void ResetLastSeenCounter(int userId, int chatId)
        {
            var res = _db.Set<ChatUser>()
                .Where(u => u.UserId == userId)
                .Where(u => u.ChatId == chatId)
                .Select(u => new
                {
                    ChatUser = u,
                    MessagesNumber = u.Chat.Messages.Count()
                })
                .Single();

            res.ChatUser.LastSeenCount = res.MessagesNumber;

            _db.SaveChanges();
        }
    }
}