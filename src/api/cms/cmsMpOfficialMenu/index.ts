import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMpOfficialMenu, CmsMpOfficialMenuParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询微信公众号
 */
export async function pageCmsMpOfficialMenu(params: CmsMpOfficialMenuParam) {
  const res = await request.get<ApiResult<PageResult<CmsMpOfficialMenu>>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu/page',
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
 * 查询微信公众号列表
 */
export async function listCmsMpOfficialMenu(params?: CmsMpOfficialMenuParam) {
  const res = await request.get<ApiResult<CmsMpOfficialMenu[]>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu',
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
 * 添加微信公众号
 */
export async function addCmsMpOfficialMenu(data: CmsMpOfficialMenu) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改微信公众号
 */
export async function updateCmsMpOfficialMenu(data: CmsMpOfficialMenu) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除微信公众号
 */
export async function removeCmsMpOfficialMenu(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除微信公众号
 */
export async function removeBatchCmsMpOfficialMenu(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu/batch',
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
 * 根据id查询微信公众号
 */
export async function getCmsMpOfficialMenu(id: number) {
  const res = await request.get<ApiResult<CmsMpOfficialMenu>>(
    MODULES_API_URL + '/cms/cms-mp-official-menu/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
