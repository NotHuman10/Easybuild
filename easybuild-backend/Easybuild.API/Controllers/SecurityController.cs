using Easybuild.Cryptography;
using Microsoft.AspNetCore.Mvc;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class SecurityController : Controller
    {
        [HttpGet("public-key/{algorithm}")]
        public IActionResult PublicKey(string algorithm)
        {
            return algorithm.ToUpper() switch
            {
                "RSA" => Ok(RSAEncryptor.ExportPublicKey()),
                _ => NotFound()
            };
        }
    }
}