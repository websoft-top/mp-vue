import type { PageParam } from '@/api';

/**
 * 百色中学-年代
 */
export interface BszxEra {
  // ID
  id?: number;
  // 年代
  name?: string;
  // 租户id
  tenantId?: number;
}

/**
 * 百色中学-年代搜索条件
 */
export interface BszxEraParam extends PageParam {
  id?: number;
  keywords?: string;
}
