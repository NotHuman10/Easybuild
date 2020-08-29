using System;
using System.Security.Cryptography;
using System.Text;

namespace Easybuild.Cryptography
{
    public static class HashUtil
    {
        const int SALT_LENGTH = 256;

        private static readonly RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider();
        private static readonly SHA256 sha256Hash = SHA256.Create();

        public static string GetRandomSalt()
        {
            var randomBytes = new byte[SALT_LENGTH / 8];
            rngCsp.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        public static string ComputeHash(string password, string salt)
        {
            var bytes = Encoding.ASCII.GetBytes(salt + password);
            var hash = sha256Hash.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}