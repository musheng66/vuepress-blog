module.exports = {
  title: '沐圣阁',
  description: '沐圣的博客站',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
  ],
  themeConfig: {
    sidebar: {
      '/blogs/tech/': [
        {
          title:'响应式设计',
          collapsable: true,
          children:[
            '/blogs/tech/responsive/浅谈Web前端开发之响应式',
          ]
        },
        {
          title:'Vue',
          collapsable: true,
          children:[
            '/blogs/tech/vue/vue-designer',
          ]
        },
        {
          title:'CSS',
          collapsable: true,
          children:[
            '/blogs/tech/css/笔记：页面布局',
            '/blogs/tech/css/笔记：盒模型与 BFC',
          ]
        },
        {
          title:'JavaScript',
          collapsable: true,
          children:[
            '/blogs/tech/js/使用hexo搭建自己的博客 - 快速开始',
            '/blogs/tech/js/转载：JavaScript 中的 HTTP 跨域请求',
          ]
        },
      ],
      '/blogs/article/': [
        {
          title:'原创',
          collapsable: false,
          children:[
            '/blogs/article/阁主寄语',
            '/blogs/article/高中时期旧作遴选',
            '/blogs/article/大学时期旧作遴选',
            '/blogs/article/壹本时期旧作遴选',
          ]
        },
      ],
      '/blogs/note/': [
        {
          title:'随笔',
          collapsable: false,
          children:[
            '/blogs/note/你好，世界',
            '/blogs/note/2017年度个人工作总结',
          ]
        },
      ]
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '技术', link: '/blogs/tech/' },
      { text: '原创', link: '/blogs/article/' },
      { text: '随笔', link: '/blogs/note/' },
      { text: 'Github', link: 'https://github.com/musheng66' },
      // 下拉列表的配置
      // {
      //   text: 'Languages',
      //   items: [
      //     { text: 'Chinese', link: '/language/chinese' },
      //     { text: 'English', link: '/language/English' }
      //   ]
      // }
    ]
  }
};