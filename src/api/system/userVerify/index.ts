import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserVerify, UserVerifyParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询实名认证
 */
export async function pageUserVerify(params: UserVerifyParam) {
  const res = await request.get<ApiResult<PageResult<UserVerify>>>(
    SERVER_API_URL + '/system/user-verify/page',
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
 * 查询实名认证列表
 */
export async function listUserVerify(params?: UserVerifyParam) {
  const res = await request.get<ApiResult<UserVerify[]>>(
    SERVER_API_URL + '/system/user-verify',
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
 * 添加实名认证
 */
export async function addUserVerify(data: UserVerify) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-verify',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改实名认证
 */
export async function updateUserVerify(data: UserVerify) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-verify',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除实名认证
 */
export async function removeUserVerify(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-verify/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除实名认证
 */
export async function removeBatchUserVerify(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-verify/batch',
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
 * 根据id查询实名认证
 */
export async function getUserVerify(id: number) {
  const res = await request.get<ApiResult<UserVerify>>(
    SERVER_API_URL + '/system/user-verify/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
