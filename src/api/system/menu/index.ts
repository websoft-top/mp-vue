import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { Menu, MenuParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询菜单列表
 */
export async function listMenus(params: MenuParam) {
  const res = await request.get<ApiResult<Menu[]>>(
    SERVER_API_URL + '/system/menu',
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
 * 添加菜单
 */
export async function addMenu(data: Menu) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改菜单
 */
export async function updateMenu(data: Menu) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除菜单
 */
export async function removeMenu(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除菜单
 */
export async function removeBatchMenu(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/batch',
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
 * 按顶级目录批量删除菜单
 */
export async function deleteParentMenu(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/deleteParentMenu/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 安装应用
 */
export async function installApp(data: any) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/install',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 卸载应用
 */
export async function uninstallApp(data: any) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/uninstall',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 菜单克隆
export async function clone(data: any) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/clone',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 制作插件
 */
export async function createPlug(data: Menu) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/plug',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 安装插件
export async function installPlug(id?: number) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/menu/install/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
