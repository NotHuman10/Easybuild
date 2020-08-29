using Easybuild.API.Hubs;
using Easybuild.API.Middleware;
using Easybuild.API.Services;
using Easybuild.Reporting;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Easybuild.API
{
    public class Startup
    {
        public Startup()
        {
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var origins = Configuration.GetSection("AllowedOrigins").Get<string[]>();
            services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
            {
                builder.WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            }));

            services.AddJwtAuthentication(Configuration);
            services.AddAuthorization();
            services.AddDataAccessServices(Configuration);
            services.AddScoped<ImageConverter>();
            services.AddScoped<ChatService>();
            services.AddScoped<ContractService>();
            services.AddScoped<PDFRender>();
            services.AddMapping();
            services.AddSignalR();

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<QueryAuthMiddleware>();
            app.UseHsts();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("api/v1/chathub");
                endpoints.MapHub<IOTHub>("api/v1/iothub");
                endpoints.MapControllers();
            });
        }
    }
}