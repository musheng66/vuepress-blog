module.exports = {
  title: '沐圣阁',
  description: '沐圣的小站',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
  ],
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    // 备案号
    record: '京ICP备19057357号-1',
    // 项目开始时间，只填写年份
    startYear: '2017',
    // author
    author: '沐圣',
    // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: '标签'      // 默认文案 “标签”
      }
    },
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
        {
          title:'单点登录',
          collapsable: true,
          children:[
            '/blogs/tech/sso/CAS认证前后端分离单点登录调研'
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
            '/blogs/note/2019年度个人工作总结',
          ]
        },
      ]
    },
    nav: [
      { text: '主页', icon: 'reco-home', link: '/' },
      { text: '技术', icon: 'reco-api', link: '/blogs/tech/' },
      { text: '原创', icon: 'reco-document', link: '/blogs/article/' },
      { text: '随笔', icon: 'reco-suggestion', link: '/blogs/note/' },
      // { text: 'Github', link: 'https://github.com/musheng66' },
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
}