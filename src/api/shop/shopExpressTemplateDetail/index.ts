import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopExpressTemplateDetail, ShopExpressTemplateDetailParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询运费模板
 */
export async function pageShopExpressTemplateDetail(params: ShopExpressTemplateDetailParam) {
  const res = await request.get<ApiResult<PageResult<ShopExpressTemplateDetail>>>(
    MODULES_API_URL + '/shop/shop-express-template-detail/page',
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
 * 查询运费模板列表
 */
export async function listShopExpressTemplateDetail(params?: ShopExpressTemplateDetailParam) {
  const res = await request.get<ApiResult<ShopExpressTemplateDetail[]>>(
    MODULES_API_URL + '/shop/shop-express-template-detail',
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
 * 添加运费模板
 */
export async function addShopExpressTemplateDetail(data: ShopExpressTemplateDetail) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template-detail',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改运费模板
 */
export async function updateShopExpressTemplateDetail(data: ShopExpressTemplateDetail) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template-detail',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除运费模板
 */
export async function removeShopExpressTemplateDetail(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template-detail/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除运费模板
 */
export async function removeBatchShopExpressTemplateDetail(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template-detail/batch',
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
 * 根据id查询运费模板
 */
export async function getShopExpressTemplateDetail(id: number) {
  const res = await request.get<ApiResult<ShopExpressTemplateDetail>>(
    MODULES_API_URL + '/shop/shop-express-template-detail/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
