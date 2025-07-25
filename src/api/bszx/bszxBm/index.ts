import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxBm, BszxBmParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询百色中学-报名记录
 */
export async function pageBszxBm(params: BszxBmParam) {
  const res = await request.get<ApiResult<PageResult<BszxBm>>>(
    MODULES_API_URL + '/bszx/bszx-bm/page',
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
 * 查询百色中学-报名记录列表
 */
export async function listBszxBm(params?: BszxBmParam) {
  const res = await request.get<ApiResult<BszxBm[]>>(
    MODULES_API_URL + '/bszx/bszx-bm',
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
 * 添加百色中学-报名记录
 */
export async function addBszxBm(data: BszxBm) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-bm',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-报名记录
 */
export async function updateBszxBm(data: BszxBm) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-bm',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-报名记录
 */
export async function removeBszxBm(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-bm/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-报名记录
 */
export async function removeBatchBszxBm(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-bm/batch',
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
 * 根据id查询百色中学-报名记录
 */
export async function getBszxBm(id: number) {
  const res = await request.get<ApiResult<BszxBm>>(
    MODULES_API_URL + '/bszx/bszx-bm/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
