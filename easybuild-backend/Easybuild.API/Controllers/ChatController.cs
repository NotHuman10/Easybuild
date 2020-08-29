using Easybuild.API.Services;
using Easybuild.API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class ChatController : Controller
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatSvc)
        {
            _chatService = chatSvc;
        }

        [HttpGet("private")]
        public IActionResult GetPrivateChat([FromQuery] int userId)
        {
            var res = _chatService.GetPrivateChat(userId, User.GetId());
            return Ok(res);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var res = _chatService.GetChat(id);
            if (res.Participants.All(p => p.Id != User.GetId()))
            {
                return Forbid();
            }

            return Ok(res);
        }

        [HttpGet("{chatId}/history")]
        public IActionResult GetHistory(int chatId, [Range(1, 50)][FromQuery] int count, [FromQuery] int? offset)
        {
            var userId = User.GetId();
            var chat = _chatService.GetChat(chatId);
            if (chat == null)
            {
                return NotFound($"Chat {chatId} not found");
            }
            else if (chat.Participants.All(p => p.Id != userId))
            {
                return Forbid();
            }

            var history = _chatService.GetHistory(chatId, count, offset);
            return Ok(history);
        }

        [HttpPost]
        public IActionResult Post(ChatDTO chat)
        {
            if(!_chatService.ValidateChatModel(chat, out string error))
            {
                this.ModelState.AddModelError(nameof(chat), error);
                return BadRequest(ModelState);
            }

            var created = _chatService.CreateChat(chat);
            return Ok(created);
        }

        [HttpGet("list")]
        public IActionResult GetList()
        {
            var res = _chatService.GetChatList(User.GetId());
            return Ok(res);
        }
    }
}