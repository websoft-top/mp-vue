import type { PageParam } from '@/api';

/**
 * 商品绑定角色的分润金额
 */
export interface ShopGoodsRoleCommission {
  //
  id?: number;
  //
  roleId?: number;
  //
  goodsId?: number;
  //
  sku?: string;
  //
  amount?: string;
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
 * 商品绑定角色的分润金额搜索条件
 */
export interface ShopGoodsRoleCommissionParam extends PageParam {
  id?: number;
  keywords?: string;
}
