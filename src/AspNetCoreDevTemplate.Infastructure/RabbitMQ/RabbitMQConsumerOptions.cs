


namespace AspNetCoreDevTemplate.Infastructure.RabbitMQ
{
    public class RabbitMQConsumerOptions : RabbitMQOptions
    {
        public string ExchangeName { get; set; }
        public string QueueName { get; set; }
        public string RoutingKey { get; set; }
        public bool DurableQueue { get; set; }
        public string ExchangeType { get; set; }
    }
}