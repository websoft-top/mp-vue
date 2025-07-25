import type { PageParam } from '@/api';

/**
 * 用户
 */
export interface Count {
  balance?: string;
}

/**
 * 用户搜索条件
 */
export interface UserParam extends PageParam {
  organizationId?: number;
}
