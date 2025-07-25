import type { PageParam } from '@/api';

/**
 * 插件安装明细
 */
export interface CmsProductRecord {
  // ID
  id?: number;
  // 产品ID
  productId?: number;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0已安装, 1已卸载
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 插件安装明细搜索条件
 */
export interface CmsProductRecordParam extends PageParam {
  id?: number;
  keywords?: string;
}
