import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsLink, CmsLinkParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询常用链接
 */
export async function pageCmsLink(params: CmsLinkParam) {
  const res = await request.get<ApiResult<PageResult<CmsLink>>>(
    MODULES_API_URL + '/cms/cms-link/page',
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
 * 查询常用链接列表
 */
export async function listCmsLink(params?: CmsLinkParam) {
  const res = await request.get<ApiResult<CmsLink[]>>(
    MODULES_API_URL + '/cms/cms-link',
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
 * 添加常用链接
 */
export async function addCmsLink(data: CmsLink) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-link',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改常用链接
 */
export async function updateCmsLink(data: CmsLink) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-link',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除常用链接
 */
export async function removeCmsLink(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-link/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量修改常用链接
 */
export async function updateBatchCmsLink(data: any) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-link/batch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除常用链接
 */
export async function removeBatchCmsLink(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-link/batch',
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
 * 根据id查询常用链接
 */
export async function getCmsLink(id: number) {
  const res = await request.get<ApiResult<CmsLink>>(
    MODULES_API_URL + '/cms/cms-link/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
