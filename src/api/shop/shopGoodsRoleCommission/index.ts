import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import { MODULES_API_URL } from '@/config/setting';
import { ShopGoodsRoleCommission, ShopGoodsRoleCommissionParam } from '@/api/shop/shopGoodsRoleCommission/model';

/**
 * 分页查询商品绑定角色的分润金额
 */
export async function pageShopGoodsRoleCommission(params: ShopGoodsRoleCommissionParam) {
  const res = await request.get<ApiResult<PageResult<ShopGoodsRoleCommission>>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission/page',
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
 * 查询商品绑定角色的分润金额列表
 */
export async function listShopGoodsRoleCommission(params?: ShopGoodsRoleCommissionParam) {
  const res = await request.get<ApiResult<ShopGoodsRoleCommission[]>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission',
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
 * 添加商品绑定角色的分润金额
 */
export async function addShopGoodsRoleCommission(data: ShopGoodsRoleCommission) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品绑定角色的分润金额
 */
export async function updateShopGoodsRoleCommission(data: ShopGoodsRoleCommission) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品绑定角色的分润金额
 */
export async function removeShopGoodsRoleCommission(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品绑定角色的分润金额
 */
export async function removeBatchShopGoodsRoleCommission(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission/batch',
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
 * 根据id查询商品绑定角色的分润金额
 */
export async function getShopGoodsRoleCommission(id: number) {
  const res = await request.get<ApiResult<ShopGoodsRoleCommission>>(
    MODULES_API_URL + '/shop/shop-goods-role-commission/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
