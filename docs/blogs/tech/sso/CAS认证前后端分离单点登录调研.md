---
title: CAS认证前后端分离单点登录调研
date: 2019-12-09 00:00:00
tags: 单点登录
---
前后端分离模式下 CAS 单点登录实现方案调研。
<!-- more -->
## 前言
前段时间一直在调研的前后端分离单点登录认证方案终于以 Demo 的形式实现了，期间如其他前后端开发者们一样——踩过不少坑。虽然目前的方案不能说是尽善尽美，也算勉强达到了项目要求，故在此处记录一下相关情况以备日后查阅。

## 知识点
开始之前需要先了解一些相关的知识与概念，包括单点登录，CAS，前后端分离等。

### 前后端分离
前后端分离已在互联网项目开发业界进行了广泛应用，通过前端应用与后端服务的分布式部署可以有效进行解耦，将数据与展现彻底分离，既保证了数据安全，也给了前端开发充分的自由。

前后端分离最常见的实现方式之一是前端 HTML 页面通过 AJAX 调用后端的 RESTFUL API 接口并使用 JSON 数据进行交互（这种方式也为单点登录方案的实现挖了个大坑）。

### 单点登录
单点登录（Single Sign On），简称为 SSO，是目前比较流行的企业业务整合的解决方案之一。SSO的定义是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。

### CAS

<img src="/img/webfe/sso/sso1.png">

此处借用了一张图来展示认证协议过程，下面介绍一下认证流程。常用的认证流程有两个：其一是用户登录，二是已登录用户访问客户端资源。

#### 用户登录
1. 用户通过浏览器发送请求访问 CAS Client 资源
2. CAS Client 发现用户请求中未包含 ST 票据，将浏览器重定向到 CAS Server，此时 URL 中会携带名为 service 的参数，参数值是用户要访问的客户端资源地址
3. CAS Server 对访问的用户是否携带 TGC 进行验证，若未携带则跳转到 CAS 统一的登录页面
4. 用户登录后，CAS Server 将浏览器重定向到之前 service 参数值指向的客户端地址（URL 的最后会增加 st 参数，CAS Client 可将 ST 保存起来），同时生成 TGC 写入浏览器中
5. 由于此次重定向携带了 ST，CAS Client 会向 CAS Server 发送验证请求
6. CAS Server 验证通过，用户可以正常访问资源
7. 此时浏览器已与 CAS Client 建立会话，若 CAS Client 保存了 ST，后续请求通过会话即可调取 ST 并与 CAS Server 进行验证

#### 已登录用户访问其他资源
1. 用户访问未建立会话的 CAS Client 资源
2. CAS Client 需要 ST 进行验证，将浏览器重定向到 CAS Server
2. 用户访问 CAS Server，CAS Server 发现用户有 TGT，签发一个 ST，返回给用户浏览器并重定向到 CAS Client
3. CAS Client 发现有 ST 去 CAS Server（CAS Client 可将 ST 保存起来） 验证，验证通过后，允许用户访问资源
4. 此时浏览器已与 CAS Client 建立会话，若 CAS Client 保存了 ST，后续请求通过会话即可调取 ST 并与 CAS Server 进行验证

#### CAS Server
CAS Server（CAS服务端）负责完成对用户的认证工作，完成与浏览器端的用户认证和CAS客户端的票据验证。

#### CAS Client
CAS Client（CAS客户端）负责处理对受保护资源的访问请求，需要对请求方进行身份认证时，重定向到 CAS Server 进行认证。
CAS Client 与受保护的客户端应用部署在一起，以 Filter  方式保护受保护的资源。

#### Ticket Grangting Ticket（TGT）
TGT 是 CAS 为用户签发的登录票据，拥有了 TGT，用户就可以证明自己在CAS成功登录过。
TGT 封装了 Cookie 值以及此 Cookie 值对应的用户信息。用户在 CAS 认证成功后，CAS 生成 cookie（叫TGC），写入浏览器，同时生成一个 TGT 对象，放入自己的缓存，TGT 对象的 ID 就是 cookie 的值。
当 HTTP 再次请求到来时，如果传过来的有 CAS 生成的 cookie，则 CAS 以此 cookie 值为 key 查询缓存中有无 TGT，如果有，说明用户之前登录过，如果没有，则用户需要重新登录。

#### Ticket-granting cookie（TGC）
存放用户身份认证凭证的 cookie，在浏览器和 CAS Server 间通讯时使用，并且只能基于安全通道传输（Https），是 CAS Server 用来明确用户身份的凭证。

