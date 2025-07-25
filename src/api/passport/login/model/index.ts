import type { User } from '@/api/system/user/model';
/**
 * 登录参数
 */
export interface LoginParam {
  // 账号
  username?: string;
  // 密码
  password?: string;
  // 租户id
  tenantId?: number;
  // 是否记住密码
  remember?: boolean;
  // 手机号码
  phone?: string;
  // 短信验证码
  code?: string;
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  // token
  access_token?: string;
  // 用户信息
  user?: User;
}

/**
 * 图形验证码返回结果
 */
export interface CaptchaResult {
  // 图形验证码base64数据
  base64: string;
  // 验证码文本
  text: string;
}

/**
 * 短信验证码返回结果
 */
export interface SmsCaptchaResult {
  // 验证码文本
  text: string;
}
