---
title: 浅谈Web前端开发之响应式
date: 2017-12-27
categories:
 - 前端
tags:
 - 响应式开发
---
很早就想写一篇关于响应式开发的文章了，迟迟没有动笔，并非单纯因为懒，也因为随着时间推移对响应式开发的理解在逐步改变。这可能并不适合作为一篇技术文档，而更像是我自己对响应式开发的经验总结。
<!-- more -->

## 简述

什么是响应式开发？尽管前辈高人们已经对这个概念做了非常深入的解释和剖析，我还是想要自己组织语言重新介绍一下。因为听别人说与自己亲口说出来，对于知识的理解和帮助是有差距的。

我所理解的响应式开发（注意：本文特指Web前端响应式开发），就是利用Web开发语言，实现针对不同尺寸显示设备的响应式设计的开发方法。

何为响应式设计？


## 响应式设计

响应式设计，同样用我自己的话说，是设计人员通过考虑用户界面在不同尺寸设备上的显示及交互效果而做出的一套或多套设计。

### 不同尺寸

无论是响应式设计还是开发，我们都离不开这四个字：不同尺寸。所谓设备的不同尺寸，指的是随着电子产品的发展，我们访问 Web 页面时可以使用各种类型的产品（如：手机、平板、笔记本电脑等）。这也就导致传统的、专为 PC 上显示而设计的 Web 页面无法完整的呈现在尺寸不一的新型显示设备上（可能会出现显示不完整或错位等问题）。试想一下，当我们打开手机想要浏览喜欢的网站时，却发现这个页面在手机上根本无法正常显示，这种糟糕的用户体验显然不应该出现在当下。

### 标准创新

面对不断出现的新设备和新尺寸，设计师们不免有些力不从心，而为每一个尺寸单独进行一次设计对于产品整体开发效率的影响也十分严重。于是，响应式设计应运而生，改变了 Web 设计原有的思想，设计师们只需要按照标准进行一次设计，即可适配各种尺寸的设备。

<img :src="$withBase('/img/webfe/responsive/responsive1.jpeg')">

这并非偶然，通俗一点说，我们其实总是在不断发明新的事物让我们的工作生活更便捷。所谓万事有果必有因，有这样的需求，才有了这样的设计标准，而我相信这设计标准将在一段时间内成为 Web 产品设计者们的经典。

### 设计思路

了解了响应式设计的来龙去脉后，我们再来看一看响应式设计的思路。作为一个行外人，我无法对产品设计者们的设计思路进行指导，只能简单的根据所见所闻进行推想，那么响应式设计的思路大概是什么？

#### 移动优先

何谓响应式设计的"移动优先"？其实这是一种设计方式，让设计师们从用户可能使用的尺寸最小的设备开始设计，从小到大，在尺寸不断变大的过程中设计不同的页面布局。这种模式的出现，从需求上说，是由于在移动互联网飞速发展的今天，用户使用移动设备访问 Web 页面的次数激增。而从设计角度讲，优先设计小尺寸的显示效果可以让设计师们去繁就简，明确最重要的需要展现给用户的界面元素。

明确了移动优先的设计思路之后，只需要按照**由小到大**的尺寸设计页面布局，就可以设计出适配从手机到平板、笔记本、PC 等设备的各种界面了。

#### 临界值

在进行响应式设计时，我们需要注意一点，就是适配各种尺寸的临界值。为什么会有"临界值"的概念？理论上讲响应式设计的适配应该要适配所有的尺寸，每一个像素的改变都需要重新设计一套界面，想想这样的工作量，设计师们可能会集体暴动。

幸好我们有很好的替代方案，其实我们不需要适配像素级的改变，而只需要调查一下大部分的移动设备尺寸分布，再结合自己项目的需求，对我们需要适配的尺寸进行设计即可。所以我们只需要选择一个最小的适配尺寸开始设计，然后开始放大尺寸，在放大的过程中，我们发现需要更改界面布局时，就将当前的尺寸作为一个临界点，进行设计，这样最后的设计稿就自然的成为了符合需求的响应式设计稿了。当然，如果没有特别的需求，我们也可以使用响应式设计中比较通用的几个临界值进行设计。

