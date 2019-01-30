

using System;

namespace AspNetCoreDevTemplate.Infastructure.RabbitMQ
{
    public class RabbitMQOptions
    {
        public string HostName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string VirtualHost { get; set; }
        public Uri Uri { get; set; }
    }
}