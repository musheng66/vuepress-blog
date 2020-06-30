---
title: Vue+OAuth2.0前后端分离单点登录调研
date: 2020-06-16
categories:
 - 前端
tags:
 - 单点登录
---
基于 Vue 和 OAuth 2.0 的前后端分离单点登录实现方案调研。
<!-- more -->
## 前言
上一篇中记录了第一次进行前后端分离架构下的 CAS 单点登录调研方案，最终还是存在一些问题，经过和同事的讨论，我们决定重新设计一套实现方案。继续调研后，我们改变了思路，决定使用 OAuth 2.0 协议实现登录，现在此处记录一下相关情况以备日后查阅。

## 知识点
关于 OAuth 2.0，网上相关的资料非常丰富，在此不再详述。我们只需要知道本方案需要用到的是通过基于 OAuth 2.0 协议开发的认证服务获取授权 token 来实现登录认证即可。

## 存在的问题
这里记录一下前后端分离架构单点登录最核心的问题。
### XMLHttpRequest 请求与 302 状态码
对于前后端分离架构常用的 XMLHttpRequest（Ajax、Axios 等库都是对它的封装） 请求方式来说，基于浏览器会话的传统项目常见的 302 状态码无疑是一道深坑。第一次见到那个跨域的错误时，我很诧异，以为是自己的代码写的有问题，直到我调试了全部代码之后，发现根本捕获不到 302 状态。

后来我终于在[这里](https://stackoverflow.com/questions/15996779/cannot-handle-302-redirect-in-ajax-and-why/15996968#15996968)找到了原因：

> You can't handle redirects with XHR callbacks because the browser takes care of them automatically. You will only get back what at the redirected location.

浏览器会自动优先处理重定向请求，只会返回重定向地址给出的结果。这必然会导致 302 状态码无法返回前端被捕获，而是会被浏览器直接跳转，我们最终只能得到从当前地址访问重定向地址后可能产生的跨域错误。

## 解决方案
上面的问题，也是在上一篇中 CAS 协议下最核心的问题，然而经过我们的调研，最后未能完美解决。这里我们不再纠结于旧的会话方式认证，而是使用 OAuth 2.0 认证方法，完全避免了浏览器会话导致的这个问题。
### 前端
#### 1.创建用于登录的 passport 项目
此前端应包含登录页以及登录成功后的中转页面，在中转页面中可使用隐藏的 iframe 引入子系统的某一页面（用于在子系统域下存入 token）。
向 iframe 中设置 token 的部分代码，使用 postMessage 方式实现：
```javascript
  const clientElement = document.getElementById(clientId)
  // 等待 iframe 加载完成
  clientElement.onload = function () {
    clientElement.contentWindow.postMessage({ type: 'setToken', token: getToken() }, '*')
  }
```

#### 2.子系统白名单页面
每个子系统都需要有一个专门用于登录后 iframe 引入的白名单页面，此页面只用于登录后设置 token，页面中需包含设置 token 的代码：
```javascript
export default {
  mounted () {
    window.addEventListener('message', this.receiveMsg, false)
  },
  methods: {
    /**
     * 处理推送信息，存放 token
     * @param event
     */
    receiveMsg (event) {
      const data = event.data
      if (data.type === 'setToken') {
        if (data.token) {
          setToken(data.token)
        }
      }
    }
  }
}
```

#### 3.处理未登录状态码
前端可以封装一个发送请求并接收返回值的组件，用于拦截所有的返回结果。
与后端约定判断返回的状态码，若需登录，则保存当前浏览器地址，向登录页跳转，并带上要回跳的当前页面地址。

以 axios 封装请求的组件为例：
```javascript
service.interceptors.response.use(
  response => {
    // 返回 200 状态码及 JSON 数据
    if (String(response.data.code) === '401') {
      // 获取当前浏览器地址，用于登录后返回
      const href = window.location.href
      // redirectURL 可存放登录页地址
      window.location.href = response.data.redirectURL || 'http://passport.server.com:8080/#/login' + '?client=' + encodeURIComponent(href)
    }
    return response.data
  },
  error => {
    return Promise.reject(error)
    // 返回 401 状态码
    // if (error.response.status === 401) {
    //  const href = window.location.href
    //  window.location.href = response.data.redirectURL || 'http://passport.server.com:8080/#/login' + '?client=' + encodeURIComponent(href)
    // }
  }
)
```

### 整体流程设计

1. 浏览器访问子系统 A 前端页面，前端向 A 后端发送请求
2. 请求 A 后端资源时发现未登录返回 401 状态码或 JSON 数据
3. 前端发现 401，将浏览器重定向到 passport 登录页，后面带上 client 参数，用于登录后返回当前页面
4. passport 登录页记录 client 参数，登录成功后跳转到中转页面，中转页面包含所有子系统 iframe 页面
5. 在中转页中对每个子系统页面通过 postMessage 方法传入 token
6. 子系统监听并接收传入的 token，存入本域下
7. 中转页面设置好 token 后根据传入的 client 参数进行跳转
8. 浏览器访问子系统 B 前端页面，前端向 B 后端发送请求
9. 请求 B 后端资源时发现请求中携带 token，判断为已登录

## 遇到的问题
### 多个 iframe 需要完全加载
中转页面需要等所有 iframe 都加载完并设置好 token 才可进行下一步跳转。此处只能用 vue 监听一个计数器，根据计数器判断是否设置完成。

## 存在的缺陷
### 前端中转页面等待时间长
由于需要等待子系统页面加载完成才能设置 token，子系统越多需要等待的时间就越长。因此每个子系统中将被 iframe 引入的页面最好尽量简单，以减少加载时间。

## 小结
通过此次调研，基本确认使用这种方案可以实现前后端分离架构下的单点登录了。后续工作和学习中如果有更好的想法我会及时更新，也欢迎各位看官共同讨论。

## 参考资料
### OAuth 2.0
- [理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
- [OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
- [OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
