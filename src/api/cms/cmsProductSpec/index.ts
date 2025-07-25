import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProductSpec, CmsProductSpecParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询规格
 */
export async function pageCmsProductSpec(params: CmsProductSpecParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductSpec>>>(
    MODULES_API_URL + '/cms/cms-product-spec/page',
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
 * 查询规格列表
 */
export async function listCmsProductSpec(params?: CmsProductSpecParam) {
  const res = await request.get<ApiResult<CmsProductSpec[]>>(
    MODULES_API_URL + '/cms/cms-product-spec',
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
 * 添加规格
 */
export async function addCmsProductSpec(data: CmsProductSpec) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改规格
 */
export async function updateCmsProductSpec(data: CmsProductSpec) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除规格
 */
export async function removeCmsProductSpec(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格
 */
export async function removeBatchCmsProductSpec(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-spec/batch',
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
 * 根据id查询规格
 */
export async function getCmsProductSpec(id: number) {
  const res = await request.get<ApiResult<CmsProductSpec>>(
    MODULES_API_URL + '/cms/cms-product-spec/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
