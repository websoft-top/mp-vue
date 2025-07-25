import type { PageParam } from '@/api';

/**
 * 我的收藏
 */
export interface UserCollection {
  // 主键ID
  id?: number;
  // 租户ID
  tid?: number;
  // 用户ID
  userId?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
}

/**
 * 我的收藏搜索条件
 */
export interface UserCollectionParam extends PageParam {
  id?: number;
  keywords?: string;
}
