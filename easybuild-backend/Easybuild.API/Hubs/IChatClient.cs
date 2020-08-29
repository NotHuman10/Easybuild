using System.Threading.Tasks;

namespace Easybuild.API.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageDTO message);
    }
}