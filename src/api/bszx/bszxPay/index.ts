import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxPay, BszxPayParam } from './model';
import { MODULES_API_URL } from '@/config/setting';
import {ShopOrder} from "@/api/shop/shopOrder/model";

/**
 * 分页查询百色中学-捐款记录
 */
export async function pageBszxPay(params: BszxPayParam) {
  const res = await request.get<ApiResult<PageResult<BszxPay>>>(
    MODULES_API_URL + '/bszx/bszx-pay/page',
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
 * 查询百色中学-捐款记录列表
 */
export async function listBszxPay(params?: BszxPayParam) {
  const res = await request.get<ApiResult<BszxPay[]>>(
    MODULES_API_URL + '/bszx/bszx-pay',
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
 * 添加百色中学-捐款记录
 */
export async function addBszxPay(data: BszxPay) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-捐款记录
 */
export async function updateBszxPay(data: BszxPay) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-捐款记录
 */
export async function removeBszxPay(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-捐款记录
 */
export async function removeBatchBszxPay(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay/batch',
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
 * 根据id查询百色中学-捐款记录
 */
export async function getBszxPay(id: number) {
  const res = await request.get<ApiResult<BszxPay>>(
    MODULES_API_URL + '/bszx/bszx-pay/' + id
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
    MODULES_API_URL + '/bszx/bszx-pay/repair',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
