import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopSpecValue, ShopSpecValueParam } from './model';

/**
 * 分页查询规格值
 */
export async function pageShopSpecValue(params: ShopSpecValueParam) {
  const res = await request.get<ApiResult<PageResult<ShopSpecValue>>>(
    '/shop/shop-spec-value/page',
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
export async function listShopSpecValue(params?: ShopSpecValueParam) {
  const res = await request.get<ApiResult<ShopSpecValue[]>>(
    '/shop/shop-spec-value',
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
export async function addShopSpecValue(data: ShopSpecValue) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/shop-spec-value',
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
export async function updateShopSpecValue(data: ShopSpecValue) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/shop-spec-value',
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
export async function removeShopSpecValue(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-spec-value/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格值
 */
export async function removeBatchShopSpecValue(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-spec-value/batch',
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
export async function getShopSpecValue(id: number) {
  const res = await request.get<ApiResult<ShopSpecValue>>(
    '/shop/shop-spec-value/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
