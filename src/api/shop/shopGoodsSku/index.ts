import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import { MODULES_API_URL } from '@/config/setting';
import { ShopGoodsSpec } from '@/api/shop/shopGoodsSpec/model';
import { ShopGoodsSku, ShopGoodsSkuParam } from '@/api/shop/shopGoodsSku/model';

export async function generateGoodsSku(data: ShopGoodsSpec) {
  const res = await request.post<ApiResult<ShopGoodsSku[]>>(
    MODULES_API_URL + '/shop/goods-sku/generateGoodsSku',
    data
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 分页查询商品sku列表
 */
export async function pageShopGoodsSku(params: ShopGoodsSkuParam) {
  const res = await request.get<ApiResult<PageResult<ShopGoodsSku>>>(
    MODULES_API_URL + '/shop/shop-goods-sku/page',
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
 * 查询商品sku列表列表
 */
export async function listShopGoodsSku(params?: ShopGoodsSkuParam) {
  const res = await request.get<ApiResult<ShopGoodsSku[]>>(
    MODULES_API_URL + '/shop/shop-goods-sku',
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
 * 添加商品sku列表
 */
export async function addShopGoodsSku(data: ShopGoodsSku) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-sku',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品sku列表
 */
export async function updateShopGoodsSku(data: ShopGoodsSku) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-sku',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品sku列表
 */
export async function removeShopGoodsSku(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-sku/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品sku列表
 */
export async function removeBatchShopGoodsSku(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-sku/batch',
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
 * 根据id查询商品sku列表
 */
export async function getShopGoodsSku(id: number) {
  const res = await request.get<ApiResult<ShopGoodsSku>>(
    MODULES_API_URL + '/shop/shop-goods-sku/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
