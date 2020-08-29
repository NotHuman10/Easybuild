using AutoMapper;
using Easybuild.DAL;
using Easybuild.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.API.Services
{
    public class ChatService
    {
        private readonly IDatabaseUnitOfWork _db;
        private readonly IMapper _mapper;

        public ChatService(IDatabaseUnitOfWork uow, IMapper mapper)
        {
            _db = uow;
            _mapper = mapper;
        }

        public ChatDTO GetPrivateChat(int userA, int userB)
        {
            var res = _db.Chats.GetPrivate(userA, userB);
            return _mapper.Map<ChatDTO>(res);
        }

        public ChatDTO GetChat(int chatId)
        {
            var res = _db.Chats.Read(chatId);
            return _mapper.Map<ChatDTO>(res);
        }

        public ChatDTO CreateChat(ChatDTO chat)
        {
            try
            {
                _db.StartTransaction();
                var chatEntity = _mapper.Map<Chat>(chat);
                foreach (var u in chatEntity.Participants)
                {
                    u.AddedDate = DateTime.Now;
                }
                var chatId = _db.Chats.Create(chatEntity);
                _db.Commit();

                var created = GetChat(chatId);
                return created;
            }
            catch
            {
                _db.Rollback();
                throw;
            }
        }

        public IEnumerable<MessageDTO> GetHistory(int chatId, int count, int? offset)
        {
            return _db.Messages.GetHistory(chatId, count, offset ?? 0)
                .Select(m => _mapper.Map<MessageDTO>(m))
                .OrderByDescending(m => m.CreatedDate)
                .ToList();
        }

        public MessageDTO CreateMessage(MessageDTO message, int userId)
        {
            var chat = GetChat(message.ChatId);
            if (chat == null)
            {
                throw new EBValidationException($"Chat {message.ChatId} does not exist");
            }
            else if (chat.Participants.All(p => p.Id != userId))
            {
                throw new EBValidationException($"User {userId} is not a member of chat {chat.Id}");
            }

            message.CreatedDate = DateTime.Now;
            try
            {
                _db.StartTransaction();
                var msgId = _db.Messages.Create(_mapper.Map<Message>(message));
                _db.Commit();

                var created = _db.Messages.Read(msgId);
                return _mapper.Map<MessageDTO>(created);
            }
            catch
            {
                _db.Rollback();
                throw;
            }
        }

        public bool ValidateChatModel(ChatDTO chat, out string error)
        {
            var participants = chat.Participants.Select(p => p.Id).ToList();
            var ownerId = chat.Owner?.Id ?? chat.OwnerId;
            if (ownerId != null && !participants.Any(p => p == ownerId))
            {
                error = "The owner must also be a participant";
                return false;
            }

            var existingUsers = _db.Users.ReadMultiple(participants)
                .Where(u => u.Active)
                .Select(u => u.Id)
                .ToList();

            var diff = participants.Except(existingUsers).ToList();
            if (diff.Count() == 1)
            {
                error = $"Invalid users provided: {string.Join(", ", diff)}";
                return false;
            }

            error = null;
            return true;
        }

        public IEnumerable<ChatInfoDTO> GetChatList(int userId)
        {
            var result = _db.Chats.GetInfoList(userId)
                .Select(i => _mapper.Map<ChatInfoDTO>(i))
                .ToList();

            foreach (var info in result)
            {
                if (info.PrivateChatUser != null)
                {
                    info.Name = info.PrivateChatUser.Name + ' ' + info.PrivateChatUser.LastName;
                    info.ImageId = info.PrivateChatUser.AvatarId;
                }
            }

            return result;
        }

        public void ResetLastSeenCounter(int userId, int chatId)
        {
            _db.Chats.ResetLastSeenCounter(userId, chatId);
        }
    }
}