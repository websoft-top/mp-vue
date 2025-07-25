import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmFence, HjmFenceParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询电子围栏
 */
export async function pageHjmFence(params: HjmFenceParam) {
  const res = await request.get<ApiResult<PageResult<HjmFence>>>(
    MODULES_API_URL + '/hjm/hjm-fence/page',
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
 * 查询电子围栏列表
 */
export async function listHjmFence(params?: HjmFenceParam) {
  const res = await request.get<ApiResult<HjmFence[]>>(
    MODULES_API_URL + '/hjm/hjm-fence',
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
 * 添加电子围栏
 */
export async function addHjmFence(data: HjmFence) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-fence',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改电子围栏
 */
export async function updateHjmFence(data: HjmFence) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-fence',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除电子围栏
 */
export async function removeHjmFence(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-fence/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除电子围栏
 */
export async function removeBatchHjmFence(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-fence/batch',
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
 * 根据id查询电子围栏
 */
export async function getHjmFence(id: number) {
  const res = await request.get<ApiResult<HjmFence>>(
    MODULES_API_URL + '/hjm/hjm-fence/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
