using Easybuild.Cryptography;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace IOTEmulator
{
    class Program
    {
        const int ownerId = 5;

        static async Task Main(string[] args)
        {
            while (true)
            {
                try
                {
                    await StartInfiniteMessageSending();
                }
                catch
                {
                    //Ignore Unauthorized 401
                }
            }
        }

        static async Task StartInfiniteMessageSending()
        {
            var jwt = await AuthenticateAsync();

            var hubConnection = new HubConnectionBuilder()
                .WithUrl("https://localhost:44321/api/v1/iothub", options =>
                {
                    options.Headers["Authorization"] = $"Bearer {jwt}";
                })
                .Build();

            await hubConnection.StartAsync();

            while (true)
            {
                Console.Write("Enter your message:");
                var message = Console.ReadLine();
                await hubConnection.InvokeAsync("IOTDeviceWorks", ownerId, message);
            }
        }

        static async Task<string> AuthenticateAsync()
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://localhost:44321/api/v1/");

            var rsaKeyResponse = await client.GetAsync("security/public-key/rsa");
            var rsaKeyStr = await rsaKeyResponse.Content.ReadAsStringAsync();
            RSAEncryptor.ImportPublicKeyPKCS1(rsaKeyStr);

            var username = "746c5df6-feb8-46a6-b609-41230e4bfba2";
            var password = "TestPassword123";
            password = RSAEncryptor.EncryptString(password);

            var response = await client.PostAsync(
                "account/login",
                new StringContent(JsonConvert.SerializeObject(new { username, password }), Encoding.UTF8, "application/json"));

            var responseStr = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<JToken>(responseStr);
            return result["jwt"].Value<string>();
        }
    }
}