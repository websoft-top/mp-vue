import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopUserReferee, ShopUserRefereeParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询用户推荐关系表
 */
export async function pageShopUserReferee(params: ShopUserRefereeParam) {
  const res = await request.get<ApiResult<PageResult<ShopUserReferee>>>(
    MODULES_API_URL + '/shop/shop-user-referee/page',
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
 * 查询用户推荐关系表列表
 */
export async function listShopUserReferee(params?: ShopUserRefereeParam) {
  const res = await request.get<ApiResult<ShopUserReferee[]>>(
    MODULES_API_URL + '/shop/shop-user-referee',
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
 * 添加用户推荐关系表
 */
export async function addShopUserReferee(data: ShopUserReferee) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-referee',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改用户推荐关系表
 */
export async function updateShopUserReferee(data: ShopUserReferee) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-referee',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除用户推荐关系表
 */
export async function removeShopUserReferee(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-referee/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除用户推荐关系表
 */
export async function removeBatchShopUserReferee(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-user-referee/batch',
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
 * 根据id查询用户推荐关系表
 */
export async function getShopUserReferee(id: number) {
  const res = await request.get<ApiResult<ShopUserReferee>>(
    MODULES_API_URL + '/shop/shop-user-referee/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
