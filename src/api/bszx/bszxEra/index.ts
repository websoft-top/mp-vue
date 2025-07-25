import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxEra, BszxEraParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询百色中学-年代
 */
export async function pageBszxEra(params: BszxEraParam) {
  const res = await request.get<ApiResult<PageResult<BszxEra>>>(
    MODULES_API_URL + '/bszx/bszx-era/page',
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
 * 查询百色中学-年代列表
 */
export async function listBszxEra(params?: BszxEraParam) {
  const res = await request.get<ApiResult<BszxEra[]>>(
    MODULES_API_URL + '/bszx/bszx-era',
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
 * 添加百色中学-年代
 */
export async function addBszxEra(data: BszxEra) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-era',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-年代
 */
export async function updateBszxEra(data: BszxEra) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-era',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-年代
 */
export async function removeBszxEra(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-era/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-年代
 */
export async function removeBatchBszxEra(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-era/batch',
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
 * 根据id查询百色中学-年代
 */
export async function getBszxEra(id: number) {
  const res = await request.get<ApiResult<BszxEra>>(
    MODULES_API_URL + '/bszx/bszx-era/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
