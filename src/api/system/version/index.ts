import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Version, VersionParam } from './model';
import type { Menu } from '../menu/model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询角色
 */
export async function pageVersion(params: VersionParam) {
  const res = await request.get<ApiResult<PageResult<Version>>>(
    SERVER_API_URL + '/system/version/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询角色列表
 */
export async function listVersion(params?: VersionParam) {
  const res = await request.get<ApiResult<Version[]>>(
    SERVER_API_URL + '/system/version',
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
 * 添加角色
 */
export async function addVersion(data: Version) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/version',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改角色
 */
export async function updateVersion(data: Version) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/version',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除角色
 */
export async function removeVersion(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/version/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除角色
 */
export async function removeVersions(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/version/batch',
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
 * 获取角色分配的菜单
 */
export async function listVersionMenus(versionId?: number) {
  const res = await request.get<ApiResult<Menu[]>>(
    SERVER_API_URL + '/system/version-menu/' + versionId
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改角色菜单
 */
export async function updateVersionMenus(versionId?: number, data?: number[]) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/version-menu/' + versionId,
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
