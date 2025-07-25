import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserBalanceLog, UserBalanceLogParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询余额明细
 */
export async function pageUserBalanceLog(params: UserBalanceLogParam) {
  const res = await request.get<ApiResult<PageResult<UserBalanceLog>>>(
    SERVER_API_URL + '/sys/user-balance-log/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询余额明细列表
 */
export async function listUserBalanceLog(params?: UserBalanceLogParam) {
  const res = await request.get<ApiResult<UserBalanceLog[]>>(
    SERVER_API_URL + '/sys/user-balance-log',
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
 * 根据id查询余额明细
 */
export async function getUserBalanceLog(id: number) {
  const res = await request.get<ApiResult<UserBalanceLog>>(
    SERVER_API_URL + '/sys/user-balance-log/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加余额明细
 */
export async function addUserBalanceLog(data: UserBalanceLog) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/user-balance-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改余额明细
 */
export async function updateUserBalanceLog(data: UserBalanceLog) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/user-balance-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除余额明细
 */
export async function removeUserBalanceLog(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/user-balance-log/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除余额明细
 */
export async function removeUserBalanceLogs(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/user-balance-log/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
