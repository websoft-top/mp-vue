import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDesign, CmsDesignParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询页面管理记录表
 */
export async function pageCmsDesign(params: CmsDesignParam) {
  const res = await request.get<ApiResult<PageResult<CmsDesign>>>(
    MODULES_API_URL + '/cms/cms-design/page',
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
 * 查询页面管理记录表列表
 */
export async function listCmsDesign(params?: CmsDesignParam) {
  const res = await request.get<ApiResult<CmsDesign[]>>(
    MODULES_API_URL + '/cms/cms-design',
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
 * 添加页面管理记录表
 */
export async function addCmsDesign(data: CmsDesign) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改页面管理记录表
 */
export async function updateCmsDesign(data: CmsDesign) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除页面管理记录表
 */
export async function removeCmsDesign(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除页面管理记录表
 */
export async function removeBatchCmsDesign(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design/batch',
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
 * 根据id查询页面管理记录表
 */
export async function getCmsDesign(id: number) {
  const res = await request.get<ApiResult<CmsDesign>>(
    MODULES_API_URL + '/cms/cms-design/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
