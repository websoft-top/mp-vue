import type { PageParam } from '@/api';

/**
 * 系统设置
 */
export interface Setting {
  // 公共字段
  settingId?: number;
  settingKey?: string;
  content?: string;
  comments?: string;
  tenantName?: string;
  tenantId?: string | null;

  // 设置信息
  siteName?: string;
  fullName?: string;
  tenantCode?: string;
  domain?: string;
  remarks?: string;
  icp?: string;
  copyright?: string;
  keyword?: string;
  phone?: string;
  company?: string;
  address?: string;
  email?: string;
  support?: string;
  logo?: string;

  // 注册设置
  roleId?: number;
  openWxAuth?: number;
  openWxBindPhone?: number;
  openWxofficialAuth?: number;
  openWxofficialBindPhone?: number;
  tokenExpireTime?: number;

  // 短信设置
  type?: number;
  accessKeyId?: string;
  accessKeySecret?: string;
  sign?: string;
  isNoticeUser?: string;
  userTemplateId?: string;
  merchantTemplateId?: string;
  isNoticeMerchant?: string;
  merchantMobiles?: string;

  // 支付设置
  payMethod?: string;
  signMode?: string;
  alipayAppId?: string;
  signType?: string;
  appCertPublicKey?: string;
  alipayCertPublicKey?: string;
  alipayRootCert?: string;
  alipayPublicKey?: string;
  privateKey?: string;
  decryptKey?: string;
  balanceIsEnable?: boolean;
  wechatIsEnable?: boolean;
  alipayIsEnable?: boolean;
  wechatType?: string;
  mchId?: number;
  wechatAppId?: string;
  wechatApiKey?: string;
  apiclientCert?: string;
  apiclientKey?: string;
  spAppId?: string;
  spMchId?: string;
  spApiKey?: string;
  spSubAppId?: string;
  spSubMchId?: string;
  spApiclientCert?: string;
  spApiclientKey?: string;
  merchantSerialNumber?: string;

  // 微信公众号/小程序设置
  appId?: string;
  appSecret?: string;
  wxOfficialAccount?: string;
  originalId?: string;

  // 企业微信参数
  suiteId?: string;
  secret?: string;
  corpId?: string;
  token?: string;
  encodingAESKey?: string;

  // 打印设置
  isOpenPrinter?: string;
  printerType?: string;
  printerStatus?: string;
  printerUser?: string;
  printerUserKey?: string;
  printerCode?: string;
  printerKey?: string;
  printerTimes?: string;

  // chatGPT
  chatKey?: string;

  // 清除缓存
  clearCache?: string;

  // 主题
  theme?: string;

  // 云存储
  uploadMethod?: any;
  fileUrl?: string;
  bucketName?: string;
  bucketEndpoint?: string;
  bucketDomain?: string;
  // accessKeyId?: string; 引用上面的
  // accessKeySecret?: string; 引用上面的
}

/**
 * 系统设置搜索条件
 */
export interface SettingParam extends PageParam {
  settingId?: number;
  settingKey?: string;
}
