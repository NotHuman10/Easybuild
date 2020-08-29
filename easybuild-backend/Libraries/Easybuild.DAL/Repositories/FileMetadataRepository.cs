using Easybuild.DAL.Entities;
using System;

namespace Easybuild.DAL
{
    internal class FileMetadataRepository : BaseRepository<FileMetadata, Guid>, IFileMetadataRepository
    {
        public FileMetadataRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
        }
    }
}