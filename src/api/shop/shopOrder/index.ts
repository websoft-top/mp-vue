import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopOrder, ShopOrderParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询订单
 */
export async function pageShopOrder(params: ShopOrderParam) {
  const res = await request.get<ApiResult<PageResult<ShopOrder>>>(
    MODULES_API_URL + '/shop/shop-order/page',
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
 * 查询订单列表
 */
export async function listShopOrder(params?: ShopOrderParam) {
  const res = await request.get<ApiResult<ShopOrder[]>>(
    MODULES_API_URL + '/shop/shop-order',
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
 * 添加订单
 */
export async function addShopOrder(data: ShopOrder) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改订单
 */
export async function updateShopOrder(data: ShopOrder) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除订单
 */
export async function removeShopOrder(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-order/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除订单
 */
export async function removeBatchShopOrder(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-order/batch',
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
 * 根据id查询订单
 */
export async function getShopOrder(id: number) {
  const res = await request.get<ApiResult<ShopOrder>>(
    MODULES_API_URL + '/shop/shop-order/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改订单
 */
export async function repairOrder(data: ShopOrder) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-order/repair',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
