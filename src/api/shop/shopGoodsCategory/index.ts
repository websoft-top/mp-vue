import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopGoodsCategory, ShopGoodsCategoryParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询商品分类
 */
export async function pageShopGoodsCategory(params: ShopGoodsCategoryParam) {
  const res = await request.get<ApiResult<PageResult<ShopGoodsCategory>>>(
    MODULES_API_URL + '/shop/shop-goods-category/page',
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
 * 查询商品分类列表
 */
export async function listShopGoodsCategory(params?: ShopGoodsCategoryParam) {
  const res = await request.get<ApiResult<ShopGoodsCategory[]>>(
    MODULES_API_URL + '/shop/shop-goods-category',
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
 * 添加商品分类
 */
export async function addShopGoodsCategory(data: ShopGoodsCategory) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-category',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改商品分类
 */
export async function updateShopGoodsCategory(data: ShopGoodsCategory) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-category',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除商品分类
 */
export async function removeShopGoodsCategory(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-category/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除商品分类
 */
export async function removeBatchShopGoodsCategory(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-goods-category/batch',
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
 * 根据id查询商品分类
 */
export async function getShopGoodsCategory(id: number) {
  const res = await request.get<ApiResult<ShopGoodsCategory>>(
    MODULES_API_URL + '/shop/shop-goods-category/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
