import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Modules, ModulesParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询角色module
 */
export async function pageModules(params) {
  const res = await request.get<ApiResult<PageResult<Modules>>>(
    SERVER_API_URL + '/system/modules/page',
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
export async function listModules(params?: ModulesParam) {
  const res = await request.get<ApiResult<Modules[]>>(
    SERVER_API_URL + '/system/modules',
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
export async function addModules(data: Modules) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/modules',
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
export async function updateModules(data: Modules) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/modules',
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
export async function removeModules(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/modules/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除角色
 */
export async function removeModulesBath(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/modules/batch',
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
export async function listModulesMenus(modulesId?: number) {
  const res = await request.get<ApiResult<Modules[]>>(
    SERVER_API_URL + '/system/modules-menu/' + modulesId
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改角色菜单
 */
export async function updateModulesMenus(modulesId?: number, data?: number[]) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/modules-menu/' + modulesId,
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
