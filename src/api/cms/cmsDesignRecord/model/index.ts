import type { PageParam } from '@/api';

/**
 * 页面组件表
 */
export interface CmsDesignRecord {
  // ID
  id?: number;
  // 关联导航ID
  navigationId?: number;
  parentId?: number;
  pageId?: number;
  // 组件
  title?: string;
  // 组件标识
  dictCode?: string;
  // 组件样式
  styles?: string;
  // 卡片阴影显示时机
  shadow?: string;
  // 页面关键词
  keywords?: string;
  // 页面描述
  description?: string;
  // 页面路由地址
  path?: string;
  // 缩列图
  photo?: string;
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
  // 所属期次
  periodId?: number;
}

/**
 * 页面组件表搜索条件
 */
export interface CmsDesignRecordParam extends PageParam {
  id?: number;
  keywords?: string;
}
