import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { RechargeOrder, RechargeOrderParam } from './model/index';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 充值
 */
export async function recharge(data: RechargeOrder) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order/recharge',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 分页查询充值记录
 */
export async function pageRechargeOrder(params: RechargeOrderParam) {
  const res = await request.get<ApiResult<PageResult<RechargeOrder>>>(
    SERVER_API_URL + '/sys/recharge-order/page',
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
 * 查询充值记录列表
 */
export async function listRechargeOrder(params?: RechargeOrderParam) {
  const res = await request.get<ApiResult<RechargeOrder[]>>(
    SERVER_API_URL + '/sys/recharge-order',
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
 * 根据id查询充值记录
 */
export async function getRechargeOrder(id: number) {
  const res = await request.get<ApiResult<RechargeOrder>>(
    SERVER_API_URL + '/sys/recharge-order/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加充值记录
 */
export async function addRechargeOrder(data: RechargeOrder) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改充值记录
 */
export async function updateRechargeOrder(data: RechargeOrder) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除充值记录
 */
export async function removeRechargeOrder(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除充值记录
 */
export async function removeBatchRechargeOrder(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order/batch',
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
 * 批量充值操作
 */
export async function batchRecharge(data: RechargeOrder[]) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/sys/recharge-order/batchRecharge',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
