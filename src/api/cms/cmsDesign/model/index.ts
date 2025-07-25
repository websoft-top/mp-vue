import type { PageParam } from '@/api';

/**
 * 页面管理记录表
 */
export interface CmsDesign {
  pageId?: number;
  name?: string;
  keywords?: string;
  description?: string;
  path?: string;
  component?: string;
  photo?: string;
  content?: string;
  // 类型
  type?: string;
  categoryId?: number;
  // 宽
  width?: string;
  // 高
  height?: string;
  // 页面样式
  style?: string;
  // 附件
  images?: string;
  // 用户ID
  userId?: number;
  // 设为首页
  home?: number;
  // 排序
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态
  status?: number;
  // 创建时间
  createTime?: string;
  // 更新时间
  updateTime?: string;
  // 页面布局
  layout?: string;
  backgroundColor?: string;
  // 关联网站导航ID
  navigationId?: number;
  showLayout?: boolean;
  btn?: any[];
  showBanner?: boolean;
  showButton?: boolean;
  // 是否同步翻译其他语言版本
  translation?: boolean;
  buyUrl?: string;
  demoUrl?: string;
  account?: string;
  docUrl?: string;
}

/**
 * 页面管理记录表搜索条件
 */
export interface CmsDesignParam extends PageParam {
  pageId?: number;
  keywords?: string;
}