目前比较流行的尺寸临界值有：

```css
/* 1. 常用于图片流 */
@media all and (max-width: 1690px) { ... }
@media all and (max-width: 1280px) { ... }
@media all and (max-width: 980px) { ... }
@media all and (max-width: 736px) { ... }
@media all and (max-width: 480px) { ... }

/* 2. 常用于稍微复杂的基本响应 */
@media all and (min-width:1200px){ ... }
@media all and (min-width: 960px) and (max-width: 1199px) { ... }
@media all and (min-width: 768px) and (max-width: 959px) { ... }
@media all and (min-width: 480px) and (max-width: 767px){ ... }
@media all and (max-width: 599px) { ... }
@media all and (max-width: 479px) { ... }

/* 3. 基于Bootstrap 3.x 全球主流框架 */
@media all and (max-width: 991px) { ... }
@media all and (max-width: 768px) { ... }
@media all and (max-width: 480px) { ... }

/* 4. 基于Bootstrap 4.x 全球主流框架 */
@media (min-width: 576px) { ... }
@media (min-width: 768px) { ... }
@media (min-width: 992px) { ... }
@media (min-width: 1200px) { ... }

/* 5. 常用于Retina屏幕图片适配(@2x) */
@media(-webkit-min-device-pixel-ratio:1.5){ ... }
@media(min--moz-device-pixel-ratio:1.5){ ... }
@media(-o-min-device-pixel-ratio:3/2){ ... }
@media(min-resolution:1.5dppx){ ... }
```

## 实现

下面将介绍作为开发者，如何进行响应式开发。请注意：这里的内容适合于 Web 开发有基础并希望了解响应式开发的读者，如果只想了解响应式开发概念，可以略过语法部分。

### 一套代码

在开始之前，我们首先要明确的是：本篇主要介绍的开发方式是基于一套代码的开发方式。当然，响应式开发的实现方式并非只有一种，比如我们可以开发多套代码，每套代码适配一种尺寸。这种方式当然并不优雅，同一个网站的代码却要分成两份，当我们有一天需要修改某个功能的时候，就需要在每一个项目中进行修改，这样做不仅会增加工作量，更可能引出意想不到的问题。

幸好，借助 CSS3 页面级的媒体查询新特性，我们将以此实现一套代码适配所有设计的需求。

### 媒体查询

**媒体查询**是响应式开发实现的重要基础。它通过对设备的类型、尺寸、方向等属性进行条件筛选，对符合条件的设备媒体进行单独的样式处理，来实现同一个网页在不同设备上的不同显示效果。

#### 功能浅析

其实媒体查询非常类似于我们编程中的条件语句，虽然写法不同，作用却相似。举个例子来说：`@media (min-width: 100px)`这样的语句就如同`if (width >= 100)`一样，只不过在 CSS3 中的写法如此。那么这句条件代表什么意思呢？它的意思就是：当媒体的可视宽度比100像素大的时候，进行若干样式设定。这样当我们手拿一个可视宽度大于100像素的设备时，那些设定的样式会显示出来，而当我们拿着可视宽度小于100像素的设备时，这些样式设定就不会起作用了。整个媒体查询都是基于这样的条件判断而进行的，这也是媒体查询的基本逻辑。

#### 语法简记

这里记录的只是媒体查询的常用基本语法，更多的语法可以查阅各种资料，这篇[CSS 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)对于媒体查询的讲解比较全面，所以将其列在此处以供读者查阅。

##### 类型

媒体查询的写法主要有两类：

1. 写在 link 标签中：`<link rel="stylesheet" media="(max-width: 100px)" href="example.css" />`。这种写法表明当设备可视宽度不大于100像素时，`example.css` 中的样式会起作用，反之则不会。
2. 写在样式表中：`@media (max-width: 100px) { ... }`。这种写法表示设备可视宽度不大于100像素时，大括号中的样式会起作用，反之则不会。

##### 逻辑操作符

以一条查询语句为例：`@media only screen and (min-width: 700px) and (orientation: landscape) { ... }`。这样的语句代表什么意思呢？

