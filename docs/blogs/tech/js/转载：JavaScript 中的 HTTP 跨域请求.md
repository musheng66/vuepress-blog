---
title: 转载：JavaScript 中的 HTTP 跨域请求
date: 2017-12-26
categories:
 - 前端
tags:
 - 跨域
---
为方便查阅，转载一篇关于 HTTP 跨域请求的文章。
<!-- more -->
原作出处：<https://blog.serenader.me/http-cors-in-javascript/>

## 前序

*自从我接触前端以来，接手的项目里面很大部分都是前后端分离的，后端只提供接口，前端根据后端接口渲染出实际页面。个人觉得这是一个挺好的模式，前后端各自负责各自的模块，分工明确，而且也给前端更大的发挥空间。*

*与以前套模板的模式不同，前后端分离以后，前端跟后端的沟通绝大部分都是通过前端主动向后端发起请求来完成的。而前端的请求又绝大部分是由 Ajax 构成的，Ajax 是一种非常方便的获取数据的方式。但是，一旦 Ajax 碰上跨域，那么问题就会麻烦很多。这篇文章主要梳理了我在项目开发里面碰到的一些关于跨域请求的问题，当然也会有一些关于跨域请求的一些背景知识。PS：文末有个小彩蛋哦😄*

严格来说，跨域请求并不仅仅只是 Ajax 的跨域请求，而是对于一个页面来说，只要它请求了其他域名的资源了，那么这个过程就属于跨域请求了。比如，一个带有其他域名的 `src` 的 `<img>` 标签，以及页面中引入的其他第三方的 CSS 样式等。

对于 img 以及 CSS 而言，跨域请求本身并没有更多的安全问题，因为这些请求都属于只读请求，并不会对源资源造成副作用。而如果跨域请求是从脚本里面发出去的，由于脚本具有高度灵活性，浏览器出于安全考虑，会根据同源策略来限制它的功能，使得正常情况下，脚本只能请求同源的资源。如果页面确实需要通过脚本请求其他网站的资源，那么就应当在跨域资源共享（CORS）的机制下工作。

等等同学，什么叫做同源策略？


## 同源策略（Same-origin policy）

对于两个页面（资源）而言，只要他们满足以下三个条件则称他们符合同源策略：

1. 协议相同
2. 端口相同
3. 域名相同

另外，`about:blank` 和 `javascript:` 继承加载这些资源的页面的 origin。`data:` 的资源不同，自身会拥有一个空的安全的上下文。

另外，子域可以通过JS 设置 `document.domain` 来通过同源策略。如：

在子域 `http://a.example.com/test.html` 的页面中，通过 JS 设置 `document.domain='example.com'` ，则当前页面与 `http://example.com/page.html` 符合同源策略。

简单的说，对于页面 `http://www.example.com/page1.html` 来说，以下页面与它都不符合同源策略，脚本无法直接请求这些资源：

* `https://www.example.com/page1.html` : 协议不同
* `http://www.example.com:81/page1.html` : 端口不同
* `http://another.example.com/page1.html` : 域名不同

那么，什么又是 CORS 呢？


## CORS（Cross-Origin Resource Sharing）

CORS 本质上是规定了一系列的 HTTP 头来作为判断脚本是否能够实现跨域请求。在了解这些请求头之前，先来看看跨域请求有哪些类型。

> 通过脚本来发出请求有两种方式，一种是通过创建 XMLHttpRequest 的方式来发出请求，另外一种是通过 fetch API 来实现请求。

一般来说，跨域请求可以大致分为两种，其中一种称之为简单的请求，其符合以下条件：

* 请求的方法是 `GET`、 `POST`、 `HEAD` 其中之一。
* 除了浏览器自动带上的请求头（如 `Connection` \ `User-Agent` 等）之外，只允许下面几种请求头：
    - `Accept`
    - `Accept-Language`
    - `Content-Language`
    - `Content-Type`
* `Content-Type` 请求头的值只能是 `application/x-www-form-urlencoded`、 `multipart/form-data`、 `text/plain` 其中之一。

反之，如果有违背上面三条规则中的任意一条，那么即不是简单的跨域请求。非简单的跨域请求相对于简单的跨域请求来说区别在于，请求在发出去之前，浏览器会先发送一个 preflighted 请求，用来向服务器端确认接下来要进行的请求是否是被允许的。

### Preflight 请求

