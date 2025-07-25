import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmBxLog, HjmBxLogParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询黄家明_报险记录
 */
export async function pageHjmBxLog(params: HjmBxLogParam) {
  const res = await request.get<ApiResult<PageResult<HjmBxLog>>>(
    MODULES_API_URL + '/hjm/hjm-bx-log/page',
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
 * 查询黄家明_报险记录列表
 */
export async function listHjmBxLog(params?: HjmBxLogParam) {
  const res = await request.get<ApiResult<HjmBxLog[]>>(
    MODULES_API_URL + '/hjm/hjm-bx-log',
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
 * 添加黄家明_报险记录
 */
export async function addHjmBxLog(data: HjmBxLog) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-bx-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改黄家明_报险记录
 */
export async function updateHjmBxLog(data: HjmBxLog) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-bx-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除黄家明_报险记录
 */
export async function removeHjmBxLog(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-bx-log/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除黄家明_报险记录
 */
export async function removeBatchHjmBxLog(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-bx-log/batch',
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
 * 根据id查询黄家明_报险记录
 */
export async function getHjmBxLog(id: number) {
  const res = await request.get<ApiResult<HjmBxLog>>(
    MODULES_API_URL + '/hjm/hjm-bx-log/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
