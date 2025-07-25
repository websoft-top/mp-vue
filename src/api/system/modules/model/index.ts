import type { PageParam } from '@/api';

/**
 * 插件
 */
export interface Modules {
  id?: number;
  modules?: string;
  modulesUrl?: string;
  sortNumber?: number;
  comments?: string;
  status?: number;
}

/**
 * 插件搜索条件
 */
export interface ModulesParam extends PageParam {
  id: number;
  modules: string;
  modulesUrl?: string;
}
