/**
 * AccessKey
 */
export interface AccessKey {
  id?: number;
  phone?: string;
  accessKey?: string;
  accessSecret?: string;
  createTime?: string;
  tenantId?: number;
  code?: number;
}

/**
 * AccessKey搜索条件
 */
export interface AccessKeyParam {
  id?: number;
  accessKey?: string;
}