1. `only`：逻辑操作符其中之一，它代表 **仅当**，若不写则默认全部满足条件，后面需跟如 `screen` 或 `tv` 等条件。
2. `screen`：代表 **彩色屏幕**，表明当前设备是屏幕时才满足条件，若不写则认为所有设备均满足条件。
3. `and`：逻辑操作符，代表 **并且**，后面需要跟随条件，同时满足其前后的两个条件才算完全满足。
4. `(min-width: 700px)`：与`and`操作符连接，表明设备的可视范围需要不小于700像素。
5. `(orientation: landscape)`：**设备横屏**，当设备是横屏显示时满足条件，相应的还有 `(orientation: portrait)` 代表**竖屏**。
6. `{ ... }`：`{}`中即可书写样式代码，当以上条件满足时这些样式发挥作用。

### Flex 布局

**Flex 布局**是响应式开发的页面布局利器。它是由 W3C 提出的一种新布局方案，可以简便、完整、响应式地实现各种页面布局。目前，它已经得到了所有浏览器的支持。

#### 功能简介

简单来说，Flex 布局的最主要功能在于***对齐**与**居中**。在传统的布局方案中，虽然大部分布局需求都可以满足，但一些特殊要求（如垂直居中）其实是不容易实现的。而 Flex 布局（又称"弹性布局"）则可以满足这些要求，通过对其容器的属性进行设定，我们可以实现元素的排列方向、对齐方式、显示顺序等需求。由于其**弹性**特征，我们也不需要在响应式开发中对容器做过多的维护，可以说 Flex 布局是与响应式开发布局最契合的工具。

#### 语法简记

这里主要记录一下常用的写法，至于详细的语法介绍，可以查看下面我推荐的文章。

##### display:flex 写法

这是是将容器设定为 Flex 布局的写法，而对于不同浏览器的兼容性常常会使人头痛，所以我在查阅资料之后总结了一个比较稳妥的写法，列在此处：

```css
.box {
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */
}
```

##### flex-direction

这是设定容器内元素排列方向的属性，它可能有四个值：`flex-direction: row | row-reverse | column | column-reverse;`。我们常用的是`row`和`column`。

* row（默认值）：主轴为水平方向，起点在左端，容器内的元素从左向右排列，是布局默认的设定。
* column：主轴为垂直方向，起点在上沿，容器内元素从上到下排列。

##### flex-wrap

这是设定元素排列时超出容器的宽度或高度时如何换行，它可能有三个值：`flex-wrap: nowrap | wrap | wrap-reverse;`。

* nowrap：不换行，即便元素将要超出容器也不进行换行。这会导致元素在容器缩小时被挤压，即使你可能已经为其设置了宽度或长度，最终都会在一行中显示。
* wrap：正常换行，元素排列导致快要超出容器时进行换行显示。这种设定比较适合那些内容不能被挤压的元素，比如文字内容等。

##### justify-content

定义容器内元素的对齐方式，写法为：`justify-content: flex-start | flex-end | center | space-between | space-around;`。这里直接引述网络资料的介绍：

* flex-start（默认值）：左对齐
* flex-end：右对齐
* center： 居中
* space-between：两端对齐，项目之间的间隔都相等。
* space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

##### 推荐阅读

关于 Flex 布局我认为这两篇教程的讲解非常精辟，[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)可供随时查阅，[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)适合初学者理解与练习。

## 小结

以上就是我对于响应式开发工作的个人经验简记。就像大部分技术学习一样，响应式开发也是需要在实际工作中不断实践、理解才能掌握的。到目前为止我可能也只是初步掌握了响应式开发的基本技巧，这期间我从零开始自己寻找资料、学习实践，在那个对 Web 前端懵懂的时候也没有受到正确的引导，所以你所看见的这篇文章基本都是我自己对响应式开发的理解。我将其记录在此，以便像曾经的我一样希望学习响应式开发的读者可以少走一些弯路。

## 参考资料

[Web Design数据库：最新2017响应式设计断点数值与代码段参考](http://www.c945.com/article/677e0a007291ba63ace1675a.html)

[CSS 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
