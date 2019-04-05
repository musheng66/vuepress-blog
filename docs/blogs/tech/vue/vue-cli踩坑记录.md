---
title: vue-cli踩坑记录
date: 2018-01-12 12:01:14
tags: vue-cli
---
使用vue-cli的过程中，体验到便利的同时也踩了一些坑，记在这里以备查阅。
<!-- more -->
## 使用vue-cli时，更新vue版本，本地调试时加载的vue版本未改变

### 现象
使用vue-cli时，当更新vue版本后，进行本地调试，发现用来渲染的vue版本仍为以前的版本，并未与package.json中的vue版本一致。

诸如[这位同学提出的问题](https://segmentfault.com/q/1010000012546288)，也可能是同样的现象。

### 原因
vue-cli本地调试时，index.html页面调用的vendor.dll.js一般位于项目文件夹下的static/js/目录下，而如果我们更新了vue版本，而不进行build:dll，那么这个文件里的vue始终还是上次生成的。

注意：此问题一般只出现在本地调试中，而在正式打包时，vendor会被webpack正确的打包并被index.html引入。