module.exports = {
  title: '沐圣阁',
  description: '沐圣的小站',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    // 备案号
    record: '京ICP备19057357号-1 京公网安备11011202002027号',
    // 项目开始时间，只填写年份
    startYear: '2017',
    // author
    author: '沐圣',
    logo: '/img/logo.jpg',
    // valineConfig: {
    //   appId: '0pzYxgDh5fcO9uCYeLNH0R05-gzGzoHsz',
    //   appKey: 'dtbEVM29neLqhnOFncrphKoz'
    // },
    vssueConfig: {
      platform: 'github',
      owner: 'musheng66',
      repo: 'vuepress-blog',
      clientId: '0a423a5ed3c5ee5793ca',
      clientSecret: '7d5cb0a0ac474e56a4ce5c8037fb3ff3039e5122',
    },
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
            '/blogs/tech/sso/CAS认证前后端分离单点登录调研',
            '/blogs/tech/sso/Vue + CAS Restful API前后端分离单点登录调研'
          ]
        },
      ],
      '/blogs/article/': [
        {
          title:'原创',
          collapsable: false,
          children:[
            '/blogs/article/阁主寄语'
          ]
        },
        {
          title:'壹本时期旧作',
          collapsable: true,
          children:[
            '/blogs/article/eben/吉祥如意',
            '/blogs/article/eben/丙申初雨',
            '/blogs/article/eben/乙未年十月初十逢雪',
            '/blogs/article/eben/未见初雪',
            '/blogs/article/eben/繁花未竟',
            '/blogs/article/eben/塞外',
            '/blogs/article/eben/云城',
            '/blogs/article/eben/平遥雨夜',
            '/blogs/article/eben/雾灵山游记',
            '/blogs/article/eben/雨虹',
            '/blogs/article/eben/惊雷',
            '/blogs/article/eben/又见暮雨',
            '/blogs/article/eben/秋赞',
            '/blogs/article/eben/张北草原游记',
            '/blogs/article/eben/雪落',
            '/blogs/article/eben/东昌晚景',
            '/blogs/article/eben/雪尽',
            // '/blogs/article/eben/壹本时期旧作遴选',
          ]
        },
        {
          title:'大学时期旧作',
          collapsable: true,
          children:[
            '/blogs/article/daxue/西风飘雪',
            '/blogs/article/daxue/清秋',
            '/blogs/article/daxue/又见夏雨',
            '/blogs/article/daxue/暮雨',
            '/blogs/article/daxue/清明闲赋二首',
            '/blogs/article/daxue/晚秋',
            '/blogs/article/daxue/月夜',
            '/blogs/article/daxue/又逢夏雨',
            '/blogs/article/daxue/上元雪',
            '/blogs/article/daxue/元旦',
            '/blogs/article/daxue/白石游记',
            '/blogs/article/daxue/秋寄二首',
            '/blogs/article/daxue/苦夏',
            '/blogs/article/daxue/潞园离思',
            '/blogs/article/daxue/月夜思',
            // '/blogs/article/daxue/大学时期旧作遴选',
          ]
        },
        {
          title:'高中时期旧作',
          collapsable: true,
          children:[
            '/blogs/article/gaozhong/午后观雨',
            '/blogs/article/gaozhong/夜雨',
            '/blogs/article/gaozhong/夏雨',
            '/blogs/article/gaozhong/春雨',
            '/blogs/article/gaozhong/漫步',
            '/blogs/article/gaozhong/西风',
            '/blogs/article/gaozhong/满江红·贺校庆',
            '/blogs/article/gaozhong/记梦',
            '/blogs/article/gaozhong/念奴娇·潞园金秋',
            '/blogs/article/gaozhong/沁园春·潞河游',
            // '/blogs/article/gaozhong/高中时期旧作遴选',
          ]
        }
      ],
      '/blogs/note/': [
        {
          title:'随笔',
          collapsable: true,
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
      { text: '时间轴', icon: 'reco-date', link: '/timeLine/' },
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