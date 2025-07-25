import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopMerchant, ShopMerchantParam } from './model';

/**
 * 分页查询商户
 */
export async function pageShopMerchant(params: ShopMerchantParam) {
  const res = await request.get<ApiResult<PageResult<ShopMerchant>>>(
    '/shop/shop-merchant/page',
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
 * 查询商户列表
 */
export async function listShopMerchant(params?: ShopMerchantParam) {
  const res = await request.get<ApiResult<ShopMerchant[]>>(
    '/shop/shop-merchant',
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
 * 添加商户
 */
export async function addShopMerchant(data: ShopMerchant) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/shop-merchant',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商户
 */
export async function updateShopMerchant(data: ShopMerchant) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/shop-merchant',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商户
 */
export async function removeShopMerchant(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-merchant/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商户
 */
export async function removeBatchShopMerchant(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-merchant/batch',
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
 * 根据id查询商户
 */
export async function getShopMerchant(id: number) {
  const res = await request.get<ApiResult<ShopMerchant>>(
    '/shop/shop-merchant/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
