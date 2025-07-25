import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProductSku, CmsProductSkuParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询商品sku列表
 */
export async function pageCmsProductSku(params: CmsProductSkuParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductSku>>>(
    MODULES_API_URL + '/cms/cms-product-sku/page',
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
 * 查询商品sku列表列表
 */
export async function listCmsProductSku(params?: CmsProductSkuParam) {
  const res = await request.get<ApiResult<CmsProductSku[]>>(
    MODULES_API_URL + '/cms/cms-product-sku',
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
 * 添加商品sku列表
 */
export async function addCmsProductSku(data: CmsProductSku) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-sku',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品sku列表
 */
export async function updateCmsProductSku(data: CmsProductSku) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-sku',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品sku列表
 */
export async function removeCmsProductSku(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-sku/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品sku列表
 */
export async function removeBatchCmsProductSku(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-sku/batch',
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
 * 根据id查询商品sku列表
 */
export async function getCmsProductSku(id: number) {
  const res = await request.get<ApiResult<CmsProductSku>>(
    MODULES_API_URL + '/cms/cms-product-sku/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
