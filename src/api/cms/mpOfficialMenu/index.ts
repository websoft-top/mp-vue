import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { MpOfficialMenu, MpOfficialMenuParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序端菜单
 */
export async function pageMpOfficialMenu(params: MpOfficialMenuParam) {
  const res = await request.get<ApiResult<PageResult<MpOfficialMenu>>>(
    MODULES_API_URL + '/cms/mp-official-menu/page',
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
export async function listMpOfficialMenu(params?: MpOfficialMenuParam) {
  const res = await request.get<ApiResult<MpOfficialMenu[]>>(
    MODULES_API_URL + '/cms/mp-official-menu',
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
export async function addMpOfficialMenu(data: MpOfficialMenu) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/mp-official-menu',
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
export async function updateMpOfficialMenu(data: MpOfficialMenu) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/mp-official-menu',
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
export async function removeMpOfficialMenu(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/mp-official-menu/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序端菜单
 */
export async function removeBatchMpOfficialMenu(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/mp-official-menu/batch',
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
export async function getMpOfficialMenu(id: number) {
  const res = await request.get<ApiResult<MpOfficialMenu>>(
    MODULES_API_URL + '/cms/mp-official-menu/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
