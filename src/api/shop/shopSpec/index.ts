import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import { MODULES_API_URL } from '@/config/setting';
import { ShopSpec, ShopSpecParam } from '@/api/shop/shopSpec/model';

/**
 * 分页查询规格
 */
export async function pageShopSpec(params: ShopSpecParam) {
  const res = await request.get<ApiResult<PageResult<ShopSpec>>>(
    MODULES_API_URL + '/shop/shop-spec/page',
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
export async function listShopSpec(params?: ShopSpecParam) {
  const res = await request.get<ApiResult<ShopSpec[]>>(
    MODULES_API_URL + '/shop/shop-spec',
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
export async function addShopSpec(data: ShopSpec) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-spec',
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
export async function updateShopSpec(data: ShopSpec) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-spec',
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
export async function removeShopSpec(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-spec/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格
 */
export async function removeBatchShopSpec(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-spec/batch',
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
export async function getShopSpec(id: number) {
  const res = await request.get<ApiResult<ShopSpec>>(
    MODULES_API_URL + '/shop/shop-spec/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
