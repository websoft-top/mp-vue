import type { PageParam } from '@/api';

/**
 * 商户类型
 */
export interface ShopMerchantType {
  // ID
  id?: number;
  // 店铺类型
  name?: string;
  // 店铺入驻条件
  comments?: string;
  // 状态
  status?: number;
  // 排序号
  sortNumber?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  value?: string;
}

/**
 * 商户类型搜索条件
 */
export interface ShopMerchantTypeParam extends PageParam {
  id?: number;
  keywords?: string;
}
