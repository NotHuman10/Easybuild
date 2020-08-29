using System;
using System.Linq;
using System.Linq.Expressions;

namespace Easybuild.DAL
{
    internal static class IQueryableExtensions
    {
        public static IOrderedQueryable<TSource> OrderBy<TSource, TKey>(
            this IQueryable<TSource> source,
            Expression<Func<TSource, TKey>> keySelector,
            SortOrder order)
        {
            return order == SortOrder.ASC ? source.OrderBy(keySelector) : source.OrderByDescending(keySelector);
        }
    }
}