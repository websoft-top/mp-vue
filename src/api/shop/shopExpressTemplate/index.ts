import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ShopExpressTemplate, ShopExpressTemplateParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询运费模板
 */
export async function pageShopExpressTemplate(params: ShopExpressTemplateParam) {
  const res = await request.get<ApiResult<PageResult<ShopExpressTemplate>>>(
    MODULES_API_URL + '/shop/shop-express-template/page',
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
export async function listShopExpressTemplate(params?: ShopExpressTemplateParam) {
  const res = await request.get<ApiResult<ShopExpressTemplate[]>>(
    MODULES_API_URL + '/shop/shop-express-template',
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
export async function addShopExpressTemplate(data: ShopExpressTemplate) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template',
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
export async function updateShopExpressTemplate(data: ShopExpressTemplate) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template',
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
export async function removeShopExpressTemplate(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除运费模板
 */
export async function removeBatchShopExpressTemplate(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/shop-express-template/batch',
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
export async function getShopExpressTemplate(id: number) {
  const res = await request.get<ApiResult<ShopExpressTemplate>>(
    MODULES_API_URL + '/shop/shop-express-template/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
