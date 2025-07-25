import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopMerchantAccount, ShopMerchantAccountParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询商户账号
 */
export async function pageShopMerchantAccount(params: ShopMerchantAccountParam) {
  const res = await request.get<ApiResult<PageResult<ShopMerchantAccount>>>(
    MODULES_API_URL + '/shop/shop-merchant-account/page',
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
 * 查询商户账号列表
 */
export async function listShopMerchantAccount(params?: ShopMerchantAccountParam) {
  const res = await request.get<ApiResult<ShopMerchantAccount[]>>(
    MODULES_API_URL + '/shop/shop-merchant-account',
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
 * 添加商户账号
 */
export async function addShopMerchantAccount(data: ShopMerchantAccount) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-account',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商户账号
 */
export async function updateShopMerchantAccount(data: ShopMerchantAccount) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-account',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商户账号
 */
export async function removeShopMerchantAccount(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-account/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商户账号
 */
export async function removeBatchShopMerchantAccount(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-account/batch',
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
 * 根据id查询商户账号
 */
export async function getShopMerchantAccount(id: number) {
  const res = await request.get<ApiResult<ShopMerchantAccount>>(
    MODULES_API_URL + '/shop/shop-merchant-account/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
