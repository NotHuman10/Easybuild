using AutoMapper;
using Easybuild.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Easybuild.API.Controllers
{
    [Route("api/v1/job-categories")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class JobCategoriesController : Controller
    {
        private readonly IDatabaseUnitOfWork _db;
        private readonly IMapper _mapper;

        public JobCategoriesController(
            IDatabaseUnitOfWork uow,
            IMapper mapper)
        {
            _db = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var allCategories = _db.JobCategories.GetAllActive();

            var result = allCategories.Select(c => _mapper.Map<JobCategoryDTO>(c));

            return Ok(result);
        }
    }
}