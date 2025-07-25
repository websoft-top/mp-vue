import type { PageParam } from '@/api';

/**
 * 用户
 */
export interface UserRole {
  id?: number;
  // 用户id
  userId?: number;
  // 角色ID
  roleId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  // 角色名称
  roleName?: string;
  // 租户ID
  tenantId?: number;
}

/**
 * 用户搜索条件
 */
export interface UserRoleParam extends PageParam {
  keywords?: any;
  roleId?: number;
  userId?: number;
  userIds?: any;
}
