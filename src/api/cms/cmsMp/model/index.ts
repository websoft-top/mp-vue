import type { PageParam } from '@/api';

/**
 * 小程序信息
 */
export interface CmsMp {
  // ID
  mpId?: number;
  // 是否主账号
  type?: number;
  // 小程序ID
  appId?: string;
  // 小程序密钥
  appSecret?: string;
  // 小程序名称
  mpName?: string;
  // 小程序简称
  shortName?: string;
  // 头像
  avatar?: string;
  // 小程序码
  mpQrcode?: string;
  // 微信认证
  authentication?: number;
  // 主体信息
  companyName?: string;
  // 小程序备案
  icpNo?: string;
  // 登录邮箱
  email?: string;
  // 登录密码
  password?: string;
  // 原始ID
  ghId?: string;
  // 入口页面
  mainPath?: string;
  // 过期时间
  expirationTime?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 介绍
  comments?: string;
  // 用户ID
  userId?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 小程序信息搜索条件
 */
export interface CmsMpParam extends PageParam {
  mpId?: number;
  keywords?: string;
}
