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

## 两套方案
关于这类解决方案网上应该有很多，在这里主要记录一下我们调研过的两套方案。这两套方案的核心都是一句话：token 共享，即需要让多个子系统共享登录状态。

## 解决方案一
这是我们基于 OAuth 认证做出的第一个能实现单点登录功能的方案。思路主要是利用 iframe 进行 token 的共享，借以实现子系统登录状态的同步。

### 整体流程设计

1. 浏览器访问子系统 A 前端页面，前端向 A 后端发送请求
2. 请求 A 后端资源时发现未登录返回对应的状态码（如：401）或 JSON 数据
3. 前端发现未登录，将浏览器重定向到 passport 登录页，后面带上 client 参数，用于登录后返回当前页面
4. passport 登录页记录 client 参数，登录成功后跳转到中转页面，中转页面包含所有子系统 iframe 页面
5. 在中转页中对每个子系统页面通过 postMessage 方法传入 token
6. 子系统监听并接收传入的 token，存入本域下
7. 中转页面设置好 token 后根据传入的 client 参数进行跳转
8. 浏览器访问子系统 B 前端页面，前端向 B 后端发送请求
9. 请求 B 后端资源时发现请求中携带 token，判断为已登录

### 前端实现
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

### 遇到的问题
#### 1.多个 iframe 需要完全加载
中转页面需要等所有 iframe 都加载完并设置好 token 才可进行下一步跳转。此处只能用 vue 监听一个计数器，根据计数器判断是否设置完成。

### 存在的缺陷
#### 1.前端中转页面等待时间长
由于需要等待子系统页面加载完成才能设置 token，子系统越多需要等待的时间就越长。因此每个子系统中将被 iframe 引入的页面最好尽量简单，以减少加载时间。

## 解决方案二
此方案是在后续和同事讨论中产生的。主要是利用统一认证系统的前端来实现类似 CAS Server 的功能，以对携带应用标识的子系统返回 token 的方式共享登录状态。

### 整体流程设计

1. 浏览器访问子系统 A 前端页面，前端向 A 后端发送请求
2. 请求 A 后端资源时发现未登录返回对应的状态码（如：401）或 JSON 数据
3. A 前端发现未登录，将浏览器重定向到 passport 登录页，并带上两个参数：client（当前页面 url），以及 application（应用标识）
4. passport 登录页记录 client 以及 application，用户进行登录
5. 登录成功后获取用户信息（用以验证 token 是否有效）
6. 验证 token 成功后判断：若存在 client 参数，并且 application 标识正确，则将 token 放入 client 的链接末尾进行跳转，若不需要跳转则访问门户页面
7. 子系统 A 路由监听并接收传入的 token，存入子系统域下，至此子系统 A 登录成功
8. 浏览器访问子系统 B 前端页面，前端向 B 后端发送请求
9. B 后端发现未登录，返回未登录状态码（如：401）或 JSON 数据
10. B 前端发现未登录，将浏览器重定向到 passport 登录页，并带上两个参数：client（当前页面 url），以及 application（应用标识）
11. passport 登录页判断已登录，获取用户信息（验证 token 是否有效）
12. token 有效，判断是否需要根据 client 跳转，若需跳转，验证 application 标识，验证成功后将 token 放入链接末尾传递给子系统 B；不需跳转，访问门户页面
13. token 失效，清除登录信息，跳转登录页面重新登录

### 前端实现
#### 1.创建用于登录的 passport 项目
此前端应包含登录页以及门户页面，门户页面中可在跳转每个子系统时动态增加 token 参数，将登录后的有效 token 传递给每个子系统。

#### 2.处理未登录状态码
前端可以封装一个发送请求并接收返回值的组件，用于拦截所有的返回结果。
与后端约定判断返回的状态码，若需登录，则保存当前浏览器地址，向登录页跳转，并带上要回跳的当前页面地址，以及当前子系统的应用标识以供统一认证系统验证。

以 axios 封装请求的组件为例：
```javascript
service.interceptors.response.use(
  response => {
    // 返回 200 状态码及 JSON 数据
    if (String(response.data.code) === '401') {
      // 获取当前浏览器地址，用于登录后返回
      const href = window.location.href
      window.location.href = 'http://passport.server.com:8080/#/login' + '?application=clientA&client=' + encodeURIComponent(href)
    }
    return response.data
  },
  error => {
    return Promise.reject(error)
    // 返回 401 状态码
    // if (error.response.status === 401) {
    //  const href = window.location.href
    //  window.location.href = 'http://passport.server.com:8080/#/login' + '?application=clientA&client=' + encodeURIComponent(href)
    // }
  }
)
```

### 小结
此方案绕过了 iframe 方案中可能产生的各种性能、权限或兼容性问题，将可控的 passport 前端作为中心控制模块，所有登录相关逻辑集中在此，使整个登录方案实现时更加灵活高效，集成子系统时更为方便，后续调研中将主要测试此方案。

## 总结
以上就是本次调研得出的两个方案，其实我更倾向于称这两个方案为统一认证登录方案而非单点登录方案。说到底，它们并非传统意义上的单点登录，而是实现了单点登录功能（单点登录/登出等）的方案。
实现的过程有些投机取巧，并不优雅，但也算实用，后续工作学习中我也会继续思考和调研。

## 参考资料
### OAuth 2.0
- [理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
- [OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
- [OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
