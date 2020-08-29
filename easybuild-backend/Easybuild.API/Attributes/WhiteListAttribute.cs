using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Easybuild.API.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    sealed public class WhiteListAttribute : ValidationAttribute
    {
        public IEnumerable<object> WhiteList { get; }

        public WhiteListAttribute(params object[] whiteList)
        {
            WhiteList = new List<object>(whiteList);
        }

        public override bool IsValid(object value)
        {
            return WhiteList.Contains(value);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"{name} must be one of these values: {string.Join(",", WhiteList.ToString())}";
        }
    }
}