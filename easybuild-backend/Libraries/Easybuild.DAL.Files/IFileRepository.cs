using Easybuild.DAL.Entities;

namespace Easybuild.DAL.Files
{
    public interface IFileRepository
    {
        void Create(FileModel file);

        FileModel Read(FileMetadata metadata);

        int Update(FileModel file);

        int Delete(FileMetadata metadata);
    }
}