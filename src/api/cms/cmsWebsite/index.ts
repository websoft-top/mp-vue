import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsWebsite, CmsWebsiteParam } from './model';
import {MODULES_API_URL} from '@/config/setting';

/**
 * 分页查询网站信息记录表
 */
export async function pageCmsWebsite(params: CmsWebsiteParam) {
  const res = await request.get<ApiResult<PageResult<CmsWebsite>>>(
    MODULES_API_URL + '/cms/cms-website/page',
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
 * 查询网站信息记录表列表
 */
export async function listCmsWebsite(params?: CmsWebsiteParam) {
  const res = await request.get<ApiResult<CmsWebsite[]>>(
    MODULES_API_URL + '/cms/cms-website',
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
 * 添加网站信息记录表
 */
export async function addCmsWebsite(data: CmsWebsite) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站信息记录表
 */
export async function updateCmsWebsite(data: CmsWebsite) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站信息记录表
 */
export async function removeCmsWebsite(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站信息记录表
 */
export async function removeBatchCmsWebsite(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website/batch',
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
 * 根据id查询网站信息记录表
 */
export async function getCmsWebsite(id: number) {
  const res = await request.get<ApiResult<CmsWebsite>>(
    MODULES_API_URL + '/cms/cms-website/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 清除缓存
 */
export async function removeSiteInfoCache(key?: string) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website/clearSiteInfo/' + key
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
