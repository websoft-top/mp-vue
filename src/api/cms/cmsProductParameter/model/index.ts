import type { PageParam } from '@/api';

/**
 * 产品参数
 */
export interface CmsProductParameter {
  // 自增ID
  id?: number;
  // 产品ID
  productId?: number;
  // 参数名称
  name?: string;
  // 参数内容
  value?: string;
  // 备注
  comments?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 状态, 0正常, 1待确认
  status?: number;
  // 创建时间
  createTime?: string;
  // 租户id
  tenantId?: number;
}

/**
 * 产品参数搜索条件
 */
export interface CmsProductParameterParam extends PageParam {
  id?: number;
  keywords?: string;
}
