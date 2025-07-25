export default [
  {
    path: '/assets/server',
    component: '/assets/server',
    meta: { title: '服务器管理', icon: 'AuditOutlined' }
  },
  {
    path: '/project',
    component: '/project',
    meta: { title: '项目管理', icon: 'CodeOutlined' }
  },
  {
    path: '/customer',
    component: '/customer',
    meta: { title: '客户管理', icon: 'CrownOutlined' }
  },
  {
    path: '/content/article',
    component: '/content/article',
    meta: { title: '文章管理', icon: 'FileSearchOutlined' }
  },
  {
    path: '/content/docs/:id',
    component: '/content/docs',
    meta: { title: '文档管理', icon: 'ReadOutlined' }
  },
  {
    path: '/task/index',
    component: '/task/index',
    meta: { title: '任务管理', icon: 'HistoryOutlined' }
  },
  {
    path: '/appstore',
    component: '/appstore',
    meta: { title: '应用管理', icon: 'AppstoreOutlined' }
  },
  {
    path: '/system',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'SettingOutlined' },
    children: [
      {
        path: '/system/user',
        component: '/system/user'
      },
      {
        path: '/system/role',
        component: '/system/role',
        meta: { title: '角色管理', icon: 'IdcardOutlined' }
      },
      {
        path: '/system/menu',
        component: '/system/menu',
        meta: { title: '菜单管理', icon: 'AppstoreOutlined' }
      },
      {
        path: '/system/dictionary',
        component: '/system/dictionary',
        meta: { title: '字典管理', icon: 'ProfileOutlined' }
      },
      {
        path: '/system/organization',
        component: '/system/organization'
      },
      {
        path: '/system/file',
        component: '/system/file',
        meta: { title: '文件管理', icon: 'FolderOutlined' }
      },
      {
        path: '/system/login-record',
        component: '/system/login-record',
        meta: { title: '登录日志', icon: 'CalendarOutlined' }
      },
      {
        path: '/system/operation-record',
        component: '/system/operation-record',
        meta: { title: '操作日志', icon: 'FileSearchOutlined' }
      },
      {
        path: '/system/tenant',
        component: '/system/tenant',
        meta: { title: '租户管理', icon: 'TeamOutlined' }
      },
      {
        path: '/system/setting',
        component: '/system/setting',
        meta: { title: '系统设置', icon: 'SettingOutlined' }
      }
    ]
  },
  // 账号中心
  {
    path: '/user',
    hide: true,
    redirect: '/user/profile',
    meta: { title: '账号中心' },
    children: [
      {
        path: '/user/profile',
        component: '/user/profile',
        meta: { title: '账号中心', hide: false }
      },
      {
        path: '/user/message',
        component: '/user/message',
        meta: { title: '我的消息', hide: false }
      }
    ]
  },
  {
    path: '/register',
    hide: true,
    component: '/passport/register/index.vue',
    meta: { title: '免费注册' }
  }
];
