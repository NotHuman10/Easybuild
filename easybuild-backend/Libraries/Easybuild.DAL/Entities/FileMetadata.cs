using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Entities
{
    public class FileMetadata : IEntity<Guid>
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string OriginalFileName { get; set; }

        public int? OwnerId { get; set; }

        public User Owner { get; set; }

        public FileType FileType { get; set; }

        public DateTime UploadDate { get; set; }

        public bool Assigned { get; set; }
    }
}