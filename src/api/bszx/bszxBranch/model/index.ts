import type { PageParam } from '@/api';

/**
 * 百色中学-分部
 */
export interface BszxBranch {
  // ID
  id?: number;
  // 分部名称 
  name?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 租户id
  tenantId?: number;
}

/**
 * 百色中学-分部搜索条件
 */
export interface BszxBranchParam extends PageParam {
  id?: number;
  keywords?: string;
}
