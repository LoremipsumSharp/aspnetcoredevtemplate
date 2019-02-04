// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System;
using System.Collections.Generic;
using System.Text;
using AspNetCoreDevTemplate.Infastructure;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Microsoft.Extensions.Messaging.RabbitMQ.Internal
{
    public class RabbitMQMessenger : IRabbitMQMessenger
    {
        private readonly RabbitMQSubscriptionBuilder _builder;
        private readonly IPersistentRabbitMQConnection _connection;
        private bool _disposed;
        private readonly string _exchangeName;
        private readonly ILogger _logger;
        private IModel _model;
        private IModel _delayModel;
        private IModel _delay;
        private readonly string _queueName;
        private readonly string _delayQueueName;
        private readonly string _delayExchange;

        public RabbitMQMessenger(
            IPersistentRabbitMQConnection connection,
            RabbitMQSubscriptionBuilder builder,
            ILogger logger,
            string exchangeName,
            string queueName)
        {
            Guard.ArgumentNotNull(nameof(connection), connection);
            Guard.ArgumentNotNull(nameof(builder), builder);
            Guard.ArgumentNotNull(nameof(logger), logger);
            Guard.ArgumentNotNullOrEmpty(nameof(exchangeName), exchangeName);
            Guard.ArgumentNotNullOrEmpty(nameof(queueName), queueName);

            _connection = connection;
            _builder = builder;
            _logger = logger;
            _exchangeName = exchangeName;
            _queueName = queueName;
            _delayExchange = $"Delay_{_exchangeName}";
            _delayQueueName = $"Delay_{_queueName}";
            _model = CreateModel();
            _delayModel = CreateDelayModel();
        }

        private IModel CreateModel()
        {
            if (!_connection.IsConnected)
            {
                _connection.TryConnect();
            }

            _model = _connection.CreateModel();
            _model.ExchangeDeclare(_exchangeName, ExchangeType.Topic, autoDelete: false, durable: false);
            _model.QueueDeclare(_queueName, autoDelete: false, durable: true);


            foreach (var messageTypeName in _builder.Subscriptions.Keys)
            {
                _model.QueueBind(_queueName, _exchangeName, messageTypeName);
            }

            _model.CallbackException += (sender, ea) =>
            {
                _model.Dispose();
                _model = CreateModel();
            };

            var consumer = _builder.CreateConsumer(_logger, _model);
            _model.BasicConsume(_queueName, false, consumer);

            return _model;
        }

        private IModel CreateDelayModel()
        {
            if (!_connection.IsConnected)
            {
                _connection.TryConnect();
            }
            _delay = _connection.CreateModel();
            _delay.ExchangeDeclare(_delayExchange, ExchangeType.Topic, autoDelete: false, durable: false);
            _delay.QueueDeclare(_delayQueueName, autoDelete: false, durable: true, arguments: new Dictionary<string, object>()
            {
                ["x-dead-letter-exchange"] = _exchangeName

            });
            foreach (var messageTypeName in _builder.Subscriptions.Keys)
            {
                _delay.QueueBind(_delayQueueName, _delayExchange, messageTypeName);
            }

            return _delay;
        }
        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;

            _model?.Dispose();
            _builder.Subscriptions.Clear();
        }

        public void Publish(object message)
        {
            Guard.ArgumentNotNull(nameof(message), message);
            Guard.NotDisposed(_disposed, "RabbitMQMessenger");

            var messageTypeName = _builder.GetMessageTypeName(message.GetType());
            var messageText = JsonConvert.SerializeObject(message);

            _model.BasicPublish(_exchangeName, messageTypeName, body: Encoding.UTF8.GetBytes(messageText));
        }

        public void PublishDelay(object message, TimeSpan delay)
        {
            Guard.ArgumentNotNull(nameof(message), message);
            Guard.NotDisposed(_disposed, "RabbitMQMessenger");

            var messageTypeName = _builder.GetMessageTypeName(message.GetType());
            var messageText = JsonConvert.SerializeObject(message);
            var properties = _delay.CreateBasicProperties();
            properties.Expiration = delay.TotalMilliseconds.ToString();

            _delay.BasicPublish(_delayExchange, messageTypeName, body: Encoding.UTF8.GetBytes(messageText), basicProperties: properties);
        }
    }
}

