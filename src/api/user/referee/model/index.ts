import type { PageParam } from '@/api';

/**
 * 推荐关系
 */
export interface UserReferee {
  id?: number;
  dealerId?: number;
  userId?: number;
  level?: number;
  comments?: string;
  createTime?: string;
  tenantId?: number;
}

/**
 * 搜索条件
 */
export interface UserRefereeParam extends PageParam {
  id?: number;
  dealerId?: number;
  userId?: number;
  level?: number;
}
