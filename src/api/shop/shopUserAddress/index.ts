import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopUserAddress, ShopUserAddressParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询收货地址
 */
export async function pageShopUserAddress(params: ShopUserAddressParam) {
  const res = await request.get<ApiResult<PageResult<ShopUserAddress>>>(
    MODULES_API_URL + '/shop/shop-user-address/page',
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
 * 查询收货地址列表
 */
export async function listShopUserAddress(params?: ShopUserAddressParam) {
  const res = await request.get<ApiResult<ShopUserAddress[]>>(
    MODULES_API_URL + '/shop/shop-user-address',
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
 * 添加收货地址
 */
export async function addShopUserAddress(data: ShopUserAddress) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-address',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改收货地址
 */
export async function updateShopUserAddress(data: ShopUserAddress) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-address',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除收货地址
 */
export async function removeShopUserAddress(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-address/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除收货地址
 */
export async function removeBatchShopUserAddress(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-address/batch',
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
 * 根据id查询收货地址
 */
export async function getShopUserAddress(id: number) {
  const res = await request.get<ApiResult<ShopUserAddress>>(
    MODULES_API_URL + '/shop/shop-user-address/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
