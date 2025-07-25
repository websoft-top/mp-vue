import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmGpsLog, HjmGpsLogParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询黄家明_gps轨迹
 */
export async function pageHjmGpsLog(params: HjmGpsLogParam) {
  const res = await request.get<ApiResult<PageResult<HjmGpsLog>>>(
    MODULES_API_URL + '/hjm/hjm-gps-log/page',
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
 * 查询黄家明_gps轨迹列表
 */
export async function listHjmGpsLog(params?: HjmGpsLogParam) {
  const res = await request.get<ApiResult<HjmGpsLog[]>>(
    MODULES_API_URL + '/hjm/hjm-gps-log',
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
 * 添加黄家明_gps轨迹
 */
export async function addHjmGpsLog(data: HjmGpsLog) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-gps-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改黄家明_gps轨迹
 */
export async function updateHjmGpsLog(data: HjmGpsLog) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-gps-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除黄家明_gps轨迹
 */
export async function removeHjmGpsLog(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-gps-log/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除黄家明_gps轨迹
 */
export async function removeBatchHjmGpsLog(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-gps-log/batch',
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
 * 根据id查询黄家明_gps轨迹
 */
export async function getHjmGpsLog(id: number) {
  const res = await request.get<ApiResult<HjmGpsLog>>(
    MODULES_API_URL + '/hjm/hjm-gps-log/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
