import type { PageParam } from '@/api';

export interface Group {
  groupId?: number;
  name?: string;
  status?: number;
  comments?: any;
  sortNumber?: number;
  deleted?: number;
  tenantId?: number;
  createTime?: string;
  updateTime?: string;
}

/**
 * 搜索条件
 */
export interface GroupParam extends PageParam {
  groupId?: number;
  name?: string;
  status?: number;
  keywords?: string;
}