#### Service ticket（ST）
服务票据，服务的惟一标识码 , 由 CAS Server 发出（ Http 传送），用户访问 Service 时，Service 发现用户没有 ST，则要求用户去 CAS 获取 ST。

## 存在的问题
### 四方认证与Ajax
前文已经介绍了 CAS 认证的过程，可以看出 CAS 的认证基于会话（即浏览器与服务器之间的 Session），因此终端、CAS 客户端与 CAS 服务端会组成一个三方的认证系统。登录之后的浏览器会在 CAS Server 的域名下存放 cookie，用于浏览器和 CAS Server 之间验证是否登录；而在访问 CAS Client 资源时则会在 Client 的域名下存放一个 cookie，用于下次访问资源时调取 ST 与 CAS Server 进行验证。

现在问题出现了。当前端与后端分离时，原本的 CAS Client 就不再是一方了，而是变成了两方，于是三方认证也成了四方认证。
如果是单纯的变成了两方也并没有离开 CAS 的认证框架，无非是多一个 CAS Client 罢了，然而前端常用的 Ajax 请求恰好无法处理 CAS 中最常见的重定向操作。这样一来，包括首次登录、登录成功后返回 ST、认证登录等一系列的逻辑似乎都没有办法继续进行了。

### 微服务架构下的认证
另一个尚未解决的问题就是微服务架构带来的认证问题。对于前端访问多个 CAS Client 时需要携带 ST 的需求，目前尚未设计出较好的解决方案，此问题还有待后续研究。

## 解决方案
前面的问题网上出现了众多解决办法，在此处仅记录我自己实现的确实可行的一个设计方案。
### 后端（CAS Client 客户端）
#### 跳转页面的 Controller
首先后端需要增加一个专门用来跳转页面的 Controller，只需能实现根据传入的参数（要跳转的URL）跳转到对应的页面即可。这个跳转的作用主要在于认证通过后返回前端页面，并建立会话，同时需要将会话的 JSESSIONID 放在 URL 中。

#### 重定向改为返回 JSON
在尽量减少侵入的原则下，不对 CAS 本身的代码进行修改，而是在认证过滤之前增加一个自定义的过滤器，将原有的返回 302 重定向状态改为返回 JSON 数据。返回的数据应包括 CAS Client 中已定义的跳转 Controller 地址，用于认证通过后返回到跳转页面的方法并跳回前端页面。

### 前端
#### 处理未登录状态码
前端可以封装一个发送请求并接收返回值的组件，用于拦截所有的返回结果。与后端约定判断返回的状态码，若需要跳转 CAS Server，则保存当前浏览器地址，向 CAS Server 发送 service 参数，其值为 Client 中跳转页面用的 Controller 地址并向其传入返回前端页面的参数：url。

以 axios 封装的组件为例：
```javascript
service.interceptors.response.use(
  response => {
    if (String(response.data.returnCode) === '401') {
      // 获取当前浏览器地址，用于后端回调
      const href = window.location.href
      // returnData 存放了用于跳转页面的 Controller 地址，最后 url 参数中是要返回的前端地址
      window.location.href = 'http://cas.server.com:8443/cas/login?service=' + encodeURIComponent(response.data.returnData) + '?url=' + encodeURIComponent(encodeURIComponent(href))
    }
    return response.data
  },
  error => {
    NProgress.done()
    return Promise.reject(error)
  }
)
```
#### 获取并保存 Client 返回的 JSESSIONID
登录认证成功后，Client 返回前端时在浏览器地址中会携带 JSESSIONID 参数，前端获取后需要手动存放在 cookie 中，下次请求 Client 资源时将自动携带，Client 获取到 JSESSIONID 后即可取得会话并进行认证。
以 vue-router 的导航钩子为例：
```javascript
router.beforeEach((to, from, next) => {
  // 路由导航钩子函数中可进行处理
  if (to.query && to.query.JSESSIONID) {
    Cookies.set('JSESSIONID', to.query.JSESSIONID)
    // 去掉浏览器地址栏中的 JSESSIONID 参数
    delete to.query.JSESSIONID
    next(to)
  }
})
```

### 整体流程设计
下面记录一下整体的设计流程：

