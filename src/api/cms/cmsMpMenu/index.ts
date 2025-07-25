import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMpMenu, CmsMpMenuParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序端菜单
 */
export async function pageCmsMpMenu(params: CmsMpMenuParam) {
  const res = await request.get<ApiResult<PageResult<CmsMpMenu>>>(
    MODULES_API_URL + '/cms/cms-mp-menu/page',
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
 * 查询小程序端菜单列表
 */
export async function listCmsMpMenu(params?: CmsMpMenuParam) {
  const res = await request.get<ApiResult<CmsMpMenu[]>>(
    MODULES_API_URL + '/cms/cms-mp-menu',
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
 * 添加小程序端菜单
 */
export async function addCmsMpMenu(data: CmsMpMenu) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改小程序端菜单
 */
export async function updateCmsMpMenu(data: CmsMpMenu) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除小程序端菜单
 */
export async function removeCmsMpMenu(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-menu/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序端菜单
 */
export async function removeBatchCmsMpMenu(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-menu/batch',
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
 * 根据id查询小程序端菜单
 */
export async function getCmsMpMenu(id: number) {
  const res = await request.get<ApiResult<CmsMpMenu>>(
    MODULES_API_URL + '/cms/cms-mp-menu/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
