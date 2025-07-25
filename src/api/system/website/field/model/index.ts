import type { PageParam } from '@/api';

/**
 * 网站参数
 */
export interface WebsiteField {
  id?: number;
  name?: string;
  value?: string;
  comments?: string;
  userId?: number;
  defaultValue?: string;
  modifyRange?: string;
  type?: number;
  status?: any;
  sortNumber?: any;
  createTime?: string;
  deleted?: number;
}

// 约定的网站参数名称
export interface WebsiteParam {
  // 网站名称
  site_logo?: string;
  // 登录页面标题
  login_name?: string;
  // 登录页面的背景图片
  login_bg_img?: string;
}

// 约定的小程序参数名称
export interface MpWeixinParam {
  // 小程序LOGO
  site_logo?: string;
  // 我的页面顶部背景图片
  mp_user_top?: string;
}

/**
 * 网站参数搜索条件
 */
export interface WebsiteFieldParam extends PageParam {
  id?: number;
  userId?: number;
  name?: string;
  websiteId?: number;
}

export interface Config {
  siteName?: string;
  siteLogo?: string;
  domain?: string;
  icpNo?: string;
  copyright?: string;
  loginBgImg?: string;
  address?: string;
  tel?: string;
  kefu2?: string;
  kefu1?: string;
  email?: string;
  loginTitle?: string;
  sysLogo?: string;
}
