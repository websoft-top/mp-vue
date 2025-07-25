import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopMerchantApply, ShopMerchantApplyParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询商户入驻申请
 */
export async function pageShopMerchantApply(params: ShopMerchantApplyParam) {
  const res = await request.get<ApiResult<PageResult<ShopMerchantApply>>>(
    SERVER_API_URL + '/shop/shop-merchant-apply/page',
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
 * 查询商户入驻申请列表
 */
export async function listShopMerchantApply(params?: ShopMerchantApplyParam) {
  const res = await request.get<ApiResult<ShopMerchantApply[]>>(
    SERVER_API_URL + '/shop/shop-merchant-apply',
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
 * 添加商户入驻申请
 */
export async function addShopMerchantApply(data: ShopMerchantApply) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-apply',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商户入驻申请
 */
export async function updateShopMerchantApply(data: ShopMerchantApply) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-apply',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 审核通过
export async function checkShopMerchantApply(data: ShopMerchantApply) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-apply/check',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商户入驻申请
 */
export async function removeShopMerchantApply(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-apply/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商户入驻申请
 */
export async function removeBatchShopMerchantApply(
  data: (number | undefined)[]
) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/shop/shop-merchant-apply/batch',
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
 * 根据id查询商户入驻申请
 */
export async function getShopMerchantApply(id: number) {
  const res = await request.get<ApiResult<ShopMerchantApply>>(
    SERVER_API_URL + '/shop/shop-merchant-apply/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
