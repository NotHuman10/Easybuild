using Easybuild.DAL.Entities;
using System.IO;
using System.Linq;

namespace Easybuild.DAL.Files
{
    public class FileRepository : IFileRepository
    {
        protected string StoragePath { get; set; }

        public FileRepository(string storagePath)
        {
            StoragePath = storagePath;
        }

        protected string GetFilePathByMetadata(FileMetadata metadata)
        {
            var idStr = metadata.Id.ToString("n");
            return Path.Combine(
                StoragePath,
                metadata.FileType.ToString(),
                idStr[0..2],
                idStr[2..4],
                idStr[4..] + Path.GetExtension(metadata.OriginalFileName));
        }

        public void Create(FileModel file)
        {
            var path = GetFilePathByMetadata(file.Metadata);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(path));
            }

            File.WriteAllBytes(path, file.Data);
        }

        public FileModel Read(FileMetadata metadata)
        {
            var path = GetFilePathByMetadata(metadata);
            var data = File.Exists(path) ? File.ReadAllBytes(path) : null;
            return new FileModel
            {
                Metadata = metadata,
                Data = data
            };
        }

        public int Update(FileModel file)
        {
            var path = GetFilePathByMetadata(file.Metadata);
            var directoryToSearch = new DirectoryInfo(Path.GetDirectoryName(path));
            var searchPattern = Path.GetFileNameWithoutExtension(path);
            var oldFileInfo = directoryToSearch.GetFiles($"*{searchPattern}.*").SingleOrDefault();
            if (oldFileInfo != null)
            {
                oldFileInfo.Delete();
                Create(file);
                return 1;
            }
            else
            {
                return 0;
            }
        }

        public int Delete(FileMetadata metadata)
        {
            var path = GetFilePathByMetadata(metadata);
            if (File.Exists(path))
            {
                File.Delete(path);
                return 1;
            }
            else
            {
                return 0;
            }
        }
    }
}