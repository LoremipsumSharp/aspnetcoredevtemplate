using System.Threading.Tasks;
namespace AspNetCoreDevTemplate.Serivces.EventHandlers.Base
{
    public interface IEventHandler
    {
    }

    public interface IEventHandler<TEvent> : IEventHandler
    {
        Task Handle(TEvent eventData);
    }
}