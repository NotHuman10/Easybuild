using Easybuild.API.Utilities;
using Easybuild.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Easybuild.API.Hubs
{
    [Authorize]
    public class IOTHub : Hub
    {
        private static readonly ConcurrentDictionary<int, string> userConnections = new ConcurrentDictionary<int, string>();

        public override Task OnConnectedAsync()
        {
            if (Context.User.GetRole() != Role.IOT)
            {
                userConnections.TryAdd(Context.User.GetId(), Context.ConnectionId);
            }

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            userConnections.TryRemove(Context.User.GetId(), out _);
            return base.OnDisconnectedAsync(exception);
        }

        public void IOTDeviceWorks(int userId, string data)
        {
            if (userConnections.TryGetValue(userId, out string connectionId))
            {
                Clients.Client(connectionId).SendAsync("IOTDeviceCalled", data);
            }
        }
    }
}