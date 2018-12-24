
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Polly;
using Polly.Retry;

namespace AspNetCoreDevTemplate.Utils
{
    public class PollyHttpClient<T> where T : class
    {
        private static readonly Regex _bearRegex = new Regex("((B|b)earer\\s)");
        private static Lazy<HttpClient> _httpClient;
        private static RetryPolicy<RequestResult<T>> _retryPolicy = Policy.Handle<HttpRequestException>()
                         .Or<TaskCanceledException>()
                         .OrResult<RequestResult<T>>(r => r.StatusCode != HttpStatusCode.OK)

                         .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                             (result, timeSpan, retryCount, context) =>
                             {
                                 var isException = result.Exception != null;

                             });
        static PollyHttpClient()
        {
            _httpClient = new Lazy<HttpClient>(() => new HttpClient());
        }
        /// <summary>
        ///  Get
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="client"></param>
        /// <param name="requestUrl"></param>
        /// <returns></returns>

        public static async Task<RequestResult<T>> GetAsync(string requestUrl, string bearToken = null)

        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                using (var getRequest = new HttpRequestMessage(HttpMethod.Get, requestUrl))
                {
                    if (!string.IsNullOrEmpty(bearToken)) getRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _bearRegex.Replace(bearToken, string.Empty));
                    var response = await _httpClient.Value.SendAsync(getRequest);
                    var content = await response.Content.ReadAsStringAsync();
                    return new RequestResult<T>(response.StatusCode, JsonConvert.DeserializeObject<T>(content));
                }
            });
            return result;

        }




        /// <summary>
        ///  Post
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="client"></param>
        /// <param name="requestUrl"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static async Task<RequestResult<T>> PostAsync(string requestUrl, object payload, string bearToken = null)
        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                using (var postRequest = new HttpRequestMessage(HttpMethod.Post, requestUrl))
                {
                    if (!string.IsNullOrEmpty(bearToken)) postRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _bearRegex.Replace(bearToken, string.Empty));
                    postRequest.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
                    var response = await _httpClient.Value.SendAsync(postRequest);
                    var content = await response.Content.ReadAsStringAsync();
                    return new RequestResult<T>(response.StatusCode, JsonConvert.DeserializeObject<T>(content));
                }
            });
            return result;
        }


        /// <summary>
        /// Delete
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="client"></param>
        /// <param name="requestUrl"></param>
        /// <returns></returns>
        public static async Task<RequestResult<T>> RequestDelete(string requestUrl)
        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                var response = await _httpClient.Value.DeleteAsync(requestUrl);
                var content = await response.Content.ReadAsStringAsync();

                return new RequestResult<T>(response.StatusCode, JsonConvert.DeserializeObject<T>(content));
            });
            return result;
        }
        /// <summary>
        ///  Put
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="client"></param>
        /// <param name="requestUrl"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static async Task<RequestResult<T>> RequestPut(string requestUrl, object payload, string bearToken = null)
        {
            var result = await _retryPolicy.ExecuteAsync(async () =>
            {
                var response = await _httpClient.Value.PutAsync(requestUrl,
            new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json"));
                var content = await response.Content.ReadAsStringAsync();

                return new RequestResult<T>(response.StatusCode, JsonConvert.DeserializeObject<T>(content));
            });
            return result;
        }
    }
    public class RequestResult<T>
    {
        public HttpStatusCode StatusCode { get; private set; }
        public T Content { get; private set; }
        public RequestResult(HttpStatusCode statusCode, T content)
        {
            StatusCode = statusCode;
            Content = content;
        }
    }
}