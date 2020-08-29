using System;
using System.ComponentModel.DataAnnotations;

namespace Easybuild.DAL
{
    public interface IEntity<T> where T : struct, IComparable
    {
        [Key]
        T Id { get; set; }
    }
}