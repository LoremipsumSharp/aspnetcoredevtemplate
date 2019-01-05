

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using AspNetCoreDevTemplate.Utils.Extensions;
using AspNetCoreDevTemplate.Serivces.EventHandlers.Base;

namespace AspNetCoreDevTemplate.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEventHandlers(this IServiceCollection serviceCollection, IEnumerable<Assembly> assemblies)
        {
            IEnumerable<Type> types = assemblies.
            SelectMany(x => x.GetTypes()).Where(t => t.IsConcreteClass() &&
             t.ImplementsGenericInterface(typeof(IEventHandler<>)));
            foreach (Type type in types)
            {
                IEnumerable<Type> interfaceTypes = type.GetGenericInterfaces(typeof(IEventHandler<>));
                foreach (Type interfaceType in interfaceTypes)
                {
                    serviceCollection.AddScoped(interfaceType, type);
                }
            }
            return serviceCollection;
        }
    }
}