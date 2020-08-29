using AutoMapper;
using Easybuild.API.Utilities;
using Easybuild.DAL;
using Easybuild.DAL.Entities;
using Easybuild.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class AdvertController : Controller
    {
        private readonly IDatabaseUnitOfWork _db;
        private readonly IMapper _mapper;

        public AdvertController(IDatabaseUnitOfWork uow, IMapper mapper)
        {
            _db = uow;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var advertExtendedEntity = _db.Adverts.GetExtended(id, this.User.GetId());
            var advertDTO = _mapper.Map<AdvertExtendedDTO>(advertExtendedEntity);
            return Ok(advertDTO);
        }

        [HttpPost]
        public IActionResult Post(AdvertDTO advert)
        {
            FileMetadata image = null;
            if (advert.ImageId != null)
            {
                image = _db.FileMetadata.Read(advert.ImageId.Value);
                if (image == null)
                {
                    return NotFound($"Image {image.Id} not found!");
                }
                else if (image.Assigned)
                {
                    return Conflict($"Image {image.Id} is already used!");
                }
                else if (image.OwnerId != User.GetId())
                {
                    return Conflict($"Image {image.Id} is owned by another user!");
                }
            }

            advert.UserId = User.GetId();
            var advertEntity = _mapper.Map<Advert>(advert);
            try
            {
                _db.StartTransaction();
                var advertId = _db.Adverts.Create(advertEntity);
                _db.Adverts.CreateFavorite(new AdvertFavorite
                {
                    UserId = User.GetId(),
                    AdvertId = advertId
                });

                if (image != null)
                {
                    image.Assigned = true;
                    _db.FileMetadata.Update(image);
                }

                _db.Commit();
            }
            catch
            {
                _db.Rollback();
                throw;
            }

            return Created(string.Empty, advertEntity.Id);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _db.Adverts.Read(id);
            if (deleted.UserId != User.GetId())
            {
                return Forbid();
            }

            _db.Adverts.Delete(id);
            _db.Commit();
            return NoContent();
        }

        [HttpPost("search")]
        public IActionResult Search(AdvertPageRequest request)
        {
            request.Role = User.GetRole();
            request.UserId = User.GetId();
            var result = _db.Adverts.Search(request).Convert(a => _mapper.Map<AdvertExtendedDTO>(a));
            return Ok(result);
        }

        [HttpPost("favorite")]
        public IActionResult AddFavorite([FromBody]int advertId)
        {
            var favorite = new AdvertFavorite
            {
                UserId = User.GetId(),
                AdvertId = advertId
            };

            _db.Adverts.CreateFavorite(favorite);
            _db.Commit();
            return NoContent();
        }

        [HttpDelete("favorite/{id}")]
        public IActionResult DeleteFavorite(int id)
        {
            var deleted = _db.Adverts.DeleteFavorite(User.GetId(), id);
            _db.Commit();
            return Ok(deleted);
        }

        [HttpPost("favorite/search")]
        public IActionResult GetFavorites(AdvertFavoritePageRequest request)
        {
            request.UserId = User.GetId();
            if (string.IsNullOrWhiteSpace(request.OrderBy))
            {
                request.OrderBy = nameof(Advert.Title);
            }

            if (request.SortOrder == 0)
            {
                request.SortOrder = SortOrder.ASC;
            }

            var page = _db.Adverts.FavoriteAdverts(request);
            return Ok(page.Convert(a => _mapper.Map<AdvertExtendedDTO>(a)));
        }
    }
}