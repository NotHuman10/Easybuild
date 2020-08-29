using AutoMapper;
using Easybuild.API.Utilities;
using Easybuild.Cryptography;
using Easybuild.DAL;
using Easybuild.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly IDatabaseUnitOfWork _db;
        private readonly JwtIssuerService _jwt;
        private readonly IMapper _mapper;

        public AccountController(
            IDatabaseUnitOfWork uow,
            JwtIssuerService jwt,
            IMapper mapper)
        {
            _db = uow;
            _jwt = jwt;
            _mapper = mapper;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public IActionResult Login(LoginModel model)
        {
            var userEntity = _db.Users.GetByUsername(model.Username);
            if (userEntity == null || !userEntity.Active)
            {
                return Unauthorized("Invalid login");
            }

            model.Password = RSAEncryptor.DecryptString(model.Password);
            var passwordHash = HashUtil.ComputeHash(model.Password, userEntity.Salt);
            if (passwordHash != userEntity.PasswordHash)
            {
                return Unauthorized("Invalid password");
            }

            var claims = new List<Claim>
            {
                new Claim("UserId", userEntity.Id.ToString()),
                new Claim("RemoteIPAddress", Request.HttpContext.Connection.RemoteIpAddress.ToString()),
                new Claim(ClaimsIdentity.DefaultNameClaimType, userEntity.Username),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, userEntity.RoleId.ToString())
            };

            return Ok(new AuthModel
            {
                Jwt = _jwt.GenerateToken(claims),
                User = _mapper.Map<UserDTO>(userEntity)
            });
        }

        [HttpGet("identity")]
        [Authorize]
        public IActionResult GetIdentity()
        {
            var userEntity = _db.Users.Read(User.GetId());
            return Ok(_mapper.Map<UserDTO>(userEntity));
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public IActionResult Register(RegisterModel model)
        {
            if (_db.Users.GetByUsername(model.Username) != null)
            {
                return Conflict("User with the same name already exists");
            }

            var userEntity = new User()
            {
                Username = model.Username,
                Active = true,
                CreateDate = DateTime.Now,
                RoleId = model.Role,
                Name = model.Name,
                LastName = model.LastName,
                Mobile = model.Mobile,
            };

            model.Password = RSAEncryptor.DecryptString(model.Password);
            var regex = new Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d!@#$%^&*()_+=]{8,32}$");
            if(!regex.IsMatch(model.Password))
            {
                ModelState.AddModelError(
                    nameof(model.Password),
                    "Password must contain 8 - 32 alpanumeric characters with both uppercase and lowercase");
               
                return BadRequest(ModelState);
            }

            userEntity.Salt = HashUtil.GetRandomSalt();
            userEntity.PasswordHash = HashUtil.ComputeHash(model.Password, userEntity.Salt);

            try
            {
                _db.StartTransaction();
                _db.Users.Create(userEntity);
                _db.Commit();
            }
            catch
            {
                _db.Rollback();
                throw;
            }

            return Created(string.Empty, userEntity.Id);
        }

        [HttpPatch("profile")]
        [Authorize]
        public IActionResult Profile(ProfileManagementModel model)
        {
            var userEntity = _db.Users.Read(User.GetId());
            userEntity.Name = model.Name;
            userEntity.LastName = model.LastName;
            userEntity.Mobile = model.Mobile;
            userEntity.Bio = model.Bio;
            userEntity.AvatarId = model.AvatarId;

            _db.Users.Update(userEntity);
            _db.Commit();

            return Ok();
        }
    }
}