import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Website, WebsiteParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 获取网站信息
 */
export async function getSiteInfo() {
  const res = await request.get<ApiResult<Website>>(
    SERVER_API_URL + '/system/website/getSiteInfo'
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
    SERVER_API_URL + '/system/website/clearSiteInfo/' + key
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 分页查询网站
 */
export async function pageWebsite(params: WebsiteParam) {
  const res = await request.get<ApiResult<PageResult<Website>>>(
    SERVER_API_URL + '/system/website/page',
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
 * 查询网站列表
 */
export async function listWebsite(params?: WebsiteParam) {
  const res = await request.get<ApiResult<Website[]>>(
    SERVER_API_URL + '/system/website',
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
 * 添加网站
 */
export async function addWebsite(data: Website) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站
 */
export async function updateWebsite(data: Website) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站
 */
export async function removeWebsite(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站
 */
export async function removeBatchWebsite(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website/batch',
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
 * 修改用户状态
 */
export async function updateWebsiteStatus(websiteId?: number, status?: number) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website/status',
    {
      websiteId,
      status
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询网站
 */
export async function getWebsite(id: number) {
  const res = await request.get<ApiResult<Website>>(
    SERVER_API_URL + '/system/website/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查IP是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
