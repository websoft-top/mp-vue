import request from '@/utils/request';
import type {ApiResult, PageResult} from '@/api';
import type {UserOauth, UserOauthParam} from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询第三方用户信息表
 */
export async function pageUserOauth(params: UserOauthParam) {
  const res = await request.get<ApiResult<PageResult<UserOauth>>>(
    SERVER_API_URL + '/system/user-oauth/page',
    {
      params
    }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询第三方用户信息表列表
 */
export async function listUserOauth(params?: UserOauthParam) {
  const res = await request.get<ApiResult<UserOauth[]>>(
    SERVER_API_URL + '/system/user-oauth',
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
 * 添加第三方用户信息表
 */
export async function addUserOauth(data: UserOauth) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-oauth',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改第三方用户信息表
 */
export async function updateUserOauth(data: UserOauth) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-oauth',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除第三方用户信息表
 */
export async function removeUserOauth(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-oauth/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除第三方用户信息表
 */
export async function removeBatchUserOauth(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-oauth/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询第三方用户信息表
 */
export async function getUserOauth(id: number) {
  const res = await request.get<ApiResult<UserOauth>>(
    SERVER_API_URL + '/system/user-oauth/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
