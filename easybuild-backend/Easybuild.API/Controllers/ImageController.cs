using Easybuild.API.Attributes;
using Easybuild.API.Services;
using Easybuild.API.Utilities;
using Easybuild.DAL;
using Easybuild.DAL.Entities;
using Easybuild.DAL.Files;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Net;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Authorize]
    public class ImageController : Controller
    {
        private readonly IFileRepository _fs;
        private readonly IDatabaseUnitOfWork _db;
        private readonly ImageConverter _imgConverter;
        private readonly IConfiguration _config;

        private int MaxImageWidth => _config.GetValue<int>("ImageDimensions:MaxWidth");

        private int MaxImageHeight => _config.GetValue<int>("ImageDimensions:MaxHeight");

        public ImageController(
            IFileRepository files,
            IDatabaseUnitOfWork uow,
            ImageConverter imgConverter,
            IConfiguration config)
        {
            _fs = files;
            _db = uow;
            _imgConverter = imgConverter;
            _config = config;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetInfo(Guid id)
        {
            var metadata = _db.FileMetadata.Read(id);
            if (metadata == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(metadata);
            }
        }

        [HttpGet("{id}/download")]
        [AllowAnonymous]
        public IActionResult Download([FromRoute] Guid id)
        {
            var metadata = _db.FileMetadata.Read(id);
            if (metadata == null)
            {
                return NotFound();
            }

            var file = _fs.Read(metadata);
            if (file.Data == null)
            {
                return NotFound();
            }
            else
            {
                var origName = file.Metadata.OriginalFileName;
                new FileExtensionContentTypeProvider().TryGetContentType(origName, out string contentType);
                return File(file.Data, contentType, origName);
            }
        }

        [HttpGet("{id}/data")]
        [AllowAnonymous]
        public IActionResult Get([FromRoute] Guid id)
        {
            var metadata = _db.FileMetadata.Read(id);
            if (metadata == null)
            {
                return NotFound();
            }

            var file = _fs.Read(metadata);
            if (file.Data == null)
            {
                return NotFound();
            }
            else
            {
                var origName = file.Metadata.OriginalFileName;
                new FileExtensionContentTypeProvider().TryGetContentType(origName, out string contentType);
                return File(file.Data, contentType);
            }
        }

        [HttpPost]
        public IActionResult Post([Required][Image] IFormFile file)
        {
            var metadata = new FileMetadata
            {
                OriginalFileName = file.FileName,
                UploadDate = DateTime.Now,
                FileType = FileType.Image,
                OwnerId = User.GetId()
            };

            var fileObj = new FileModel
            {
                Metadata = metadata,
                Data = GetPreprocessedImage(file)
            };

            try
            {
                _db.StartTransaction();
                _db.FileMetadata.Create(metadata);
                _fs.Create(fileObj);
                _db.Commit();
            }
            catch
            {
                _db.Rollback();
                _fs.Delete(metadata);
                throw;
            }

            return StatusCode((int)HttpStatusCode.Created, fileObj.Metadata.Id);
        }

        [HttpPut("{id}")]
        public IActionResult Put([Required][Image] IFormFile file, [FromRoute] Guid id)
        {
            var userId = User.GetId();
            var metadata = _db.FileMetadata.Read(id);
            if (metadata == null || metadata.FileType != FileType.Image)
            {
                ModelState.AddModelError(nameof(id), $"Image with id {id} doen't exist");
                return BadRequest(ModelState);
            }

            if (metadata.OwnerId != userId)
            {
                return Conflict($"Image {id} is owned by another user");
            }

            metadata.UploadDate = DateTime.Now;
            metadata.OriginalFileName = file.FileName;
            var fileObj = new FileModel
            {
                Metadata = metadata,
                Data = GetPreprocessedImage(file)
            };

            try
            {
                _db.StartTransaction();
                _db.FileMetadata.Update(metadata);
                _fs.Update(fileObj);
                _db.Commit();
            }
            catch
            {
                _db.Rollback();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            var userId = User.GetId();
            var metadata = _db.FileMetadata.Read(id);
            if (metadata == null || metadata.FileType != FileType.Image)
            {
                ModelState.AddModelError(nameof(id), $"Image with id {id} doen't exist");
                return BadRequest(ModelState);
            }

            if (metadata.OwnerId != userId)
            {
                return Conflict($"Image {id} is owned by another user");
            }

            try
            {
                _db.StartTransaction();
                _db.FileMetadata.Delete(id);
                _fs.Delete(metadata);
                _db.Commit();
            }
            catch
            {
                _db.Rollback();
                throw;
            }

            return NoContent();
        }

        private byte[] GetPreprocessedImage(IFormFile image)
        {
            using var s = image.OpenReadStream();
            var (width, height) = _imgConverter.GetDimensions(s);
            using var ms = new MemoryStream();
            if (width > MaxImageWidth || height > MaxImageHeight)
            {
                using var converted = _imgConverter.FitContain(s, MaxImageWidth, MaxImageHeight);
                converted.CopyTo(ms);
            }
            else
            {
                s.CopyTo(ms);
            }

            return ms.ToArray();
        }
    }
}