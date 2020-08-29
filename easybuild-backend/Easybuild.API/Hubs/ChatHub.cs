using Easybuild.API.Services;
using Easybuild.API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Easybuild.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly ChatService _chatService;

        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public async Task Enter(int chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        public async Task Send(MessageDTO message)
        {
            try
            {
                MessageDTO created = null;
                await Task.Run(() =>
                {
                    created = _chatService.CreateMessage(message, Context.User.GetId());
                });

                if (created != null)
                {
                    await Clients.Group(created.ChatId.ToString()).ReceiveMessage(created);
                }
            }
            catch (EBValidationException)
            {
                throw;
            }
            catch
            {
                throw new Exception("Server error occured");
            }
        }

        public async Task ResetLastSeen(int chatId)
        {
            await Task.Run(() =>
            {
                _chatService.ResetLastSeenCounter(Context.User.GetId(), chatId);
            });
        }
    }
}