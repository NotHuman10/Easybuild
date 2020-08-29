using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL.Models
{
    public abstract class PageRequest
    {
        [Range(0, int.MaxValue)]
        public int PageIndex { get; set; }

        [Range(1, 50)]
        public int PageSize { get; set; }

        public string OrderBy { get; set; }

        public SortOrder SortOrder { get; set; }
    }
}