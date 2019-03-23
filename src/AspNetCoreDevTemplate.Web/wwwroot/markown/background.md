
## OAuth2
### 什么是OAuth
&emsp;OAuth 的官网介绍：**An open protocol to allow secure API authorization in a simple and standard method from desktop and web applications**。OAuth 是一种开放的协议，为桌面程序或者基于 BS 的 web 应用提供了一种简单的，标准的方式去访问需要用户授权的 API 服务。OAUTH 认证授权具有以下特点：

1. 简单：不管是 OAuth 服务提供者还是应用开发者，都很容易于理解与使用；
2. 安全：没有涉及到用户密钥等信息，更安全更灵活；
3. 开放：任何服务提供商都可以实现 OAuth，任何软件开发商都可以使用 OAuth；

&emsp;OAuth 2.0 是 OAuth 协议的下一版本，但不向后兼容 OAuth 1.0，即完全废止了 OAuth 1.0。 OAuth 2.0 关注客户端开发者的简易性。要么通过组织在资源拥有者和 HTTP 服务商之间的被批准的交互动作代表用户，要么允许第三方应用代表用户获得访问的权限。同时为 Web 应用，桌面应用和手机，和起居室设备提供专门的认证流程。2012 年 10 月，OAuth 2.0 协议正式发布为 RFC 6749。
###  OAuth2的四个重要角色
1. **resource owner**，资源所有者，能够允许访问受保护资源的实体。如果是个人，被称为 end-user。
2. **resource server**，资源服务器，托管受保护资源的服务器。
3. **client**，客户端，使用资源所有者的授权代表资源所有者发起对受保护资源的请求的应用程序。如：web网站，移动应用等。
4. **authorization server**，授权服务器，能够向客户端颁发令牌。
5. **user-agent**，用户代理，帮助资源所有者与客户端沟通的工具，一般为 web 浏览器，移动 APP 等。

