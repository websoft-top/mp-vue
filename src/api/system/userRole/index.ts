import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { UserRole, UserRoleParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询用户列表
 */
export async function listUserRole(params?: UserRoleParam) {
  const res = await request.get<ApiResult<UserRole[]>>(
    SERVER_API_URL + '/system/user-role',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改用户角色
 */
export async function updateUserRole(data: UserRole) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-role',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加用户角色
 */
export async function addUserRole(data: UserRole) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-role',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
