


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
            _rabbitmqMessagener.Publish(new SimpleMQMessage(){ Body = "Helloworld" });
            return Ok();
        }
    }
}