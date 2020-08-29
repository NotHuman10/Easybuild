using System;
using System.Collections.Generic;
using System.Linq;

namespace Easybuild.DAL
{
    public class Page<T>
    {
        public List<T> Items { get; protected set; }

        public int TotalItems { get; protected set; }

        public int PageSize { get; protected set; }

        public int PageCount { get; private set; }

        public int PageIndex { get; protected set; }

        public Page(IEnumerable<T> items, int pageIndex, int pageSize, int total)
        {
            Items = items.ToList();
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalItems = total;

            var pages = (decimal)TotalItems / PageSize;
            PageCount = (int)Math.Round(pages, MidpointRounding.ToPositiveInfinity);
        }

        public Page<C> Convert<C>(Func<T, C> converter)
        {
            var items = Items.Select(i => converter(i)).ToList();
            return new Page<C>(items, PageIndex, PageSize, TotalItems);
        }
    }
}