import type { PageParam } from '@/api';

/**
 * 代码仓库
 */
export interface CompanyGit {
  // 自增ID
  id?: number;
  // 仓库名称
  title?: string;
  // 厂商 0私有仓库 1github 2gitee 3其他
  brand?: string;
  // 语言
  language?: string;
  // 企业ID
  companyId?: number;
  // 仓库地址
  domain?: string;
  // 账号
  account?: string;
  // 密码
  password?: string;
  // 仓库描述
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
 * 代码仓库搜索条件
 */
export interface CompanyGitParam extends PageParam {
  id?: number;
  keywords?: string;
}
