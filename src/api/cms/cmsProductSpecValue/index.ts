import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProductSpecValue, CmsProductSpecValueParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询规格值
 */
export async function pageCmsProductSpecValue(params: CmsProductSpecValueParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductSpecValue>>>(
    MODULES_API_URL + '/cms/cms-product-spec-value/page',
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
export async function listCmsProductSpecValue(params?: CmsProductSpecValueParam) {
  const res = await request.get<ApiResult<CmsProductSpecValue[]>>(
    MODULES_API_URL + '/cms/cms-product-spec-value',
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
export async function addCmsProductSpecValue(data: CmsProductSpecValue) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec-value',
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
export async function updateCmsProductSpecValue(data: CmsProductSpecValue) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec-value',
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
export async function removeCmsProductSpecValue(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec-value/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格值
 */
export async function removeBatchCmsProductSpecValue(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec-value/batch',
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
export async function getCmsProductSpecValue(id: number) {
  const res = await request.get<ApiResult<CmsProductSpecValue>>(
    MODULES_API_URL + '/cms/cms-product-spec-value/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
