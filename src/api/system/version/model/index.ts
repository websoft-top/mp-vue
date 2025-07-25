import type { PageParam } from '@/api';

export interface Version {
  id?: number;
  versionName?: string;
  versionCode?: string;
  vueDownloadUrl?: string;
  androidDownloadUrl?: string;
  iosDownloadUrl?: string;
  updateInfo?: any;
  isHard?: boolean;
  isHot?: boolean;
  status?: number;
  comments?: string;
  tenantId?: number;
  createTime?: string;
}

/**
 * 角色搜索条件
 */
export interface VersionParam extends PageParam {
  versionName?: string;
  versionCode?: string;
  comments?: string;
}