在实际项目开发中，在使用 XHR 或者 fetch API 请求接口的时候很多情况下都会带上一些额外的特殊请求头，或者使用特殊的 HTTP 方法，如 `PUT`、`DELETE` 等（常见于 Restful 接口）。由于多了额外的请求头或者使用了特殊的 HTTP 方法，浏览器就将这些请求视为非简单的跨域请求，将会在实际请求发出去之前先自动发出一个 preflight 请求，也就是一个 OPTIONS 请求。

OPTIONS 请求会将当前的跨域请求所使用的特殊 HTTP 请求头和 HTTP 请求方法发送给服务器端，如 Access-Control-Request-Method 和 Access-Control-Request-Headers 。服务器端接收到 OPTIONS 请求后返回相应的响应头。浏览器根据返回的响应头再来判断该跨域请求是否被允许的。当浏览器判定 OPTIONS 请求通过了，真正的请求才会发出。如以下则是一个带有 OPTIONS 请求以及真正的 GET 请求的响应头和请求头：

```
OPTIONS /api4 HTTP/1.1
Host: us1.serenader.me:3333
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Access-Control-Request-Method: PUT
Origin: http://us1.serenader.me:3334
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36
Accept: */*
Referer: http://us1.serenader.me:3334/
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,fr;q=0.2
```

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Content-Type: text/html; charset=utf-8
Content-Length: 2
ETag: W/"2-REvLOj/Pg4kpbElGfyfh1g"
Date: Thu, 19 Jan 2017 15:21:15 GMT
Connection: keep-alive
PUT /api4 HTTP/1.1
Host: us1.serenader.me:3333
Connection: keep-alive
Content-Length: 0
Pragma: no-cache
Cache-Control: no-cache
Origin: http://us1.serenader.me:3334
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36
Accept: */*
Referer: http://us1.serenader.me:3334/
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,fr;q=0.2
```

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 2
ETag: W/"2-REvLOj/Pg4kpbElGfyfh1g"
Date: Thu, 19 Jan 2017 15:21:15 GMT
Connection: keep-alive
```

了解了简单跨域请求以及会发出 `preflight` 请求的非简单跨域请求之后，我们再来看看究竟是哪些 HTTP 头在决定这些跨域请求的「宿命」。

> 为了帮助读者更好地理解这些 HTTP 头的作用，我编写了一个简单的 demo ，开源在了 GitHub 上，感兴趣的可以到 [这个链接查看代码](https://github.com/serenader2014/http-cors-demo)，或者访问这个在线 demo 预览效果：<http://us1.serenader.me:3334/>。记得加载完页面后打开 Chrome 的控制台来查看详细的请求信息。

### Access-Control-Allow-Origin

`Access-Control-Allow-Origin` 是一个响应头，它指定了当前资源允许被哪些域名的脚本所请求到。

跨域请求（无论简单请求还是非简单请求）在发出时都会带上 Origin 请求头，用来表明当前发出请求的是哪一个域名。此时服务器端的响应头里面必须包含一个 Access-Control-Allow-Origin 并且该值匹配 Origin 请求头，这时候该跨域请求才有可能成功。否则一律失败。

`Access-Control-Allow-Origin` 是第一道门槛。其值的匹配规则是：

如果其值是通配符 `*` 的话，则允许所有的域名进行跨域请求
如果其值是指定的某个固定域名，那么只允许该域名进行跨域请求，其他域名将会失败
如果其值是带有通配符的域名，如 `*.example.com` ，那么则允许该域名以及该域名的子域名进行跨域。
具体可以观看 demo，[demo-0](http://us1.serenader.me:3334/#no0) 展示了当脚本请求没有配置跨域头的接口时，请求被浏览器拦截了的情况：

<img :src="$withBase('/img/webfe/cors/cors01.jpg')">

[demo-1](http://us1.serenader.me:3334/#no1) 则展示了接口有配置 Access-Control-Allow-Origin 响应头，但是并非脚本请求的域名，此时浏览器会报这种错：

<img :src="$withBase('/img/webfe/cors/cors02.jpg')">

只有配置了正确的 Access-Control-Allow-Origin 响应头请求才能够正常接收到响应，如 [demo-2](http://us1.serenader.me:3334/#no2)，此时的请求头和响应头为：

```
GET /api2 HTTP/1.1
Host: us1.serenader.me:3333
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Origin: http://us1.serenader.me:3334
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36
Accept: */*
Referer: http://us1.serenader.me:3334/
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,fr;q=0.2
```

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 2
ETag: W/"2-REvLOj/Pg4kpbElGfyfh1g"
Date: Thu, 19 Jan 2017 15:03:33 GMT
Connection: keep-alive
```

