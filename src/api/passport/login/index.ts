import request from '@/utils/request';
import { setToken } from '@/utils/token-util';
import type { ApiResult } from '@/api';
import type {
  LoginParam,
  LoginResult,
  CaptchaResult,
  SmsCaptchaResult
} from './model';
import { User } from '@/api/system/user/model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 登录
 */
export async function login(data: LoginParam) {
  const res = await request.post<ApiResult<LoginResult>>(
    SERVER_API_URL + '/loginByUserId',
    data
  );
  if (res.data.code === 0) {
    setToken(res.data.data?.access_token, data.remember);
    if (res.data.data?.user) {
      const user = res.data.data?.user;
      localStorage.setItem('TenantId', String(user.tenantId));
      localStorage.setItem('UserId', String(user.userId));
    }

    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取验证码
 */
export async function getCaptcha() {
  const res = await request.get<ApiResult<CaptchaResult>>(
    SERVER_API_URL + '/captcha'
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function loginBySms(data: LoginParam) {
  const res = await request.post<ApiResult<LoginResult>>(
    SERVER_API_URL + '/loginBySms',
    data
  );
  if (res.data.code === 0) {
    setToken(res.data.data?.access_token, data.remember);
    if (res.data.data?.user) {
      const user = res.data.data?.user;
      localStorage.setItem('TenantId', String(user.tenantId));
      localStorage.setItem('Phone', String(user.phone));
      localStorage.setItem('UserId', String(user.userId));
      // localStorage.setItem('MerchantId', String(user.merchantId));
      // localStorage.setItem('MerchantName', String(user.merchantName));
    }

    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 发送短信验证码
 */
export async function sendSmsCaptcha(data: LoginParam) {
  const res = await request.post<ApiResult<SmsCaptchaResult>>(
    SERVER_API_URL + '/sendSmsCaptcha',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 登录
 */
export async function remoteLogin(data: LoginParam) {
  const res = await request.post<ApiResult<LoginResult>>(
    'https://open.gxwebsoft.com/api/login',
    data
  );
  if (res.data.code === 0) {
    setToken(res.data.data?.access_token, data.remember);
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取企业微信登录链接
 */
export async function getWxWorkQrConnect(data) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/wx-work',
    data
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function registerUser(data: User) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/register',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
