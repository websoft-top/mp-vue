import request from '@/utils/request';
import type {ApiResult, PageResult} from '@/api';
import type {CmsProductUrl, CmsProductUrlParam} from './model';
import {MODULES_API_URL} from '@/config/setting';

/**
 * 分页查询域名
 */
export async function pageCmsProductUrl(params: CmsProductUrlParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductUrl>>>(
    MODULES_API_URL + '/cms/cms-product-url/page',
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
 * 查询域名列表
 */
export async function listCmsProductUrl(params?: CmsProductUrlParam) {
  const res = await request.get<ApiResult<CmsProductUrl[]>>(
    MODULES_API_URL + '/cms/cms-product-url',
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
 * 添加域名
 */
export async function addCmsProductUrl(data: CmsProductUrl) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-url',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改域名
 */
export async function updateCmsProductUrl(data: CmsProductUrl) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-url',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除域名
 */
export async function removeCmsProductUrl(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-url/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除域名
 */
export async function removeBatchCmsProductUrl(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-url/batch',
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
 * 根据id查询域名
 */
export async function getCmsProductUrl(id: number) {
  const res = await request.get<ApiResult<CmsProductUrl>>(
    MODULES_API_URL + '/cms/cms-product-url/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
