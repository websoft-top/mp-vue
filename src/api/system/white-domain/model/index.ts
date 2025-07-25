import type { PageParam } from '@/api';

/**
 * 服务器白名单
 */
export interface WhiteDomain {
  // 自增ID
  id?: number;
  // 域名
  domain?: string;
  // 排序
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态
  status?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 服务器白名单搜索条件
 */
export interface WhiteDomainParam extends PageParam {
  id?: number;
  domain?: string;
}
