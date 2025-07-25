import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopGoodsSpec, ShopGoodsSpecParam } from './model';

/**
 * 分页查询商品多规格
 */
export async function pageShopGoodsSpec(params: ShopGoodsSpecParam) {
  const res = await request.get<ApiResult<PageResult<ShopGoodsSpec>>>(
    '/shop/shop-goods-spec/page',
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
 * 查询商品多规格列表
 */
export async function listShopGoodsSpec(params?: ShopGoodsSpecParam) {
  const res = await request.get<ApiResult<ShopGoodsSpec[]>>(
    '/shop/shop-goods-spec',
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
 * 添加商品多规格
 */
export async function addShopGoodsSpec(data: ShopGoodsSpec) {
  const res = await request.post<ApiResult<unknown>>(
    '/shop/shop-goods-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品多规格
 */
export async function updateShopGoodsSpec(data: ShopGoodsSpec) {
  const res = await request.put<ApiResult<unknown>>(
    '/shop/shop-goods-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品多规格
 */
export async function removeShopGoodsSpec(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-goods-spec/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品多规格
 */
export async function removeBatchShopGoodsSpec(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/shop/shop-goods-spec/batch',
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
 * 根据id查询商品多规格
 */
export async function getShopGoodsSpec(id: number) {
  const res = await request.get<ApiResult<ShopGoodsSpec>>(
    '/shop/shop-goods-spec/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
