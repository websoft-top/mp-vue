import type { PageParam } from '@/api';
import { Company } from '@/api/system/company/model';

/**
 * 租户
 */
export interface Tenant {
  // 租户id
  tenantId?: number;
  // 租户名称
  tenantName?: string;
  // 应用ID
  appId?: string;
  // 应用秘钥
  appSecret?: string;
  // logo
  logo?: string;
  // 企业名称
  companyName?: string;
  // 关联客户ID
  companyId?: string;
  // 备注
  comments?: string;
  // 创建时间
  createTime?: string;
  // 状态
  status?: number;
  //
  password?: string;
  // 企业信息
  company?: Company | null;
}

/**
 * 租户搜索条件
 */
export interface TenantParam extends PageParam {
  tenantName?: string;
  appId?: string;
  companyId?: number;
  companyName?: string;
  version?: string;
  province?: string;
  city?: string;
  tenantCode?: string;
}
