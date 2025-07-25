import type { PageParam } from '@/api';

/**
 * 门店销售统计表
 */
export interface ShopMerchantCount {
  // ID
  id?: number;
  // 店铺名称
  name?: string;
  // 店铺说明
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
 * 门店销售统计表搜索条件
 */
export interface ShopMerchantCountParam extends PageParam {
  id?: number;
  keywords?: string;
}
