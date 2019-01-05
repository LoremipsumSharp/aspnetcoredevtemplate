using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace AspNetCoreDevTemplate.Utils.Extensions
{
    public static class ObjectExtensions

    {
        private static readonly Regex _bearRegex = new Regex("((B|b)earer\\s)");
        /// <summary>
        ///  将一个匿名对象转化为dictionary
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static IDictionary<string, T> AnonymousObjectToDictionary<T>(
         this object obj, Func<object, T> valueSelect)
        {
            return TypeDescriptor.GetProperties(obj)
                .OfType<PropertyDescriptor>()
                .ToDictionary<PropertyDescriptor, string, T>(
                    prop => prop.Name,
                    prop => valueSelect(prop.GetValue(obj))
                );
        }
        public static bool IsNullOrEmpty<T>(this IEnumerable<T> source)
        {
            return source == null || !source.Any();
        }
        /// <summary>
        /// 获取bearer token
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string GetBearerToken(this HttpContext context)
        {
            var bearer = "Bearer" + ' '.ToString();
            var authHeader = context.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authHeader))
                return _bearRegex.Replace(authHeader, string.Empty).Trim();
            return null;
        }
    }

}