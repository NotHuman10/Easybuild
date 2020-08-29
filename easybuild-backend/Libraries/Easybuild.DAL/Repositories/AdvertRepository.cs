using Easybuild.DAL.Entities;
using Easybuild.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq;

namespace Easybuild.DAL.Repositories
{
    internal sealed class AdvertRepository : BaseRepository<Advert, int>, IAdvertRepository
    {
        public AdvertRepository(ApplicationDBContext dbContext) : base(dbContext) { }

        public Page<AdvertExtended> Search(AdvertPageRequest request)
        {
            var result = _table.AsQueryable();

            result = result.Where(a => a.User.RoleId != request.Role);

            if (request.JobCategoriesId != null && request.JobCategoriesId.Count > 0)
            {
                result = result.Where(
                    a => a.JobProposals.Any(jp => request.JobCategoriesId.Contains(jp.JobCategoryId)));
            }

            if (!string.IsNullOrWhiteSpace(request.SearchKeywords))
            {
                result = ApplyKeywordsCriteria(result, request);
            }

            if (request.AdvertSortingOption == AdvertSortingOption.DateAdded)
            {
                result = result.OrderBy(a => a.CreatedDate, request.SortOrder);
            }
            else if (request.AdvertSortingOption == AdvertSortingOption.AccountRating)
            {
                result = result.OrderBy(a => a.User.Rating, request.SortOrder);
            }
            else if (request.AdvertSortingOption == AdvertSortingOption.CompletedContracts)
            {
                result = result.OrderBy(
                    a => a.User.Contracts.Where(c => c.Status == ContractStatus.Completed).Count(),
                    request.SortOrder);
            }

            var total = result.Count();
            var set = result
                .Include(a => a.User)
                .Skip(request.PageIndex * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new AdvertExtended
                {
                    BaseAdvert = a,
                    IsFavorite = a.FavoriteUsers.Any(u => u.UserId == request.UserId)
                })
                .ToList();

            return new Page<AdvertExtended>(set, request.PageIndex, request.PageSize, total);
        }

        public Page<AdvertExtended> FavoriteAdverts(AdvertFavoritePageRequest request)
        {
            var query = _db.Set<AdvertFavorite>()
                .Where(f => f.UserId == request.UserId)
                .Select(f => f.Advert)
                .Where(a => !request.ShowOnlyMy || a.UserId == request.UserId)
                .Skip(request.PageIndex * request.PageSize)
                .Take(request.PageSize);

            var total = query.Count();
            var set = query
                .Include(a => a.User)
                .Select(a => new AdvertExtended
                {
                    BaseAdvert = a,
                    IsFavorite = true
                })
                .ToList();

            return new Page<AdvertExtended>(set, request.PageIndex, request.PageSize, total);
        }

        public void CreateFavorite(AdvertFavorite favorite)
        {
            _db.Set<AdvertFavorite>().Add(favorite);
            _db.SaveChanges();
        }

        public int DeleteFavorite(int userId, int advertId)
        {
            var entity = new AdvertFavorite
            {
                UserId = userId,
                AdvertId = advertId
            };

            _db.Entry(entity).State = EntityState.Deleted;
            return _db.SaveChanges();
        }

        public override Advert Read(int id)
        {
            return _table
                .Include(a => a.User)
                .Include(a => a.JobProposals)
                .ThenInclude(a => a.JobCategory)
                .SingleOrDefault(a => a.Id == id);
        }

        private IQueryable<Advert> ApplyKeywordsCriteria(IQueryable<Advert> query, AdvertPageRequest pageRequest)
        {
            var keywordsArray = pageRequest.SearchKeywords
                    .Split('.', ',', ';', ' ')
                    .Select(w => w.Trim())
                    .Where(w => !string.IsNullOrWhiteSpace(w))
                    .ToArray();

            var result = query;
            if (pageRequest.SearchInDescription)
            {
                foreach (var keyword in keywordsArray)
                {
                    result = result.Where(a => EF.Functions.Like(a.Title + a.Description, $"%{keyword}%"));
                }
            }
            else
            {
                foreach (var keyword in keywordsArray)
                {
                    result = result.Where(a => EF.Functions.Like(a.Title, $"%{keyword}%"));
                }
            }

            return result;
        }

        public AdvertExtended GetExtended(int id, int userId)
        {
            return _table
                .Where(a => a.Id == id)
                .Include(a => a.User)
                .Include(a => a.JobProposals)
                .ThenInclude(p => p.JobCategory)
                .Select(a => new AdvertExtended
                {
                    BaseAdvert = a,
                    IsFavorite = a.FavoriteUsers.Any(u => u.UserId == userId)
                })
                .First();
        }
    }
}