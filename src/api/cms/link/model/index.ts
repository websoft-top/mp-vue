import type { PageParam } from '@/api';

/**
 * 链接
 */
export interface Link {
  id?: number;
  name?: string;
  icon?: string;
  url?: string;
  linkType?: string;
  appId?: number;
  categoryId?: number;
  userId?: number;
  comments?: string;
  recommend?: number;
  sortNumber?: number;
  deleted?: number;
  status?: number;
  createTime?: number;
}

/**
 * 链接搜索条件
 */
export interface LinkParam extends PageParam {
  id?: number;
  linkType?: string;
  categoryId?: number;
  name?: string;
}