1. 浏览器访问子系统 A 前端页面，前端向 Client 获取用户信息
2. Client 发现请求中没有会话ID，返回 401 及用于跳转页面的 Controller 的地址
3. 前端发现 401，将浏览器重定向到 CAS Server 的登录页，后面带上 service 参数，service 即为 Client 回传的 Controller 地址，同时向其中传入一个 url 参数，用于返回前端页面
4. CAS Server 登录，登录成功后根据 service 参数返回 Client 中的 Controller
5. Client 接收 url 参数，同时将 JSESSIONID 拼在 url 最后，通过跳转回传给前端
6. 前端接收 JSESSIONID 并存放在其自身域的 cookie 中，后续请求均携带 cookie
7. 另一子系统 B 前端访问 Client2 时，Client2 发现无会话，同样返回 401
8. 前端跳转 CAS Server 进行登录认证（携带 service 及 url 两个参数），CAS 发现已登录，直接跳转回到 service 中
9. Client2 根据 url 跳转回前端 B，并在地址栏增加 JSESSIONID 参数
10. 前端 B 接收 JSESSIONID 并存放在 B 域的 cookie 中，后续请求均携带 cookie

至此就基本实现了多个子系统之间的单点登录流程。

## 实施
在开发过程中也存在一些具体的坑，此处只记录遇到并解决的坑以及留下的坑。
### 遇到的问题
#### 每次访问 CAS Server 生成不同的 JSESSIONID
开发期间发现了 CAS Server 登录后无法保存登录状态的问题，即下次访问 CAS Server 时仍然会被认为未登录，而跳转登录页。经仔细排查发现每次访问 CAS Server 时都会生成不同的 JSESSIONID，即每次访问都会创建新的会话。
此时应排查 Request 中是否携带了 cookie（其中包含 JSESSIONID），若未携带，如果使用axios封装了请求组件，可以加上配置：
```javascript
axios.defaults.withCredentials = true
```
若发现 Request 中已携带了 cookie，而 JSESSIONID 仍然会变，可尝试为 CAS Server 设置一个域名解决问题。

#### 多个窗口访问不同子系统
对于同一个平台下的多个子系统，如果都采用前后端分离的方式，打通了 Client1 的登录认证之后，如何让 Client2 不需要登录直接访问呢？

此处可以有这样一种解决办法，当 Client1 登录后，CAS Server 已经存放了票据的情况下，打开 Client2 的前端页面时可以首先调用一次获取用户信息的接口，这样就会让 Client2 也执行一次认证过程。如此一来，用户不会察觉到这个过程，只会看到认证成功后要访问的页面，即可实现一次登录访问多个子系统的需求。

### 存在的缺陷
#### 单点登出
由于之前手动保存的 JSESSIONID 可能是 Client 第一次建立的会话 ID，而非认证的会话 ID，故调用 CAS Server 的 /logout 退出时发现只能退出当前子系统，而不能实现单点退出，其余页面子系统仍可正常使用。

#### 前端只能访问单一的 CAS Client
由于采用了会话机制，目前实现的版本一个前端只能访问对应的一个 CAS Client 资源，对于在同一个前端访问微服务架构多个服务的情况尚未有解决方案。因此只能设计成每个前端访问自己对应的后端。

## 总结
这是最近一段时期以来最棘手的一个问题，经过和同事的通力合作，设计实施以及开发 Demo，最终方案虽然还存在一些交互上的缺陷，但流程已经跑通，还算比较满意吧。

下一步打算使用 CAS 提供的 REST  接口认证方式进行调研，争取可以设计实现完善的前后端分离模式单点登录/登出解决方案。

## 参考资料
### CAS 原理
- [cas单点登录认证原理](https://www.cnblogs.com/tudou1223/p/9018423.html)
- [cas登录认证](https://www.jianshu.com/p/8daeb20abb84)
- [CAS单点登录(十一)——单点退出](https://blog.csdn.net/Anumbrella/article/details/89069445)
- [CAS单点登录(一)——初识SSO](https://blog.csdn.net/anumbrella/article/details/80821486)

### 前后端分离
- [前后端分离架构概述](https://blog.csdn.net/fuzhongmin05/article/details/81591072)
- [前后端分离或AJAX下的CAS-SSO跨域流程分析](https://blog.csdn.net/qq_26769513/article/details/102835031)

### CAS Restful
- [REST Protocol](https://apereo.github.io/cas/6.1.x/protocol/REST-Protocol.html)
- [使用Apereo Cas 5.1.3的Restful接口实现SSO及TGC分析](https://blog.csdn.net/cn_yh/article/details/77962467)
- [CAS之5.2x版本之REST验证ticket（跨系统访问资源）](https://blog.csdn.net/yelllowcong/article/details/79290916)