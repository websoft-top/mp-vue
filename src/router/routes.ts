import type { RouteRecordRaw } from 'vue-router';
import type { MenuItemType } from 'ele-admin-pro/es';
import { menuToRoutes, eachTreeData } from 'ele-admin-pro/es';
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH } from '@/config/setting';
import EleLayout from '@/layout/index.vue';
import RedirectLayout from '@/components/RedirectLayout';
const modules = import.meta.glob('/src/views/**/index.vue');

/**
 * 静态路由
 */
export const routes = [
  {
    path: '/login',
    component: () => import('@/views/passport/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/token-login',
    component: () => import('@/views/passport/loginToken/index.vue'),
    meta: { title: 'token登录' }
  },
  {
    path: '/register',
    component: () => import('@/views/passport/register/index.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/bszx/pay-cert/:id',
    component: () => import('@/views/bszx/bszxPayCert/index.vue'),
    meta: { title: '查看证书' }
  },
  // {
  //   path: '/forget',
  //   component: () => import('@/views/passport/forget/index.vue'),
  //   meta: { title: '忘记密码' }
  // },
  // {
  //   path: '/wx-work-login',
  //   component: () => import('@/views/passport/wx-work/index.vue'),
  //   meta: { title: '企业微信登录' }
  // },
  // {
  //   path: '/token-login',
  //   component: () => import('@/views/passport/token-login/index.vue'),
  //   meta: { title: '快捷登录' }
  // },
  // {
  //   path: '/cms/category/:id',
  //   component: () => import('@/views/cms/category/preview/index.vue'),
  //   meta: { title: '文章列表' }
  // },
  // {
  //   path: '/cms/article/:id',
  //   component: () => import('@/views/cms/article/preview/index.vue'),
  //   meta: { title: '文章详情' }
  // },
  // 404
  {
    path: '/:path(.*)*',
    component: () => import('@/views/result/fail/index.vue')
  }
];

/**
 * 动态路由
 * @param menus 菜单数据
 * @param homePath 主页地址
 */
export function getMenuRoutes(menus?: MenuItemType[], homePath?: string) {
  const routes: RouteRecordRaw[] = [
    // 用于刷新的路由
    {
      path: REDIRECT_PATH + '/:path(.*)',
      component: RedirectLayout,
      meta: { hideFooter: true }
    }
  ];
  // 路由铺平处理
  eachTreeData(menuToRoutes(menus, getComponent), (route) => {
    routes.push(Object.assign({}, route, { children: void 0 }));
  });
  return {
    path: LAYOUT_PATH,
    component: EleLayout,
    redirect: HOME_PATH ?? homePath,
    children: routes
  };
}

/**
 * 解析路由组件
 * @param component 组件名称
 */
function getComponent(component?: string) {
  if (component) {
    const module = modules[`/src/views/${component}.vue`];
    if (!module) {
      return modules[`/src/views/${component}/index.vue`];
    }
    return module;
  }
}
