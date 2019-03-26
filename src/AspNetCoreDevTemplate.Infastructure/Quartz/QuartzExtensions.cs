using System;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Quartz.Impl;
using Quartz.Spi;
using Quartz;
using AspNetCoreDevTemplate.Infastructure;
using AspNetCoreDevTemplate.Infastructure.Quartz;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AspNetCoreDevTemplate.Infastructure.Quartz
{
    public static class QuartzExtensions
    {
        /// <summary>
        /// Register Quartz.NET and a list of jobs for the DI container.
        /// </summary>
        /// <param name="services">Services.</param>
        /// <param name="jobs">List of Quartz jobs to register.</param>
        public static void UseQuartz(this IServiceCollection services, IConfiguration configuration, params Type[] jobs)
        {

            services.AddSingleton<IJobFactory, BatchJobFactory>();
            services.Add(jobs.Select(jobType => new ServiceDescriptor(jobType, jobType, ServiceLifetime.Transient)));

            services.AddSingleton(provider =>
            {

                var props = new NameValueCollection();
                props.Add("quartz.jobStore.type", "Quartz.Impl.AdoJobStore.JobStoreTX, Quartz");
                props.Add("quartz.jobStore.useProperties", "true");
                props.Add("quartz.jobStore.dataSource", "default");
                props.Add("quartz.jobStore.tablePrefix", "QRTZ_");
                props.Add("quartz.jobStore.driverDelegateType", "Quartz.Impl.AdoJobStore.SQLiteDelegate, Quartz");
                props.Add("quartz.dataSource.default.provider", "SQLite-Microsoft");
                props.Add("quartz.dataSource.default.connectionString", configuration["ConnectionStrings:Quartz"]);
                props.Add("quartz.serializer.type", "json");
                var schedulerFactory = new StdSchedulerFactory(props);
                var scheduler = schedulerFactory.GetScheduler().Result;
                scheduler.JobFactory = provider.GetService<IJobFactory>();
                //scheduler.Clear();
                scheduler.Start();

                return scheduler;
            });
            EnsureDatabase(configuration["ConnectionStrings:Quartz"], configuration["Quartz:SchemaFile"]);
        }
        private static void EnsureDatabase(string connStr, string schemaFilePath)
        {
            using (SqliteConnection quartzConnection = new SqliteConnection(connStr))
            {
                quartzConnection.Open();

                if (new FileInfo(quartzConnection.DataSource).Length == 0)
                {
                    string script = File.ReadAllText(schemaFilePath);

                    using (var command = quartzConnection.CreateCommand())
                    {
                        command.CommandText = script;
                        command.ExecuteNonQuery();
                    }
                }
            }
        }
        public static void StartJob<TJob>(this IScheduler scheduler, ITrigger trigger, IDictionary<string, object> jobData = null)
       where TJob : IJob
        {

            var jobName = typeof(TJob).Name;

            var job = JobBuilder.Create<TJob>()
              .WithIdentity(jobName)
              .Build();

            if (jobData != null)
            {
                foreach (var key in jobData.Keys)
                {
                    job.JobDataMap[key] = jobData[key];
                }
            }
            scheduler.ScheduleJob(job, trigger);
        }

    }
}