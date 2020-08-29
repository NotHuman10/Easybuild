using Easybuild.DAL.Entities;
using System;

namespace Easybuild.DAL
{
    public interface IFileMetadataRepository : IBaseRepository<FileMetadata, Guid>
    {
    }
}