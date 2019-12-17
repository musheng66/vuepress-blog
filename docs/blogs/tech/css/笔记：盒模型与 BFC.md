---
title: CSS笔记：盒模型与 BFC
date: 2018-02-02
categories:
 - 前端
tags:
 - CSS
---
近期正在看慕课网的一套前端课程，其主要内容对 Web 前端的技术基础进行梳理讲解，现将学习笔记写在这里，以备查阅。

本篇主要内容为 CSS 盒模型。重点对 BFC 进行学习记录。
<!--more-->

## CSS 盒模型（Box Model）
CSS盒模型是规定处理元素内容、内边距、边框、外边距的方式。

元素框的最内部分是实际的内容，直接包围内容的是内边距。内边距呈现了元素的背景。内边距的边缘是边框。边框以外是外边距，外边距默认是透明的，因此不会遮挡其后的任何元素。

<img src="http://www.w3school.com.cn/i/ct_boxmodel.gif" alt="引自w3school">

对于盒模型，浏览器默认是以元素的内容计算元素的宽高（标准模型），即 `box-sizing: content-box`。而对于一般的布局来说，一个完整的元素宽高应该是内容、内边距和边框的组合计算结果（外边距并不包括在内），因此我们通常将所有元素的样式设置为 `box-sizing: border-box` 来重置浏览器的计算方式。

> JS获取dom元素的宽高
> + dom.style.width/height 只获取内联样式
> + dom.currentStyle.width/height IE下获取样式的方法
> + window.getComputedStyle(dom).width/height 常用获取样式的方法
> + dom.getBoundingClientRect().width/height 获取4个值（left、top、width、height）

## BFC 基本知识
BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

### Formatting context
Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。

### 布局规则
+ 内部的 Box 会在垂直方向，一个接一个地放置。
+ Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠，以两者重合的 margin 中较大值确定间隔。
+ 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
+ BFC 的区域不会与 float box 重叠。
+ BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
+ 计算 BFC 的高度时，浮动元素也参与计算。

文档原文：
> In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block. The vertical distance between two sibling boxes is determined by the'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context collapse.

> In a block formatting context, each box's left outer edge touches the left edge of the containing block (for right-to-left formatting, right edges touch). This is true even in the presence of floats (although a box's line boxes may shrink due to the floats), unless the box establishes a new block formatting context (in which case the box itself may become narrower due to the floats).

### 产生原因
+ 根元素
+ float 属性不为 none
+ position 为 absolute 或 fixed
+ display 为 inline-block, table-cell, table-caption
+ overflow 不为 visible

文档原文：
> Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

## 同一个问题
回到上一篇的问题，如果稍作修改：对一个**未知高度**的页面区域进行三栏布局，其中左侧和右侧宽度固定，中间部分自适应。

### float
对于 float 布局来说，如果我们不指定容器高度，那么我们的布局效果将会是这样：

<div style="overflow: hidden;"><div style="float: left; width: 100px; background: #ffc4c4;">左</div><div style="float: right; width: 100px; background: #ffffbc;">右</div><div style="background: #c9ceff;">中<br>间<br>部<br>分</div></div>

上面的布局显示，当中间部分的内容高度超过左右两侧的高度时，超过的部分会分别占满容器两侧的剩余空间。（其实这时中间部分其实是沾满了整个父元素的，只不过左右两侧的浮动元素将其遮盖了一部分，而其内容则不会被遮盖。）这是由于前面提到的 BFC 规则中的第三条：`每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此`。

如果想要让中间的部分垂直显示，我们只需要根据另一条规则：`BFC 的区域不会与 float box 重叠。`将中间的部分也变为 BFC 区域即可。这里我们可以根据 BFC 的产生原因之一的 overflow 属性设置将中间区域变为 BFC。

<div style="overflow: hidden;"><div style="float: left; width: 100px; background: #ffc4c4;">左</div><div style="float: right; width: 100px; background: #ffffbc;">右</div><div style="background: #c9ceff; overflow: hidden;">中<br>间<br>部<br>分<br>设置overflow: hidden</div></div>

很明显，这种方法可以让中间部分自适应宽度，但对于两侧的高度仍然无法自适应。

### absolute
对于 absolute 布局，与 float 的结果类似，如果不指定容器高度，布局效果也会是这样：

<div style="overflow: hidden; position: relative;"><div style="position: absolute; left: 0; width: 100px; background: #ffc4c4;">左</div><div style="position: absolute; right: 0; width: 100px; background: #ffffbc;">右</div><div style="background: #c9ceff;">中<br>间<br>部<br>分</div></div>

同样，由于 BFC 的规则，每个元素的左边和父元素左边相接，右侧同样，与 float 布局的效果相似，区别在于，这里的中间部分的内容不会为侧栏腾出位置，这在上一章的 float 和 absolute 两个布局中介绍过。现在，如果想让中间部分垂直显示，我们需要给中间部分设置与两侧宽度相同的左右边距（外边距）。

<div style="overflow: hidden; position: relative;"><div style="position: absolute; left: 0; width: 100px; background: #ffc4c4;">左</div><div style="position: absolute; right: 0; width: 100px; background: #ffffbc;">右</div><div style="margin: 0 100px; background: #c9ceff;">中<br>间<br>部<br>分<br>使用 margin 而非 padding</div></div>

这里我们可以看到，设置了外边距后，同样实现了中间部分的宽度自适应，仍然无法适应高度。

## 总结
这里我们对 CSS 盒模型和 BFC 规则进行了总结，并结合实际的布局问题分析了 float 和 absolute 两种布局方式的基本原理。对于以上的布局问题，flex、table、grid 三种布局方案均可以很好的实现宽度、高度的自适应，因此在这里不做说明了。

## 参考资料

[慕课网课程](https://coding.imooc.com/class/129.html)

[CSS 框模型概述](http://www.w3school.com.cn/css/css_boxmodel.asp)

[前端精选文摘：BFC 神奇背后的原理](https://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html)

[深入理解BFC原理及应用](https://www.jianshu.com/p/acf76871d259)