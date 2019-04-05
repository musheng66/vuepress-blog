---
title: 使用hexo搭建自己的博客 - 快速开始
date: 2017-12-18 15:00:09
tags: hexo
---
工欲善其事，必先利其器。下面要开始用 [Hexo](https://hexo.io/) + [GitHub](https://github.com/) 搭建自己的博客了。需要注意的是，网上的资料有一些已经过时，而现在的这篇文章也可能在以后过时，所以只将目前我搭建 hexo 博客站的经验总结如下。

<!-- more -->

## 目标
我们要使用 hexo 搭建一个个人博客项目，并使其部署在 [GitHub Pages](https://pages.github.com/) 上（GitHub Pages是 GitHub 为开发者提供的免费托管网站的空间，这就使得我们不再需要额外购买独立的域名空间了，对于部署个人博客这样的小访问量网站来说极其方便，具体信息可以自行查询资料）。

## 简易搭建方法
从网上找过几处资料，从中选取了最简捷的搭建方法记录如下。更多的资料可以查阅 hexo [官方文档](https://hexo.io/zh-cn/docs/index.html)。

### 安装前提
hexo 基于 Node.js，并且我们想要将博客部署在 GitHub 上，于是我们需要先安装 [Node.js](http://nodejs.org/) 以及 [Git](http://git-scm.com/)。
当然，我们还需要申请一个 GitHub 账号，因为我们的网站域名将会是由GitHub按照我们的用户名分配给我们的，比如我的注册用户名是 musheng66，那么我的个人域名就是 <https://musheng66.github.io/>。

### 安装 hexo
hexo 的安装非常简单，如果我们已经安装好了 Node.js，我们就可以打开命令行，只需一行命令：
```bash
$ npm install -g hexo-cli
```

当然 Mac 用户朋友们可能由于权限限制，需要输入：
```bash
$ sudo npm install -g hexo-cli
```
安装完成。

### 建站
安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件。
```bash
$ hexo init <要建立的项目文件夹，如：blog>
$ cd blog
$ npm install
```

### 命令
通过命令行可以执行hexo的各项命令，完成从建站到发布所需的操作。

#### new
新建博客，hexo 会自行生成一个对应名称的 .md 文件。需要注意的是如果想删除博客，可以直接删除 .md 文件并重新 generate 博客站。
```bash
$ hexo new 博客名称
```

#### generate
生成静态文件，可以生成我们的 hexo 博客网站。
```bash
$ hexo g
```

#### clean
清除已生成的静态文件，每次需要重新生成网站之前运行。
```bash
$ hexo clean
```

#### server
用来查看本机的 hexo 博客项目，需要先进行 clean，generate 操作再运行。需要注意的是如果只修改了博客内容，是不需要重新生成网站的，而修改了其他的诸如主题、博客标题、模版样式、资源文件等需要重新 generate 之后才能看到效果。
```bash
$ hexo server
```

#### deploy
部署到 GitHub，下文将介绍具体的步骤。（注：目录中的 .deploy_git 文件夹中的内容就是将要部署的内容）
```bash
$ hexo deploy
```

### 与 GitHub 进行关联
我们需要将目前的 hexo 项目与我们 GitHub 个人账号中的一个 repository 进行关联，这样我们每次只需要一个 deploy 命令，就可以将新写的博客发到我们的个人博客站上了。

#### 建立 GitHub repository
使用 GitHub 账号登录后，建立一个属于自己的 repository 非常容易，**我们需要注意的是 repository 的命名必须和我们被分配的域名相同**，比如我的 repository 就需要命名为 musheng66.github.io，这一点非常重要。

#### 配置与发布
在我们的整个 hexo 项目中，**_config.yml** 是配置文件，我们可以在其中修改各种可配置的网站属性。现在我们需要将本地的 hexo 项目与 GitHub 上的 repository 进行关联。
我们需要找到 _config.yml 中的 deploy 属性，将其设置如下：

<pre>
deploy:
  type: git
  repository: https://github.com/musheng66/musheng66.github.io.git
  branch: master
</pre>

**注意**：repository 属性需要填写**我们自己的 repository 对应的地址**。修改完成后，我们每次使用 deploy 命令即可发布新的博客。至此，使用 hexo + GitHub 搭建博客的简要过程就介绍完了。

## 踩过的坑

### 页面引入 jQuery 的问题

使用默认主题 landscape 生成的主页面 index.html 会引入 jQuery 文件，而引入的语句通常是这样的：
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
```
目前我们的 GFW 显然不会放任我们访问这样的站点，所以这会导致我们的博客无法正常渲染 jQuery 相关的动效和功能。

想要解决这个问题也并不复杂，只需要找到当前实用的主题文件夹，在其layout文件夹中找到写有引入 jQuery 文件的位置。对于使用 hexo 默认方法搭建博客的开发者来说，此位置一般在 themes/landscape/layout/_partial/after-footer.ejs。我们只需在此处将引入 jQuery 的地址替换为国内可访问的镜像，或者索性下载一份 jQuery 代码放入此主题的 source/js 文件夹中再行引用即可。

其实大部分的自定义主题都会将这种地址配置在 config.yml 中，比如我使用的 Material 主题即可以在配置文件中配置引入 jQuery 的地址，故此我只需要将其修改即可（附上我使用的 CDN ：<https://cdn.bootcss.com/jquery/2.2.0/jquery.js>）。

补充一点，我们需要注意此处引用的 jQuery 是 http 协议的外部资源，而我们的项目部署在 GitHub 上，GitHub 使用的 https 协议是无法加载 http 协议的资源的。好在我们引用的时候并没有指定协议，在 URL 之前的`//`使用了当前协议，因此外部资源可以正常引入。

### 使用 Material 主题时出现的问题

众所周知，[Material](https://github.com/viosey/hexo-theme-material) 主题是一款非常漂亮的 hexo 主题，不过我们在第一次使用它时可能也会出现一些小问题。

#### hexo g 报错问题
虽然 hexo g 报错可能有各种原因，但大家在第一次使用 Material 主题时最容易导致报错的原因大概会是这样：

> 注意！ 在主题的开发迭代过程中，主题的配置文件模板 可能会改动。为了避免使用 git pull 更新主题的用户出现冲突，我们将 主题配置文件模板 命名为 _config.template.yml。配置主题时，你应该拷贝一份 _config.template.yml 并将其重命名为 _config.yml。

这是 Material 主题使用说明中的一段，正因为它将 _config 配置文件改了名字，我们在 hexo g 时才会报类似这样的错：

<pre>
Unhandled rejection TypeError: /Users/musheng/Projects/WebstormProjects/blog/themes/material/layout/post.ejs:44
    42|                 <!-- Post Comments -->
    43|                 <% if(page.comment !== false) { %>
 >> 44|                     <%- partial('_partial/comment') %>
    45|                 <% } %>
    45|                 <% } %>
</pre>

所以对于这个问题，我们只需要**拷贝一份 _config.template.yml 并将其重命名为 _config.yml**就可以解决了。

#### 本地搜索问题
使用 Material 主题时，如果我们想使用本地搜索而非 Google 或其他搜索该如何设置呢？

首先，使用本地搜索需要安装 [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search) 插件。

然后，我们需要在项目根目录下找到 _config.yml 文件，在里面添加：

<pre>
# Native Search
## https://github.com/PaicHyperionDev/hexo-generator-search
search:
    path: search.xml
    field: all
</pre>

另外，因为 Material 主题的配置文件中对搜索可能也有配置，我们还需要找到主题中的配置，**修改 use 为 local** ：

<pre>
# Search Systems
# Available value:
#     swiftype | google | local
search:
    use: local
    swiftype_key:
</pre>


## 参考资料

[Hexo 官方](https://hexo.io/zh-cn/)

[Material 主题](https://material.viosey.com/)

[使用 Github 和 Hexo 快速搭建个人博客](https://www.qcloud.com/community/article/989575001490326243)

[HEXO搭建个人博客](http://baixin.io/2015/08/HEXO%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/)
