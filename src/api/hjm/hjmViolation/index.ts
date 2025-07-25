import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmViolation, HjmViolationParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询黄家明_违章记录
 */
export async function pageHjmViolation(params: HjmViolationParam) {
  const res = await request.get<ApiResult<PageResult<HjmViolation>>>(
    MODULES_API_URL + '/hjm/hjm-violation/page',
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
 * 查询黄家明_违章记录列表
 */
export async function listHjmViolation(params?: HjmViolationParam) {
  const res = await request.get<ApiResult<HjmViolation[]>>(
    MODULES_API_URL + '/hjm/hjm-violation',
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
 * 添加黄家明_违章记录
 */
export async function addHjmViolation(data: HjmViolation) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-violation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改黄家明_违章记录
 */
export async function updateHjmViolation(data: HjmViolation) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-violation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除黄家明_违章记录
 */
export async function removeHjmViolation(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-violation/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除黄家明_违章记录
 */
export async function removeBatchHjmViolation(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-violation/batch',
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
 * 根据id查询黄家明_违章记录
 */
export async function getHjmViolation(id: number) {
  const res = await request.get<ApiResult<HjmViolation>>(
    MODULES_API_URL + '/hjm/hjm-violation/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
