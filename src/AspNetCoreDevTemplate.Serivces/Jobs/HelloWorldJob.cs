
using System;
using System.Threading.Tasks;
using Quartz;

namespace AspNetCoreDevTemplate.Serivces.Jobs
{
    public class HelloWorldJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello World");
            return Task.CompletedTask;
        }
    }
}