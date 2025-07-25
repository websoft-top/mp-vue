import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsAd, CmsAdParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询广告位
 */
export async function pageCmsAd(params: CmsAdParam) {
  const res = await request.get<ApiResult<PageResult<CmsAd>>>(
    MODULES_API_URL + '/cms/cms-ad/page',
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
 * 查询广告位列表
 */
export async function listCmsAd(params?: CmsAdParam) {
  const res = await request.get<ApiResult<CmsAd[]>>(
    MODULES_API_URL + '/cms/cms-ad',
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
 * 添加广告位
 */
export async function addCmsAd(data: CmsAd) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改广告位
 */
export async function updateCmsAd(data: CmsAd) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除广告位
 */
export async function removeCmsAd(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除广告位
 */
export async function removeBatchCmsAd(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad/batch',
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
 * 根据id查询广告位
 */
export async function getCmsAd(id: number) {
  const res = await request.get<ApiResult<CmsAd>>(
    MODULES_API_URL + '/cms/cms-ad/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
