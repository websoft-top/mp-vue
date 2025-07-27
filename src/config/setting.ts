// 租户ID
export const TENANT_ID = import.meta.env.VITE_TENANT_ID || 10258;
// 模板ID
export const TEMPLATE_ID = 10258;
// appSecret
export const APP_SECRET = import.meta.env.VITE_APP_SECRET || '';
// 开发商官方网站
export const domain = import.meta.env.VITE_DOMAIN || 'https://your-domain.com';
// 模块节点
export const MODULES_API_URL = import.meta.env.VITE_API_URL;
// 主节点
export const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL || MODULES_API_URL;
// 文件服务器地址
export const FILE_SERVER = import.meta.env.VITE_FILE_SERVER || 'https://your-file-server.com';

/**
 * 以下配置一般不需要修改
 */
// 接口地址
export const API_BASE_URL: string = import.meta.env.VITE_API_URL;
export const PROJECT_NAME: string = import.meta.env.VITE_APP_NAME;
// 不显示侧栏的路由
export const HIDE_SIDEBARS: string[] = ['/home'];
// 不显示页脚的路由
export const HIDE_FOOTERS: string[] = [
  '/system/dictionary',
  '/system/organization',
  '/form/advanced'
];
// 页签同路由不同参数可重复打开的路由
export const REPEATABLE_TABS: string[] = [];
// 不需要登录的路由
export const WHITE_LIST: string[] = [
  '/login',
  '/register',
  '/forget',
  '/wx-work-login',
  '/token-login',
  '/home',
  '/bszx/pay-cert/:id'
];
// 开启 KeepAlive 后仍然不需要缓存的路由地址
export const KEEP_ALIVE_EXCLUDES: string[] = [];
// 直接指定菜单数据
// export const USER_MENUS = menu;
export const USER_MENUS: Array<any> | undefined = undefined;
// 首页名称, 为空则取第一个菜单的名称
export const HOME_TITLE: string | undefined = undefined;
// 首页路径, 为空则取第一个菜单的地址
export const HOME_PATH: string | undefined = undefined;
// 外层布局的路由地址
export const LAYOUT_PATH = '/';
// 刷新路由的路由地址
export const REDIRECT_PATH = '/redirect';
// 开启页签栏是否缓存组件
//export const TAB_KEEP_ALIVE = !import.meta.env.DEV;
export const TAB_KEEP_ALIVE = true;
// token 传递的 header 名称
export const TOKEN_HEADER_NAME = 'Authorization';
// token 存储的名称
export const TOKEN_STORE_NAME = 'access_token';
// 主题配置存储的名称
export const THEME_STORE_NAME = 'theme';
// i18n 缓存的名称
export const I18N_CACHE_NAME = 'i18n-lang';
// 是否开启国际化功能
export const I18N_ENABLE = true;
// 高德地图 key , 自带的只能用于测试, 正式项目请自行到高德地图官网申请 key
export const MAP_KEY = import.meta.env.VITE_MAP_KEY || '';
// 高德地图 安全密钥
export const MAP_CODE = import.meta.env.VITE_MAP_CODE || '';
// WebSoftAdmin 授权码, 自带的只能用于演示, 正式项目请更换为自己的授权码
export const LICENSE_CODE = import.meta.env.VITE_LICENSE_CODE;
// 缩略图前缀
export const FILE_THUMBNAIL = FILE_SERVER + '/thumbnail';
// 文件下载前缀
export const FILE_DOWNLOAD = FILE_SERVER + '/download';
