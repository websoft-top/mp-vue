import type { PageParam } from '@/api';

/**
 * 常用链接
 */
export interface CmsLink {
  // 自增ID
  id?: number;
  // 链接名称
  name?: string;
  // 图标
  icon?: string;
  // 链接地址
  url?: string;
  // 链接分类
  categoryId?: number;
  // 应用ID
  appId?: number;
  // 用户ID
  userId?: number;
  // 语言
  lang?: string;
  // 是否推荐
  recommend?: number;
  // 备注
  comments?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 状态, 0正常, 1待确认
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 常用链接搜索条件
 */
export interface CmsLinkParam extends PageParam {
  id?: number;
  keywords?: string;
}
