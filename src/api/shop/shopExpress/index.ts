import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopExpress, ShopExpressParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询物流公司
 */
export async function pageShopExpress(params: ShopExpressParam) {
  const res = await request.get<ApiResult<PageResult<ShopExpress>>>(
    MODULES_API_URL + '/shop/shop-express/page',
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
 * 查询物流公司列表
 */
export async function listShopExpress(params?: ShopExpressParam) {
  const res = await request.get<ApiResult<ShopExpress[]>>(
    MODULES_API_URL + '/shop/shop-express',
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
 * 添加物流公司
 */
export async function addShopExpress(data: ShopExpress) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改物流公司
 */
export async function updateShopExpress(data: ShopExpress) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除物流公司
 */
export async function removeShopExpress(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除物流公司
 */
export async function removeBatchShopExpress(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express/batch',
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
 * 根据id查询物流公司
 */
export async function getShopExpress(id: number) {
  const res = await request.get<ApiResult<ShopExpress>>(
    MODULES_API_URL + '/shop/shop-express/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
