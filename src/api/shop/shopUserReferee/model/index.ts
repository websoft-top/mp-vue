import type { PageParam } from '@/api';

/**
 * 用户推荐关系表
 */
export interface ShopUserReferee {
  // 主键ID
  id?: number;
  // 推荐人ID
  dealerId?: number;
  // 用户id(被推荐人)
  userId?: number;
  // 推荐关系层级(1,2,3)
  level?: number;
  // 备注
  comments?: string;
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
 * 用户推荐关系表搜索条件
 */
export interface ShopUserRefereeParam extends PageParam {
  id?: number;
  keywords?: string;
}
