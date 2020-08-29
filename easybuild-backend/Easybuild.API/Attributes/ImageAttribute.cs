using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;

namespace Easybuild.API.Attributes
{
    public class ImageAttribute : FormFileAttribute
    {
        private static readonly string[] validMimeTypes = {
            "image/jpg",
            "image/jpeg",
            "image/pjpeg",
            "image/gif",
            "image/x-png",
            "image/png",
            "image/tiff",
            "image/bmp"
        };

        private static readonly string[] validFileExtensions = {
            ".jpg",
            ".png",
            ".gif",
            ".jpeg"
        };

        private bool CheckMimeTypes(IFormFile postedFile)
        {
            var mime = postedFile.ContentType.ToLower();
            return validMimeTypes.Contains(mime);
        }

        private bool CheckExtension(IFormFile postedFile)
        {
            var ext = Path.GetExtension(postedFile.FileName).ToLower();
            return validFileExtensions.Contains(ext);
        }

        public override bool Validate(IFormFile file)
        {
            if (CheckMimeTypes(file) && CheckExtension(file))
            {
                return true;
            }
            else
            {
                ErrorMessage = $"Data passed isn't an image instance";
                return false;
            }
        }
    }
}