import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserFeedback, UserFeedbackParam } from './model';

/**
 * 分页查询意见反馈
 */
export async function pageUserFeedback(params: UserFeedbackParam) {
  const res = await request.get<ApiResult<PageResult<UserFeedback>>>(
    '/shop/user-feedback/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询意见反馈列表
 */
export async function listUserFeedback(params?: UserFeedbackParam) {
  const res = await request.get<ApiResult<UserFeedback[]>>(
    '/shop/user-feedback',
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
 * 根据id查询意见反馈
 */
export async function getUserFeedback(id: number) {
  const res = await request.get<ApiResult<UserFeedback>>(
    '/shop/user-feedback/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加意见反馈
 */
export async function addUserFeedback(data: UserFeedback) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/user-feedback',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改意见反馈
 */
export async function updateUserFeedback(data: UserFeedback) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/user-feedback',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除意见反馈
 */
export async function removeUserFeedback(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/user-feedback/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除意见反馈
 */
export async function removeBatchUserFeedbacks(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/user-feedback/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
