using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.API.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
    public abstract class FormFileAttribute : ValidationAttribute
    {
        protected bool TryReadCheck(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            return stream.CanRead;
        }

        public abstract bool Validate(IFormFile file);

        public override bool IsValid(object value)
        {
            if (!(value is IFormFile file) || !TryReadCheck(file))
            {
                ErrorMessage = $"Data passed isn't a file instance";
                return false;
            }

            return Validate(file);
        }
    }
}