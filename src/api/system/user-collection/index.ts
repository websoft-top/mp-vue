import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { UserCollection, UserCollectionParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询我的收藏
 */
export async function pageUserCollection(params: UserCollectionParam) {
  const res = await request.get<ApiResult<PageResult<UserCollection>>>(
    SERVER_API_URL + '/system/user-collection/page',
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
 * 查询我的收藏列表
 */
export async function listUserCollection(params?: UserCollectionParam) {
  const res = await request.get<ApiResult<UserCollection[]>>(
    SERVER_API_URL + '/system/user-collection',
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
 * 添加我的收藏
 */
export async function addUserCollection(data: UserCollection) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-collection',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改我的收藏
 */
export async function updateUserCollection(data: UserCollection) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-collection',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除我的收藏
 */
export async function removeUserCollection(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-collection/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除我的收藏
 */
export async function removeBatchUserCollection(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-collection/batch',
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
 * 根据id查询我的收藏
 */
export async function getUserCollection(id: number) {
  const res = await request.get<ApiResult<UserCollection>>(
    SERVER_API_URL + '/system/user-collection/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
