import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { OrderGoods, OrderGoodsParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询订单商品
 */
export async function pageOrderGoods(params: OrderGoodsParam) {
  const res = await request.get<ApiResult<PageResult<OrderGoods>>>(
    SERVER_API_URL + '/system/order-goods/page',
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
 * 查询订单商品列表
 */
export async function listOrderGoods(params?: OrderGoodsParam) {
  const res = await request.get<ApiResult<OrderGoods[]>>(
    SERVER_API_URL + '/system/order-goods',
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
 * 添加订单商品
 */
export async function addOrderGoods(data: OrderGoods) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order-goods',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改订单商品
 */
export async function updateOrderGoods(data: OrderGoods) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order-goods',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除订单商品
 */
export async function removeOrderGoods(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order-goods/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除订单商品
 */
export async function removeBatchOrderGoods(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order-goods/batch',
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
 * 根据id查询订单商品
 */
export async function getOrderGoods(id: number) {
  const res = await request.get<ApiResult<OrderGoods>>(
    SERVER_API_URL + '/system/order-goods/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
