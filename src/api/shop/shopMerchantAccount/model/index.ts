import type { PageParam } from '@/api';

/**
 * 商户账号
 */
export interface ShopMerchantAccount {
  // ID
  id?: number;
  // 商户手机号
  phone?: string;
  // 真实姓名
  realName?: string;
  // 商户ID
  merchantId?: number;
  // 角色ID
  roleId?: number;
  // 角色名称
  roleName?: string;
  // 用户ID
  userId?: number;
  // 备注
  comments?: string;
  // 状态
  status?: number;
  // 排序号
  sortNumber?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 商户账号搜索条件
 */
export interface ShopMerchantAccountParam extends PageParam {
  id?: number;
  keywords?: string;
}
