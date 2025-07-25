import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsNavigation, CmsNavigationParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询网站导航记录表
 */
export async function pageCmsNavigation(params: CmsNavigationParam) {
  const res = await request.get<ApiResult<PageResult<CmsNavigation>>>(
    MODULES_API_URL + '/cms/cms-navigation/page',
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
 * 查询网站导航记录表列表
 */
export async function listCmsNavigation(params?: CmsNavigationParam) {
  const res = await request.get<ApiResult<CmsNavigation[]>>(
    MODULES_API_URL + '/cms/cms-navigation',
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
 * 查询导航列表（树形结构）
 */
export async function treeNavigation(params?: CmsNavigationParam) {
  const res = await request.get<ApiResult<CmsNavigation[]>>(
    MODULES_API_URL + '/cms/cms-navigation/tree',
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
 * 添加网站导航记录表
 */
export async function addCmsNavigation(data: CmsNavigation) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-navigation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站导航记录表
 */
export async function updateCmsNavigation(data: CmsNavigation) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-navigation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站导航记录表
 */
export async function removeCmsNavigation(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-navigation/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站导航记录表
 */
export async function removeBatchCmsNavigation(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-navigation/batch',
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
 * 根据id查询网站导航记录表
 */
export async function getCmsNavigation(id: number) {
  const res = await request.get<ApiResult<CmsNavigation>>(
    MODULES_API_URL + '/cms/cms-navigation/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
