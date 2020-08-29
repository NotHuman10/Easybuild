using AutoMapper;
using Easybuild.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IDatabaseUnitOfWork _db;
        private readonly IMapper _mapper;

        public UserController(IDatabaseUnitOfWork uow, IMapper mapper)
        {
            _db = uow;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            var res = _db.Users.Read(id);
            if (res == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(_mapper.Map<UserDTO>(res));
            }
        }

        [HttpPost("search-list")]
        public IActionResult Get([FromBody] int[] searchList)
        {
            var list = _db.Users.ReadMultiple(searchList);
            var res = list.Select(u => _mapper.Map<UserDTO>(u));
            return Ok(res);
        }
    }
}