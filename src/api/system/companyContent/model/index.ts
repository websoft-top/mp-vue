import type { PageParam } from '@/api';

/**
 * 应用详情
 */
export interface CompanyContent {
  // 
  id?: number;
  // 企业ID
  companyId?: number;
  // 详细内容
  content?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 应用详情搜索条件
 */
export interface CompanyContentParam extends PageParam {
  id?: number;
  keywords?: string;
}
