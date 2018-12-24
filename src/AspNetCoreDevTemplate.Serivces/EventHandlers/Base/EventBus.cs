
using System;
using System.Linq;
using System.Security.Claims;
using AspNetCoreDevTemplate.Models.Events;

namespace AspNetCoreDevTemplate.Serivces.EventHandlers.Base
{
    public interface IEventBus
    {
        void Publish<T>(T eventData) where T : BaseEvent;
    }
    public class EventBus : IEventBus
    {
        private IHttpContextAccessor _accessor;
        private readonly ILogger _logger;

        private readonly IServiceProvider _serviceProvider;

        public EventBus(IServiceProvider serviceProvider, IHttpContextAccessor accessor, ILoggerFactory loggerFactory)
        {
            _serviceProvider = serviceProvider;
            _accessor = accessor;
            _logger = loggerFactory.CreateLogger<EventBus>();
        }

        /// <summary>
        /// 当前登陆用户的ID
        /// </summary>
        public int CurrentUserID
        {
            get
            {

                var claimsIdentity = _accessor.HttpContext.User.Identity as ClaimsIdentity;
                int id = int.TryParse(claimsIdentity.Claims.FirstOrDefault(c => c.Type == "sub")?.Value, out id) ? id : 0;
                return id;
            }
        }

        /// <summary>
        /// 当前登陆用户的姓名
        /// </summary>
        public string CurrentUserName
        {
            get
            {
                var claimsIdentity = _accessor.HttpContext.User.Identity as ClaimsIdentity;
                var name = claimsIdentity.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? string.Empty;
                return name;
            }
        }

        /// <summary>
        ///  当前bearer token
        /// </summary>
        public string BearerToken => _accessor.HttpContext.GetBearerToken();

        public void Publish<T>(T eventData) where T : BaseEvent
        {
            if (eventData == null) return;
            if (eventData.RequesterId == 0)
                eventData.RequesterId = CurrentUserID;
            if (string.IsNullOrEmpty(eventData.RequesterName))
                eventData.RequesterName = CurrentUserName;
            if (string.IsNullOrEmpty(eventData.BearerToken))
                eventData.BearerToken = BearerToken;

            Task.Factory.StartNew(async () =>
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var handerls = scope.ServiceProvider.GetServices<IEventHandler<T>>();
                    if (handerls.IsNullOrEmpty()) return;
                    foreach (var handler in handerls)
                    {
                        try
                        {
                            await handler.Handle(eventData);
                        }
                        catch (Exception ex)
                        {
                            ///错误信息
                            string err_msg = "event bus:" + ex.StackTrace;
                            _logger.LogError(err_msg);
                        }
                    }
                }
            });
        }
    }
}