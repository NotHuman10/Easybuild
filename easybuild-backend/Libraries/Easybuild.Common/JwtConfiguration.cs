namespace Easybuild.Common
{
    public class JwtConfiguration
    {
        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int LifetimeSeconds { get; set; }

        public string KeyPhrase { get; set; }
    }
}