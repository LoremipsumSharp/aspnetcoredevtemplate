

using System.Collections.Generic;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using Microsoft.Extensions.Logging;

namespace AspNetCoreDevTemplate.Infastructure.RabbitMQ
{
    public abstract class RabbitMQConsumerBase
    {
        private readonly RabbitMQConsumerOptions _options;
        private readonly IConnectionFactory _connFactory;
        private IConnection _rabbitConnection;
        private IModel _channel;
        private readonly ILogger<RabbitMQConsumerBase> _logger;

        public RabbitMQConsumerBase(IOptions<RabbitMQConsumerOptions> options, IConnectionFactory facoty, ILogger<RabbitMQConsumerBase> logger)
        {
            _options = options.Value;
            _connFactory = facoty;
            _logger = logger;
            Initialize();

        }

        public abstract bool OnMessage(BasicDeliverEventArgs args);

        private void Initialize()
        {
            _rabbitConnection = _connFactory.CreateConnection();
            _channel = _rabbitConnection.CreateModel();
            _channel.ExchangeDeclare(_options.ExchangeName, _options.ExchangeType, durable: true);
            _channel.QueueDeclare(_options.QueueName, _options.DurableQueue, exclusive: false, autoDelete: false);
            _channel.QueueBind(_options.QueueName, _options.ExchangeName, _options.RoutingKey);
        }
        public void Start()
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (sender, args) =>
            {
                try
                {
                    if (OnMessage(args))
                    {
                        _channel.BasicAck(args.DeliveryTag, multiple: false);
                    }
                    else
                    {
                        _logger.LogError("fail to handle message",args);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "fail to handle message");
                }

            };
            _channel.BasicConsume(_options.QueueName, autoAck: false, consumer: consumer);
        }


    }
}