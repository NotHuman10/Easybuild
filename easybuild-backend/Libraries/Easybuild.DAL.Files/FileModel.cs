using Easybuild.DAL.Entities;

namespace Easybuild.DAL.Files
{
    public class FileModel
    {
        public FileMetadata Metadata { get; set; }

        public byte[] Data { get; set; }
    }
}