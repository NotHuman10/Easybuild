using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Easybuild.Cryptography
{
    public static class RSAEncryptor
    {
        const int DefaultKeySize = 2048;
        private static byte[] publicKey;
        private static byte[] privateKey;

        static RSAEncryptor()
        {
            GenerateNewKeys();
        }

        public static void GenerateNewKeys(int keySize = DefaultKeySize)
        {
            using var rsa = RSA.Create(keySize);
            publicKey = rsa.ExportSubjectPublicKeyInfo();
            privateKey = rsa.ExportRSAPrivateKey();
        }

        public static byte[] Encrypt(byte[] data)
        {
            using var rsa = RSA.Create();
            rsa.ImportSubjectPublicKeyInfo(publicKey, out int bytesRead);
            return rsa.Encrypt(data, RSAEncryptionPadding.Pkcs1);
        }

        public static byte[] Decrypt(byte[] data)
        {
            using var rsa = RSA.Create();
            rsa.ImportRSAPrivateKey(privateKey, out int bytesRead);
            return rsa.Decrypt(data, RSAEncryptionPadding.Pkcs1);
        }

        public static string EncryptString(string data)
        {
            var bytes = Encoding.UTF8.GetBytes(data);
            return Convert.ToBase64String(Encrypt(bytes));
        }

        public static string DecryptString(string data)
        {
            var bytes = Convert.FromBase64String(data);
            return Encoding.UTF8.GetString(Decrypt(bytes));
        }

        public static string ExportPublicKey()
        {
            var result = new StringBuilder();
            result.AppendLine("-----BEGIN PUBLIC KEY-----");
            Regex.Matches(Convert.ToBase64String(publicKey), ".{1,64}")
                .Select(m => m.Value).ToList()
                .ForEach(l => result.AppendLine(l));
            result.Append("-----END PUBLIC KEY-----");
            return result.ToString();
        }

        public static string ExportPrivateKey()
        {
            var result = new StringBuilder();
            result.AppendLine("-----BEGIN RSA PRIVATE KEY-----");
            Regex.Matches(Convert.ToBase64String(privateKey), ".{1,64}")
                .Select(m => m.Value).ToList()
                .ForEach(l => result.AppendLine(l));
            result.Append("-----END RSA PRIVATE KEY-----");
            return result.ToString();
        }

        public static void ImportPublicKeyPKCS1(string key)
        {
            var lines = key.Split("\\r\\n").Skip(1).SkipLast(1);
            publicKey = Convert.FromBase64String(string.Join(string.Empty, lines));
        }

        public static void ImportPrivateKeyPKCS1(string key)
        {
            var lines = key.Split("\\r\\n").Skip(1).SkipLast(1);
            privateKey = Convert.FromBase64String(string.Join(string.Empty, lines));
        }
    }
}