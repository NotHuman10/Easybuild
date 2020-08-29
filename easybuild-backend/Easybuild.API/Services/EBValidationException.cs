using System;

namespace Easybuild.API.Services
{
    public class EBValidationException : Exception
    {
        public EBValidationException(string message) : base(message)
        {
        }
    }
}