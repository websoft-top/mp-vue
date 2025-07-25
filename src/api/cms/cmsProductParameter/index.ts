import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProductParameter, CmsProductParameterParam } from './model';
import {MODULES_API_URL} from '@/config/setting';

/**
 * 分页查询产品参数
 */
export async function pageCmsProductParameter(params: CmsProductParameterParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductParameter>>>(
    MODULES_API_URL + '/cms/cms-product-parameter/page',
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
 * 查询产品参数列表
 */
export async function listCmsProductParameter(params?: CmsProductParameterParam) {
  const res = await request.get<ApiResult<CmsProductParameter[]>>(
    MODULES_API_URL + '/cms/cms-product-parameter',
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
 * 添加产品参数
 */
export async function addCmsProductParameter(data: CmsProductParameter) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改产品参数
 */
export async function updateCmsProductParameter(data: CmsProductParameter) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除产品参数
 */
export async function removeCmsProductParameter(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-parameter/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除产品参数
 */
export async function removeBatchCmsProductParameter(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-parameter/batch',
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
 * 根据id查询产品参数
 */
export async function getCmsProductParameter(id: number) {
  const res = await request.get<ApiResult<CmsProductParameter>>(
    MODULES_API_URL + '/cms/cms-product-parameter/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
