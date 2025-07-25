import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMpPages, CmsMpPagesParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序页面
 */
export async function pageCmsMpPages(params: CmsMpPagesParam) {
  const res = await request.get<ApiResult<PageResult<CmsMpPages>>>(
    MODULES_API_URL + '/cms/cms-mp-pages/page',
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
 * 查询小程序页面列表
 */
export async function listCmsMpPages(params?: CmsMpPagesParam) {
  const res = await request.get<ApiResult<CmsMpPages[]>>(
    MODULES_API_URL + '/cms/cms-mp-pages',
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
 * 添加小程序页面
 */
export async function addCmsMpPages(data: CmsMpPages) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-pages',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改小程序页面
 */
export async function updateCmsMpPages(data: CmsMpPages) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-pages',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除小程序页面
 */
export async function removeCmsMpPages(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-pages/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序页面
 */
export async function removeBatchCmsMpPages(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-pages/batch',
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
 * 根据id查询小程序页面
 */
export async function getCmsMpPages(id: number) {
  const res = await request.get<ApiResult<CmsMpPages>>(
    MODULES_API_URL + '/cms/cms-mp-pages/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
