import type { PageParam } from '@/api';

/**
 * 规格
 */
export interface ShopSpec {
  // 规格ID
  specId?: number;
  // 规格名称
  specName?: string;
  // 规格值
  specValue?: string;
  // 商户ID
  merchantId?: number;
  // 创建用户
  userId?: number;
  // 更新者
  updater?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1待修,2异常已修，3异常未修
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
 * 规格搜索条件
 */
export interface ShopSpecParam extends PageParam {
  specId?: number;
  keywords?: string;
}
