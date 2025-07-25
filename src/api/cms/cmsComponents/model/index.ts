import type { PageParam } from '@/api';

/**
 * 组件
 */
export interface CmsComponents {
  // ID
  id?: number;
  // 组件标题
  title?: string;
  // 关联导航ID
  navigationId?: number;
  // 组件类型
  type?: string;
  // 页面关键词
  keywords?: string;
  // 页面描述
  description?: string;
  // 组件路径
  path?: string;
  // 组件图标
  icon?: string;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 组件搜索条件
 */
export interface CmsComponentsParam extends PageParam {
  id?: number;
  keywords?: string;
}
