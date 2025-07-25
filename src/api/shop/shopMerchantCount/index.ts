import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopMerchantCount, ShopMerchantCountParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询门店销售统计表
 */
export async function pageShopMerchantCount(params: ShopMerchantCountParam) {
  const res = await request.get<ApiResult<PageResult<ShopMerchantCount>>>(
    MODULES_API_URL + '/shop/shop-merchant-count/page',
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
 * 查询门店销售统计表列表
 */
export async function listShopMerchantCount(params?: ShopMerchantCountParam) {
  const res = await request.get<ApiResult<ShopMerchantCount[]>>(
    MODULES_API_URL + '/shop/shop-merchant-count',
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
 * 添加门店销售统计表
 */
export async function addShopMerchantCount(data: ShopMerchantCount) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-count',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改门店销售统计表
 */
export async function updateShopMerchantCount(data: ShopMerchantCount) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-count',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除门店销售统计表
 */
export async function removeShopMerchantCount(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-count/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除门店销售统计表
 */
export async function removeBatchShopMerchantCount(
  data: (number | undefined)[]
) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-merchant-count/batch',
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
 * 根据id查询门店销售统计表
 */
export async function getShopMerchantCount(id: number) {
  const res = await request.get<ApiResult<ShopMerchantCount>>(
    MODULES_API_URL + '/shop/shop-merchant-count/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
