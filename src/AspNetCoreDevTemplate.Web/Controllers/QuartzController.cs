

using System;
using AspNetCoreDevTemplate.Infastructure.Quartz;
using AspNetCoreDevTemplate.Serivces.Jobs;
using AspNetCoreDevTemplate.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Quartz;

namespace AspNetCoreDevTemplate.Web.Controllers
{
    public class QuartzController : Controller
    {
        private readonly IScheduler _scheduler;
        public QuartzController(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }
        public IActionResult Index()
        {
            ITrigger trigger = TriggerBuilder.Create()
      .StartNow()
      .WithSimpleSchedule(x => x
        .WithIntervalInSeconds(5)
        .RepeatForever())
      .Build();
            _scheduler.StartJob<HelloWorldJob>(trigger);
            
            return Ok("Job is running");
        }

        public IActionResult Start()
        {
            return Ok("start the job");
        }

    }
}