对于简单的跨域请求来说，通常只需要通过 `Access-Control-Allow-Origin` 这个响应头则可以请求成功（带 cookie 等情况先不考虑，会在下面讨论）。而当请求不是简单的跨域请求，情况就比较复杂。

### Access-Control-Allow-Headers

`Access-Control-Allow-Headers` 是用来告诉浏览器当前接口所允许带上的特殊请求头是哪些。这个 HTTP 头一般会出现在 OPTIONS 请求的响应头中。

当请求设置了一个特殊的请求头而且所请求的接口并没有配置 `Access-Control-Allow-Headers` 响应头时，会报如下错误，如 [demo-3](http://us1.serenader.me:3334/#no3) 所示：

<img :src="$withBase('/img/webfe/cors/cors03.jpg')">

上面的截图展示了请求附带了一个 `X-Custom-Header` 的请求头，但是请求在 preflight 阶段就失败了，如果要让请求成功完成的话，则必须在 OPTIONS 请求的响应里面配上 `Access-Control-Allow-Headers: X-Custom-Header`。

### Access-Control-Allow-Methods

与上一个 HTTP 头相似，`Access-Control-Allow-Methods` 告诉浏览器当前接口允许使用哪些 HTTP 方法去请求它。这个 HTTP 头通常也是在 OPTIONS 请求的响应头中才有意义。当没有通过这个响应头时，会报这样的错误：

<img :src="$withBase('/img/webfe/cors/cors04.jpg')">

同样的，上面的截图在 preflight 阶段就失败了。如果要让请求成功执行的话，那么需要配置响应头为：`Access-Control-Allow-Methods: GET,POST,PUT`。

### Access-Control-Max-Age

由于 OPTIONS 请求的存在，对于一个非简单请求来说，实际发出去的请求会有两个。这多多少少会浪费带宽，毕竟这个校验应该只会在第一次发生而已，一旦通过校验，在接下来的一段时间里，再次请求该接口的话，那么实际上 OPTIONS 请求则没有必要再发出。

好在，有个叫做 `Access-Control-Max-Age` 的响应头可以实现这样的功能。这个响应头指定了请求一旦通过了 preflight 请求之后，会在多长时间内无须再次触发 preflight 请求。从而达到减少实际请求，减少带宽浪费的问题。

### Access-Control-Allow-Credentials

默认情况下， 任何跨域请求都不会带上任何身份凭证的，这些身份凭证包括：

* cookie
* 与身份认证相关的请求
* TLS 客户端证书

然而，在大多数情况下，我们需要请求带上 cookie ，那么则需要开启跨域请求的 `withCredentials` 选项。

想要手动开启传输 cookie 的话，有以下方法；

* XHR：为 XHR对象设置 xhr.withCredentials = true 。
* fetch: 传入的参数选项里面开启 credentials fetch(url, { credentials: 'include' })

开启了 `withCredentials` 之后，请求在发出去的时候就会默认加上 Cookie。

然而，除了需要在前端中手动开启 withCredentials 之外，服务器端也需要有相应响应头支持，请求才会成功。

`Access-Control-Allow-Credentials` 这个响应头则是表明了当前请求的资源是否允许附带身份凭证。当其值为 true 时请求才成功，否则会失败，失败内容如下：

<img :src="$withBase('/img/webfe/cors/cors05.jpg')">

可以参考 demo-7观看请求头以及响应头。

另外，**一旦开启了 `withCredentials` 选项，服务器端的 `Access-Control-Allow-Origin` 响应头就不能是通配符，只能是固定的一个域名，否则会请求失败。**具体错误内容为：

<img :src="$withBase('/img/webfe/cors/cors06.jpg')">

[demo-8](http://us1.serenader.me:3334/#no8) 和 [demo-9](http://us1.serenader.me:3334/#no9) 分别演示了当请求带上 cookie 时，响应头配置为通配符的情况以及响应头有正确配置为具体域名的情况。


## 总结

总的来说，当在脚本里面发出请求时，会有以下情况：

1. 所请求资源的协议、端口或者域名如果与当前发出请求的页面地址一致，那么则符合同源策略，请求可以被正常发出。反之，则称为跨域请求，需要遵守 CORS 机制。
2. 所有跨域请求里面，服务器端必须返回 `Access-Control-Allow-Origin` 响应头，并且其值与请求中的 Origin 请求头的值相匹配。此时请求才可以被允许，否则请求将会被浏览器拦截掉。
3. 跨域请求分为两种，一种是简单跨域请求，另外一种是非简单跨域请求。非简单跨域请求在发出请求之前，浏览器会先发出一个 preflight 请求，即一个 OPTIONS 请求，用来验证服务器端是否允许该请求的访问。当 OPTIONS 请求成功时，才会继续发送真正的请求。否则请求将会在 OPTIONS 阶段便失败了，后续真正的请求也不会发出去。
4. 当请求带上了特殊的请求头时，服务器端返回的 OPTIONS 请求的响应必须包含 `Access-Control-Allow-Headers` 响应头，并且该值包含请求所带上的特殊请求头的名称。这时候请求才会成功，否则会被浏览器拦截。
5. 当请求使用了特殊的 HTTP 方法，服务器端返回的 OPTIONS 请求的响应必须包含 `Access-Control-Allow-Methods` 响应头，并且该值包含当前使用的 HTTP 方法。如果没有该响应头，或者当前使用的方法并不在其值里面，则请求会被浏览器拦截。
6. 因为非简单请求每次完整请求一次资源实际上都会发出去两个请求，为了减少 OPTIONS 请求发出的次数，以便减少带宽浪费，服务器端可以配置 `Access-Control-Max-Age` 来指定浏览器可以在多长时间内对 OPTIONS 请求做缓存，使得一次请求成功后，下次请求相同的接口时不用再发出 OPTIONS 请求。
7. 当跨域请求需要带上 cookie 等身份凭证时，需要手动开启 withCredentials 选项，并且服务器端需要配置 `Access-Control-Allow-Credentials` 的响应头，否则请求将不会带上任何身份凭证，或者当没有 `Access-Control-Allow-Credentials` 时请求会被浏览器拦截。
8. 当请求有带上身份凭证时，服务器端除了需要配置 `Access-Control-Allow-Credentials` 响应头之外，`Access-Control-Allow-Origin` 响应头的值不能是通配符，必须是具体的某一个域名。否则会被浏览器拦截。

在以上 8 点当中，值得注意的是第 3 点和第 8 点。

OPTIONS 请求是一个比较容易被人忽略的一个关键点，有一些后端人员在编写接口的时候，往往只知道在接口的响应头里面写入 `Access-Control-Allow-Origin` ，而没有意识到 OPTIONS 请求的存在。特别是 OPTIONS 请求并不是每个跨域请求都会带上的，这就导致了有些人会有疑问，为什么明明我发出去的是 GET 请求，结果却是发出去了一个 OPTIONS 请求。而即使有对 OPTIONS 请求做跨域允许的话，那么也很容易因为缺少相应的 `Access-Control-Allow-Headers` 或 `Access-Control-Allow-Methods` 响应头导致请求仍然失败。

第 8 点也是一个非常重要的关键点。如果你有接口需要对多个不同域名的网站提供服务的话，那么你的接口就不能使用 cookie 等身份凭证了，毕竟 `Access-Control-Allow-Origin` 不能设置为通配符，限制了接口使用的对象。


## 彩蛋时间

前面提到了只有非简单请求才会触发 OPTIONS 请求，而满足简单请求也就只有那三个条件。但是事实并不是想象中的那么完美。

假如你使用了 XMLHttpRequest 来实现文件上传的话，如果在 `xhr.upload` 这个对象里面添加任何事件监听，就会触发 OPTIONS 请求。即使此时该请求本身是满足简单请求的三个条件的。而一旦把事件监听去掉就没有。具体可以参考 [demo-10](http://us1.serenader.me:3334/#no10)、[demo-11](http://us1.serenader.me:3334/#no11)、[demo-12](http://us1.serenader.me:3334/#no12)

这个「bug」是我当初在编写 uploader 这个库时无意间发现的，我当时还以为是浏览器的 bug ，但是后来在 Stackoverflow 进行一番搜索后才发现，原来这是浏览器隐藏的一个 「feature」。。

> Turns out this is not a bug. The spec for XMLHttpRequest does mention that upload progress event handlers should cause the "force preflight" flag to be set. I was a bit confused when this was not specifically mentioned in the CORS spec, even though that spec does reference the existence of a "force preflight" flag.