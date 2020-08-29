using Easybuild.Common;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Easybuild.API
{
    public sealed class JwtIssuerService
    {
        public JwtConfiguration JwtConfig { get; }

        public JwtIssuerService(JwtConfiguration config)
        {
            JwtConfig = config;
        }

        public string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JwtConfig.KeyPhrase));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: JwtConfig.Issuer,
                audience: JwtConfig.Audience,
                notBefore: DateTime.UtcNow,
                claims: claims,
                expires: DateTime.UtcNow.AddSeconds(JwtConfig.LifetimeSeconds),
                signingCredentials: cred
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}