### 协议流程
&emsp;如下图所示:
![](https://files.meda.cc/down/group1/10001_001/20190313/131969174107534983.jpg)
- （A）Client使用浏览器（用户代理）访问Authorization server。也就是用浏览器访问一个URL，这个URL是Authorization server提供的，访问的收Client需要提供（客户端标识，请求范围，本地状态和重定向URL）这些参数。
- （B）Authorization server验证Client在（A）中传递的参数信息，如果无误则提供一个页面供Resource owner登陆，登陆成功后选择Client可以访问Resource server的哪些资源以及读写权限。
- （C）在（B）无误后返回一个授权码（Authorization Code）给Client。
- （D）Client拿着（C）中获得的授权码（Authorization Code）和（客户端标识、重定向URL等信息）作为参数，请求Authorization server提供的获取访问令牌的URL。
- （E）Authorization server返回访问令牌和可选的刷新令牌以及令牌有效时间等信息给Client。

### 授权类型
1. **Authorization Code**：
&emsp;资源拥有者（用户）需要登录客户端（APP），他选择了第三方登录。
客户端（APP）重定向到第三方授权服务器。此时客户端携带了客户端标识（client_id），那么第三方就知道这是哪个客户端，资源拥有者确定（拒绝）授权后需要重定向到哪里。
用户确认授权，客户端（APP）被重定向到注册时给定的 URI，并携带了第三方给定的 code。
在重定向的过程中，客户端拿到 code 与 client_id、client_secret 去授权服务器请求令牌，如果成功，直接请求资源服务器获取资源，整个过程，用户代理是不会拿到令牌 token 的。
客户端（APP）拿到令牌 token 后就可以向第三方的资源服务器请求资源了。
![](https://files.meda.cc/down/group1/10001_001/20190313/131969180121885853.jpg)

1. **Implicit**：
&emsp;该方式一般用于移动客户端或网页客户端。隐式授权类似于授权码授权，但 token 被返回给用户代理再转发到客户端（APP），因此它可能会暴露给用户和用户设备上的其它客户端（APP）。此外，此流程不会对客户端（APP）的身份进行身份验证，并且依赖重定向 URI（已在服务商中注册）来实现此目的。
基本原理：要求用户授权应用程序，然后授权服务器将访问令牌传回给用户代理，用户代理将其传递给客户端。
![](https://files.meda.cc/down/group1/10001_001/20190313/131969185190134491.jpg)
1. **Resource Owner Password Credentials**：
&emsp;用户将其服务凭证（用户名和密码）直接提供给客户端，该客户端使用凭据从服务获取访问令牌。如果其它方式不可行，则只应在授权服务器上启用该授权类型。此外，只有在客户端受到用户信任时才能使用它（例如，它由服务商自有，或用户的桌面操作系统）。
![](https://files.meda.cc/down/group1/10001_001/20190313/131969185668129481.jpg)
1. **Client Credentials**：
&emsp;这种模式只需要提供 client_id 和 client_secret 即可获取授权。一般用于后端 API 的相关操作。
![](https://files.meda.cc/down/group1/10001_001/20190313/131969186184496814.jpg)

## OIDC
### 什么是OIDC
&emsp;简单来说：OIDC是OpenID Connect的简称，OIDC=(Identity, Authentication) + OAuth 2.0。它在OAuth2上构建了一个身份层，是一个基于OAuth2协议的身份认证标准协议。我们都知道OAuth2是一个授权协议，它无法提供完善的身份认证功能（关于这一点请参考[认证授权] 3.基于OAuth2的认证（译）），OIDC使用OAuth2的授权服务器来为第三方客户端提供用户的身份认证，并把对应的身份认证信息传递给客户端，且可以适用于各种类型的客户端（比如服务端应用，移动APP，JS应用），且完全兼容OAuth2，也就是说你搭建了一个OIDC的服务后，也可以当作一个OAuth2的服务来用。应用场景如图：
![](https://files.meda.cc/down/group1/10001_001/20190313/131969187758545505.png)
### OIDC 核心概念
&emsp;OAuth2提供了Access Token来解决授权第三方客户端访问受保护资源的问题；OIDC在这个基础上提供了ID Token来解决第三方客户端标识用户身份认证的问题。OIDC的核心在于在OAuth2的授权流程中，一并提供用户的身份认证信息（ID Token）给到第三方客户端，ID Token使用JWT格式来包装，得益于JWT（JSON Web Token）的自包含性，紧凑性以及防篡改机制，使得ID Token可以安全的传递给第三方客户端程序并且容易被验证。此外还提供了UserInfo的接口，用户获取用户的更完整的信息。
#### OIDC 主要术语
1. EU：End User：一个人类用户。
1. RP：Relying Party ,用来代指OAuth2中的受信任的客户端，身份认证和授权信息的消费方；
1. OP：OpenID Provider，有能力提供EU认证的服务（比如OAuth2中的授权服务），用来为RP提供EU的身份认证信息；
1. ID Token：JWT格式的数据，包含EU身份认证的信息。
1. UserInfo Endpoint：用户信息接口（受OAuth2保护），当RP使用Access Token访问时，返回授权用户的信息，此接口必须使用HTTPS。

#### OIDC 工作流程
&emsp;从抽象的角度来看，OIDC的流程由以下5个步骤构成：
1. RP发送一个认证请求给OP；
1. OP对EU进行身份认证，然后提供授权；
1. OP把ID Token和Access Token（需要的话）返回给RP；
1. RP使用Access Token发送一个请求UserInfo EndPoint；
1. UserInfo EndPoint返回EU的Claims。
![](https://files.meda.cc/down/group1/10001_001/20190313/131969191056140687.png)、

#### ID Token
&emsp;ID Token是一个安全令牌，是一个授权服务器提供的包含用户信息（由一组Cliams构成以及其他辅助的Cliams）的JWT格式的数据结构。ID Token的主要构成部分如下（使用OAuth2流程的OIDC）。
- iss = Issuer Identifier：必须。提供认证信息者的唯一标识。一般是一个https的url（不包含querystring和fragment部分）。
- sub = Subject Identifier：必须。iss提供的EU的标识，在iss范围内唯一。它会被RP用来标识唯一的用户。最长为255个ASCII个字符。
- aud = Audience(s)：必须。标识ID Token的受众。必须包含OAuth2的client_id。
- exp = Expiration time：必须。过期时间，超过此时间的ID Token会作废不再被验证通过。
- iat = Issued At Time：必须。JWT的构建的时间。
- auth_time = AuthenticationTime：EU完成认证的时间。如果RP发送AuthN请求的时候携带max_age的参数，则此Claim是必须的。
- nonce：RP发送请求的时候提供的随机字符串，用来减缓重放攻击，也可以来关联ID Token和RP本身的Session信息。
- acr = Authentication Context Class Reference：可选。表示一个认证上下文引用值，可以用来标识认证上下文类。
- amr = Authentication Methods References：可选。表示一组认证方法。
- azp = Authorized party：可选。结合aud使用。只有在被认证的一方和受众（aud）不一致时才使用此值，一般情况下很少使用。

&emsp;ID Token通常情况下还会包含其他的Claims（毕竟上述claim中只有sub是和EU相关的，这在一般情况下是不够的，必须还需要EU的用户名，头像等其他的资料，OIDC提供了一组公共的cliams，请移步这里http://openid.net/specs/openid-connect-core-1_0.html#StandardClaims）。另外ID Token必须使用JWS进行签名和JWE加密，从而提供认证的完整性、不可否认性以及可选的保密性。一个ID Token的例子如下：
```json
{
    "iss": "https://server.example.com",
   "sub": "24400320",
    "aud": "s6BhdRkqt3",
   "nonce": "n-0S6_WzA2Mj",
   "exp": 1311281970,
   "iat": 1311280970,
   "auth_time": 1311280969,
   "acr": "urn:mace:incommon:iap:silver"
}
```
## 参考文献
[10 分钟理解什么是 OAuth 2.0 协议](https://deepzz.com/post/what-is-oauth2-protocol.html "10 分钟理解什么是 OAuth 2.0 协议")

[[认证授权] 1.OAuth2授权](http://www.cnblogs.com/linianhui/p/oauth2-authorization.html#auto_id_6 "[认证授权] 1.OAuth2授权")

[[认证授权] 4.OIDC（OpenId Connect）身份认证（核心部分）](http://www.cnblogs.com/linianhui/p/openid-connect-core.html "[认证授权] 4.OIDC（OpenId Connect）身份认证（核心部分）")
