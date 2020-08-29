namespace Easybuild.API
{
    public class AuthModel
    {
        public string Jwt { get; set; }

        public UserDTO User { get; set; }
    }
}