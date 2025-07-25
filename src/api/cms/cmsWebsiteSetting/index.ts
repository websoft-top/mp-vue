import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsWebsiteSetting, CmsWebsiteSettingParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询网站设置
 */
export async function pageCmsWebsiteSetting(params: CmsWebsiteSettingParam) {
  const res = await request.get<ApiResult<PageResult<CmsWebsiteSetting>>>(
    MODULES_API_URL + '/cms/cms-website-setting/page',
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
 * 查询网站设置列表
 */
export async function listCmsWebsiteSetting(params?: CmsWebsiteSettingParam) {
  const res = await request.get<ApiResult<CmsWebsiteSetting[]>>(
    MODULES_API_URL + '/cms/cms-website-setting',
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
 * 添加网站设置
 */
export async function addCmsWebsiteSetting(data: CmsWebsiteSetting) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-setting',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站设置
 */
export async function updateCmsWebsiteSetting(data: CmsWebsiteSetting) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-setting',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站设置
 */
export async function removeCmsWebsiteSetting(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-setting/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站设置
 */
export async function removeBatchCmsWebsiteSetting(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-setting/batch',
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
 * 根据id查询网站设置
 */
export async function getCmsWebsiteSetting(id: number) {
  const res = await request.get<ApiResult<CmsWebsiteSetting>>(
    MODULES_API_URL + '/cms/cms-website-setting/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
