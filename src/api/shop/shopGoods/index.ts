import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopGoods, ShopGoodsParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询商品
 */
export async function pageShopGoods(params: ShopGoodsParam) {
  const res = await request.get<ApiResult<PageResult<ShopGoods>>>(
    MODULES_API_URL + '/shop/shop-goods/page',
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
 * 查询商品列表
 */
export async function listShopGoods(params?: ShopGoodsParam) {
  const res = await request.get<ApiResult<ShopGoods[]>>(
    MODULES_API_URL + '/shop/shop-goods',
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
 * 添加商品
 */
export async function addShopGoods(data: ShopGoods) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品
 */
export async function updateShopGoods(data: ShopGoods) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品
 */
export async function removeShopGoods(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品
 */
export async function removeBatchShopGoods(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods/batch',
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
 * 根据id查询商品
 */
export async function getShopGoods(id: number) {
  const res = await request.get<ApiResult<ShopGoods>>(
    MODULES_API_URL + '/shop/shop-goods/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function getCount(params: ShopGoodsParam) {
  const res = await request.get(MODULES_API_URL + '/shop/shop-goods/data', {
    params
  });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
