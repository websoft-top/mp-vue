import type { PageParam } from '@/api';

/**
 * 授权域名
 */
export interface Domain {
  // ID
  id?: number;
  // 域名
  domain?: string;
  // 主机记录
  hostName?: string;
  // 记录值
  hostValue?: string;
  // 状态
  status?: number;
  // 排序号
  sortNumber?: number;
  // 用户ID
  userId?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  comments?: string;
}

/**
 * 授权域名搜索条件
 */
export interface DomainParam extends PageParam {
  id?: number;
  keywords?: string;
}
