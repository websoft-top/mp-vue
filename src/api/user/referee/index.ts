import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserReferee, UserRefereeParam } from '@/api/user/referee/model';
/**
 * 分页查询推荐关系
 */
export async function pageUserReferee(params: UserRefereeParam) {
  const res = await request.get<ApiResult<PageResult<UserReferee>>>(
    '/shop/user-referee/page',
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
 * 查询推荐关系列表
 */
export async function listUserReferee(params?: UserRefereeParam) {
  const res = await request.get<ApiResult<UserReferee[]>>(
    '/shop/user-referee',
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
 * 添加推荐关系
 */
export async function addUserReferee(data: UserReferee) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/user-referee',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改推荐关系
 */
export async function updateUserReferee(data: UserReferee) {
  const res = await request.put<ApiResult<unknown>>('/shop/user-referee', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 绑定推荐关系
 */
export async function bindUserReferee(data: UserReferee) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/user-referee/bind',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除推荐关系
 */
export async function removeUserReferee(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/user-referee/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除推荐关系
 */
export async function removeBatchUserReferee(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/user-referee/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
