import type { PageParam } from '@/api';

/**
 * 插件
 */
export interface Environment {
  id?: number;
  environmentName?: string;
  environmentCode?: string;
  brand?: string;
  serverIp?: string;
  modulesUrl?: string;
  modulesApi?: string;
  sortNumber?: number;
  comments?: string;
  status?: number;
}

/**
 * 插件搜索条件
 */
export interface EnvironmentParam extends PageParam {
  id: number;
  environmentName: string;
}
