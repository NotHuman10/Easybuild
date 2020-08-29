using Easybuild.DAL;
using Easybuild.DAL.Files;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Easybuild.API
{
    internal static class DataAccessServicesConfiguration
    {
        public static void AddDataAccessServices(
            this IServiceCollection services,
            IConfiguration config)
        {
            var connectionString = config.GetConnectionString("Easybuild");
            var fileStorageUri = config.GetValue<string>("FileStorageUri");

            services.AddDbContext<ApplicationDBContext>(options =>
            {
                if (Debugger.IsAttached)
                {
                    options.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddDebug()));
                }

                options.UseSqlServer(connectionString);
            });

            services.AddScoped<IDatabaseUnitOfWork, DatabaseUnitOfWork>();
            services.AddScoped<IFileRepository, FileRepository>(provider =>
            {
                return new FileRepository(fileStorageUri);
            });
        }
    }
}