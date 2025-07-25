import type { PageParam } from '@/api';

/**
 * 分红角色
 */
export interface ShopCommissionRole {
  // 
  id?: number;
  // 
  title?: string;
  // 
  provinceId?: number;
  // 
  cityId?: number;
  // 
  regionId?: number;
  // 状态, 0正常, 1异常
  status?: number;
  // 备注
  comments?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 
  sortNumber?: number;
}

/**
 * 分红角色搜索条件
 */
export interface ShopCommissionRoleParam extends PageParam {
  id?: number;
  keywords?: string;
}
