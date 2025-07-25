import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Payment, PaymentParam } from './model';
import { SERVER_API_URL } from '@/config/setting';
import type { Order } from '@/api/shop/order/model';

/**
 * 分页查询支付方式
 */
export async function pagePayment(params: PaymentParam) {
  const res = await request.get<ApiResult<PageResult<Payment>>>(
    SERVER_API_URL + '/system/payment/page',
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
 * 查询支付方式列表
 */
export async function listPayment(params?: PaymentParam) {
  const res = await request.get<ApiResult<Payment[]>>(
    SERVER_API_URL + '/system/payment',
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
 * 添加支付方式
 */
export async function addPayment(data: Payment) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/payment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改支付方式
 */
export async function updatePayment(data: Payment) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/payment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除支付方式
 */
export async function removePayment(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/payment/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除支付方式
 */
export async function removeBatchPayment(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/payment/batch',
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
 * 根据id查询支付方式
 */
export async function getPayment(id: number) {
  const res = await request.get<ApiResult<Payment>>(
    SERVER_API_URL + '/system/payment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 生成支付二维码(微信native)
 */
export async function getNativeCode(data: Order) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/wx-native-pay/codeUrl',
    data
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
