using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;

namespace Easybuild.API.Middleware
{
    public class QueryAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public QueryAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            if (httpContext.Request.Query.TryGetValue("access_token", out StringValues queryToken))
            {
                if (!httpContext.Request.Headers.ContainsKey("Authorization"))
                {
                    httpContext.Request.Headers.Append("Authorization", $"Bearer {queryToken}");
                }
            }

            await _next(httpContext);
        }
    }
}