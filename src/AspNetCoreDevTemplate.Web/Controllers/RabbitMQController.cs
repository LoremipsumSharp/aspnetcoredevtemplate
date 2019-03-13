


using System;
using AspNetCoreDevTemplate.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Messaging.RabbitMQ;

namespace AspNetCoreDevTemplate.Web
{
    public class RabbitMQController : Controller
    {
        private readonly IRabbitMQMessenger _rabbitmqMessagener;
        public RabbitMQController(IRabbitMQMessenger rabbitmqMessagener)
        {
            _rabbitmqMessagener = rabbitmqMessagener;
        }

        public IActionResult Index()
        {
            _rabbitmqMessagener.PublishDelay(new SimpleMQMessage(){ Body = "Helloworld" },TimeSpan.FromSeconds(5));
            return Ok();
        }
    }
}