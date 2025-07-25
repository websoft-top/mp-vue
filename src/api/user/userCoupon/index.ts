import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserCoupon, UserCouponParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询我的优惠券
 */
export async function pageUserCoupon(params: UserCouponParam) {
  const res = await request.get<ApiResult<PageResult<UserCoupon>>>(
    MODULES_API_URL + '/booking/user-coupon/page',
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
 * 查询我的优惠券列表
 */
export async function listUserCoupon(params?: UserCouponParam) {
  const res = await request.get<ApiResult<UserCoupon[]>>(
    MODULES_API_URL + '/booking/user-coupon',
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
 * 添加我的优惠券
 */
export async function addUserCoupon(data: UserCoupon) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/booking/user-coupon',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改我的优惠券
 */
export async function updateUserCoupon(data: UserCoupon) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/booking/user-coupon',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除我的优惠券
 */
export async function removeUserCoupon(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/booking/user-coupon/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除我的优惠券
 */
export async function removeBatchUserCoupon(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/booking/user-coupon/batch',
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
 * 根据id查询我的优惠券
 */
export async function getUserCoupon(id: number) {
  const res = await request.get<ApiResult<UserCoupon>>(
    MODULES_API_URL + '/booking/user-coupon/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
