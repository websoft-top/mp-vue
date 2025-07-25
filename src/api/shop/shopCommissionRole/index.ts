import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopCommissionRole, ShopCommissionRoleParam } from './model';

/**
 * 分页查询分红角色
 */
export async function pageShopCommissionRole(params: ShopCommissionRoleParam) {
  const res = await request.get<ApiResult<PageResult<ShopCommissionRole>>>(
    '/shop/shop-commission-role/page',
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
 * 查询分红角色列表
 */
export async function listShopCommissionRole(params?: ShopCommissionRoleParam) {
  const res = await request.get<ApiResult<ShopCommissionRole[]>>(
    '/shop/shop-commission-role',
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
 * 添加分红角色
 */
export async function addShopCommissionRole(data: ShopCommissionRole) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/shop-commission-role',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改分红角色
 */
export async function updateShopCommissionRole(data: ShopCommissionRole) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/shop-commission-role',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除分红角色
 */
export async function removeShopCommissionRole(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-commission-role/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除分红角色
 */
export async function removeBatchShopCommissionRole(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-commission-role/batch',
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
 * 根据id查询分红角色
 */
export async function getShopCommissionRole(id: number) {
  const res = await request.get<ApiResult<ShopCommissionRole>>(
    '/shop/shop-commission-role/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
