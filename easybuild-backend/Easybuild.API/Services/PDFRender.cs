using jsreport.Binary;
using jsreport.Local;
using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;

namespace Easybuild.Reporting
{
    //TODO: take out reporting process to standalone service (run jsreport as standalone service)
    public class PDFRender
    {
        private static readonly ILocalUtilityReportingService reportingService;

        static PDFRender()
        {
            reportingService = new LocalReporting()
                .UseBinary(JsReportBinary.GetBinary())
                .Configure(cfg => cfg.FileSystemStore().BaseUrlAsWorkingDirectory())
                .AsUtility()
                .Create();
        }

        public async Task<Stream> RenderAsync<T>(string reportName, T data)
        {
            var jsonData = JsonConvert.SerializeObject(data, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            var report = await reportingService.RenderByNameAsync(reportName, jsonData);
            return report.Content;
        }
    }
}