import type { PageParam } from '@/api';

/**
 * 缓存管理
 */
export interface Cache {
  key?: string;
  content?: string;
  uploadMethod?: any;
  expireTime?: number; // 过期时间(秒)
}

/**
 * 搜索条件
 */
export interface CacheParam extends PageParam {
  key?: string;
}
