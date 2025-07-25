import type { PageParam } from '@/api';

/**
 * 网站设置
 */
export interface CmsWebsiteSetting {
  // 自增ID
  id?: number;
  // 关联网站ID
  websiteId?: number;
  // 是否官方插件
  official?: string;
  // 是否展示在插件市场
  market?: string;
  // 是否允许被搜索
  search?: string;
  // 是否共享
  share?: string;
  // 文章是否需要审核
  articleReview?: boolean;
  // 是否插件 0应用1 插件
  plugin?: string;
  // 编辑器类型 1 md-editor-v3, 2 tinymce-editor
  editor?: number;
  // 显示站内搜索
  searchBtn?: string;
  // 显示登录注册功能
  loginBtn?: string;
  // 显示悬浮客服工具
  floatTool?: boolean;
  // 显示版权信息
  showCopyright?: boolean;
  // 显示版权链接
  copyrightLink?: string;
  // 导航栏最多显示数量
  maxMenuNum?: string;
  // 排序号
  sortNumber?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 网站设置搜索条件
 */
export interface CmsWebsiteSettingParam extends PageParam {
  id?: number;
  keywords?: string;
}
