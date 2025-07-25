import type { PageParam } from '@/api';

/**
 * 网站域名记录表
 */
export interface CmsDomain {
  // ID
  id?: number;
  // 类型 0赠送域名 1绑定域名 
  type?: number;
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
  // 网站ID
  websiteId?: number;
  // 租户ID
  appId?: number;
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
}

/**
 * 网站域名记录表搜索条件
 */
export interface CmsDomainParam extends PageParam {
  id?: number;
  keywords?: string;
}
