import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { User } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 修改当前登录用户信息
 */
export async function authUser(data: User) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/auth/user',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
