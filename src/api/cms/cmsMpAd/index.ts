import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMpAd, CmsMpAdParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序广告位
 */
export async function pageCmsMpAd(params: CmsMpAdParam) {
  const res = await request.get<ApiResult<PageResult<CmsMpAd>>>(
    MODULES_API_URL + '/cms/cms-mp-ad/page',
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
 * 查询小程序广告位列表
 */
export async function listCmsMpAd(params?: CmsMpAdParam) {
  const res = await request.get<ApiResult<CmsMpAd[]>>(
    MODULES_API_URL + '/cms/cms-mp-ad',
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
 * 添加小程序广告位
 */
export async function addCmsMpAd(data: CmsMpAd) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-ad',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改小程序广告位
 */
export async function updateCmsMpAd(data: CmsMpAd) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-ad',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除小程序广告位
 */
export async function removeCmsMpAd(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-ad/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序广告位
 */
export async function removeBatchCmsMpAd(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-ad/batch',
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
 * 根据id查询小程序广告位
 */
export async function getCmsMpAd(id: number) {
  const res = await request.get<ApiResult<CmsMpAd>>(
    MODULES_API_URL + '/cms/cms-mp-ad/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
