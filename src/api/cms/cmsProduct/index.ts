import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProduct, CmsProductParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询产品
 */
export async function pageCmsProduct(params: CmsProductParam) {
  const res = await request.get<ApiResult<PageResult<CmsProduct>>>(
    MODULES_API_URL + '/cms/cms-product/page',
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
 * 查询产品列表
 */
export async function listCmsProduct(params?: CmsProductParam) {
  const res = await request.get<ApiResult<CmsProduct[]>>(
    MODULES_API_URL + '/cms/cms-product',
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
 * 添加产品
 */
export async function addCmsProduct(data: CmsProduct) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改产品
 */
export async function updateCmsProduct(data: CmsProduct) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除产品
 */
export async function removeCmsProduct(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除产品
 */
export async function removeBatchCmsProduct(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product/batch',
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
 * 根据id查询产品
 */
export async function getCmsProduct(id: number) {
  const res = await request.get<ApiResult<CmsProduct>>(
    MODULES_API_URL + '/cms/cms-product/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function getCount(params: CmsProductParam) {
  const res = await request.get(MODULES_API_URL + '/cms/cms-product/data', {
    params
  });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
