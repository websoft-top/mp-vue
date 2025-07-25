import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmChoices, HjmChoicesParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询选择题选项
 */
export async function pageHjmChoices(params: HjmChoicesParam) {
  const res = await request.get<ApiResult<PageResult<HjmChoices>>>(
    MODULES_API_URL + '/hjm/hjm-choices/page',
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
 * 查询选择题选项列表
 */
export async function listHjmChoices(params?: HjmChoicesParam) {
  const res = await request.get<ApiResult<HjmChoices[]>>(
    MODULES_API_URL + '/hjm/hjm-choices',
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
 * 添加选择题选项
 */
export async function addHjmChoices(data: HjmChoices) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-choices',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改选择题选项
 */
export async function updateHjmChoices(data: HjmChoices) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-choices',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除选择题选项
 */
export async function removeHjmChoices(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-choices/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除选择题选项
 */
export async function removeBatchHjmChoices(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-choices/batch',
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
 * 根据id查询选择题选项
 */
export async function getHjmChoices(id: number) {
  const res = await request.get<ApiResult<HjmChoices>>(
    MODULES_API_URL + '/hjm/hjm-choices/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
