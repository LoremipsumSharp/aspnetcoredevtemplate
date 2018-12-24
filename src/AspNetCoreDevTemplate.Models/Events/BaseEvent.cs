
namespace AspNetCoreDevTemplate.Models.Events
{
    public interface IEvent
    {
    }
    public class BaseEvent : IEvent
    {
        /// <summary>
        ///  事件创建人ID
        /// </summary>
        public int RequesterId { get; set; }
        /// <summary>
        ///  事件创建人姓名
        /// </summary>
        public string RequesterName { get; set; }

        /// <summary>
        ///  Token
        /// </summary>
        public string BearerToken { get; set; }
    }
}