import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopMerchantType, ShopMerchantTypeParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询商户类型
 */
export async function pageShopMerchantType(params: ShopMerchantTypeParam) {
  const res = await request.get<ApiResult<PageResult<ShopMerchantType>>>(
    SERVER_API_URL + '/shop/shop-merchant-type/page',
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
 * 查询商户类型列表
 */
export async function listShopMerchantType(params?: ShopMerchantTypeParam) {
  const res = await request.get<ApiResult<ShopMerchantType[]>>(
    SERVER_API_URL + '/shop/shop-merchant-type',
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
 * 添加商户类型
 */
export async function addShopMerchantType(data: ShopMerchantType) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-type',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商户类型
 */
export async function updateShopMerchantType(data: ShopMerchantType) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-type',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商户类型
 */
export async function removeShopMerchantType(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-type/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商户类型
 */
export async function removeBatchShopMerchantType(
  data: (number | undefined)[]
) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-type/batch',
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
 * 根据id查询商户类型
 */
export async function getShopMerchantType(id: number) {
  const res = await request.get<ApiResult<ShopMerchantType>>(
    SERVER_API_URL + '/shop/shop-merchant-type/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
