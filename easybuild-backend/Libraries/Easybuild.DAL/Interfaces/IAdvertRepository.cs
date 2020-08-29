using Easybuild.DAL.Entities;
using Easybuild.DAL.Models;

namespace Easybuild.DAL
{
    public interface IAdvertRepository : IBaseRepository<Advert, int>
    {
        Page<AdvertExtended> Search(AdvertPageRequest request);

        Page<AdvertExtended> FavoriteAdverts(AdvertFavoritePageRequest request);

        AdvertExtended GetExtended(int id, int userId);

        void CreateFavorite(AdvertFavorite favorite);

        int DeleteFavorite(int userId, int advertId);
    }
}