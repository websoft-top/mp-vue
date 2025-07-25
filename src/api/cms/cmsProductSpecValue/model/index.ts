import type { PageParam } from '@/api';

/**
 * 规格值
 */
export interface CmsProductSpecValue {
  // 规格值ID
  specValueId?: number;
  // 规格组ID
  specId?: number;
  // 规格值
  specValue?: string;
  // 备注
  comments?: string;
  // 排序号
  sortNumber?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 规格值搜索条件
 */
export interface CmsProductSpecValueParam extends PageParam {
  specValueId?: number;
  keywords?: string;
}
