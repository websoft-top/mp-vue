import type { PageParam } from '@/api';

/**
 * 支付方式
 */
export interface Payment {
  // ID
  id?: number;
  // 支付方式
  name?: string;
  // 支付类型
  type?: number;
  // 标识
  code?: string;
  // 支付图标
  image?: string;
  // 微信商户号类型 1普通商户2子商户
  wechatType?: number;
  // 应用ID
  appId?: string;
  // 商户号
  mchId?: string;
  // 设置APIv3密钥
  apiKey?: string;
  // 证书文件 (CERT)
  apiclientCert?: string;
  // 证书文件 (KEY)
  apiclientKey?: string;
  // 商户证书序列号
  merchantSerialNumber?: string;
  // 支付宝公钥
  pubKey?: string;
  // 支付宝公钥ID
  pubKeyId?: string;
  // 支付结果通过
  notifyUrl?: string;
  // 备注
  comments?: string;
  // 文章排序(数字越小越靠前)
  sortNumber?: number;
  // 状态, 0启用, 1禁用
  status?: boolean;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 支付方式搜索条件
 */
export interface PaymentParam extends PageParam {
  id?: number;
  keywords?: string;
}
