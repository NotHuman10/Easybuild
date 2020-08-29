using Easybuild.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace Easybuild.API
{
    internal static class JwtAuthenticationConfiguration
    {
        public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
        {
            var jwtConfig = new JwtConfiguration()
            {
                Issuer = config["JwtOptions:Issuer"],
                Audience = config["JwtOptions:Audience"],
                LifetimeSeconds = Int32.Parse(config["JwtOptions:LifetimeSeconds"]),
                KeyPhrase = config["JwtOptions:EncryptionKey"]
            };

            var authenticationBuilder = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            });

            var jwtKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.KeyPhrase));
            authenticationBuilder.AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = jwtKey,
                    RequireExpirationTime = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddSingleton(u => new JwtIssuerService(jwtConfig));
        }
    }
}