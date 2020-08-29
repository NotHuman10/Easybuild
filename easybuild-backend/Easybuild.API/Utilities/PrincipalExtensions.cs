using Easybuild.DAL;
using System;
using System.Linq;
using System.Security.Claims;

namespace Easybuild.API.Utilities
{
    public static class PrincipalExtensions
    {
        public static int GetId(this ClaimsPrincipal principal)
        {
            return int.Parse(principal.FindFirst("UserId").Value);
        }

        public static Role GetRole(this ClaimsPrincipal principal)
        {
            var role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value;
            return Enum.Parse<Role>(role);
        }
    }
}