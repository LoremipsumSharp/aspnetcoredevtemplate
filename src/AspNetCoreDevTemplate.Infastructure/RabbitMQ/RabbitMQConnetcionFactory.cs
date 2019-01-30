
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AspNetCoreDevTemplate.Infastructure.RabbitMQ
{
    public class RabbitMQConnectionFactory : ConnectionFactory
    {
        private readonly RabbitMQOptions _mqOptions;
        private readonly ILogger<RabbitMQConnectionFactory> _logger;

        public RabbitMQConnectionFactory(
            ILogger<RabbitMQConnectionFactory> logger,
            IOptions<RabbitMQOptions> mqOptions) : base()
        {
            _mqOptions = mqOptions.Value;
            this.UserName = _mqOptions.UserName;
            this.Password = _mqOptions.Password;
            this.VirtualHost = _mqOptions.VirtualHost;
            this.HostName = _mqOptions.HostName;
            this.Uri = _mqOptions.Uri;
            this._logger = logger;
        }
    }
}