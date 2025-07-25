import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Order, OrderParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询订单
 */
export async function pageOrder(params: OrderParam) {
  const res = await request.get<ApiResult<PageResult<Order>>>(
    SERVER_API_URL + '/system/order/page',
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
export async function listOrder(params?: OrderParam) {
  const res = await request.get<ApiResult<Order[]>>(
    SERVER_API_URL + '/system/order',
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
export async function addOrder(data: Order) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order',
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
export async function updateOrder(data: Order) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order',
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
export async function removeOrder(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除订单
 */
export async function removeBatchOrder(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/order/batch',
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
export async function getOrder(id: number) {
  const res = await request.get<ApiResult<Order>>(
    SERVER_API_URL + '/system/order/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
