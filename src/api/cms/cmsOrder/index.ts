import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsOrder, CmsOrderParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询订单
 */
export async function pageCmsOrder(params: CmsOrderParam) {
  const res = await request.get<ApiResult<PageResult<CmsOrder>>>(
    MODULES_API_URL + '/cms/cms-order/page',
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
 * 查询订单列表
 */
export async function listCmsOrder(params?: CmsOrderParam) {
  const res = await request.get<ApiResult<CmsOrder[]>>(
    MODULES_API_URL + '/cms/cms-order',
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
 * 添加订单
 */
export async function addCmsOrder(data: CmsOrder) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改订单
 */
export async function updateCmsOrder(data: CmsOrder) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-order',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除订单
 */
export async function removeCmsOrder(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-order/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除订单
 */
export async function removeBatchCmsOrder(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-order/batch',
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
 * 根据id查询订单
 */
export async function getCmsOrder(id: number) {
  const res = await request.get<ApiResult<CmsOrder>>(
    MODULES_API_URL + '/cms/cms-order/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
