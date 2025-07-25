import type { PageParam } from '@/api';

/**
 * 应用域名
 */
export interface Url {
  // 自增ID
  id?: number;
  // 域名类型
  type?: string;
  // 域名
  domain?: string;
  // 账号
  account?: string;
  // 密码
  password?: string;
  // 二维码
  qrcode?: string;
  // 备注
  comments?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 状态, 0正常, 1待确认
  status?: number;
  // 创建时间
  createTime?: string;
  // 租户id
  tenantId?: number;
}

/**
 * 应用域名搜索条件
 */
export interface UrlParam extends PageParam {
  id?: number;
  keywords?: string;
}
