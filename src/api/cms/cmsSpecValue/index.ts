import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsSpecValue, CmsSpecValueParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询规格值
 */
export async function pageCmsSpecValue(params: CmsSpecValueParam) {
  const res = await request.get<ApiResult<PageResult<CmsSpecValue>>>(
    MODULES_API_URL + '/cms/cms-spec-value/page',
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
 * 查询规格值列表
 */
export async function listCmsSpecValue(params?: CmsSpecValueParam) {
  const res = await request.get<ApiResult<CmsSpecValue[]>>(
    MODULES_API_URL + '/cms/cms-spec-value',
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
 * 添加规格值
 */
export async function addCmsSpecValue(data: CmsSpecValue) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec-value',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改规格值
 */
export async function updateCmsSpecValue(data: CmsSpecValue) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec-value',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除规格值
 */
export async function removeCmsSpecValue(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec-value/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格值
 */
export async function removeBatchCmsSpecValue(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec-value/batch',
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
 * 根据id查询规格值
 */
export async function getCmsSpecValue(id: number) {
  const res = await request.get<ApiResult<CmsSpecValue>>(
    MODULES_API_URL + '/cms/cms-spec-value/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
