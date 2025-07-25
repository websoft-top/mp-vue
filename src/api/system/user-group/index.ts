import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Group, GroupParam } from '@/api/system/user-group/model';
import { SERVER_API_URL } from '@/config/setting';
/**
 * 分页查询仓库
 */
export async function pageGroup(params: GroupParam) {
  const res = await request.get<ApiResult<PageResult<Group>>>(
    SERVER_API_URL + '/system/user-group/page',
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
 * 查询仓库列表
 */
export async function listGroup(params?: GroupParam) {
  const res = await request.get<ApiResult<Group[]>>(
    SERVER_API_URL + '/system/user-group',
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
 * 添加仓库
 */
export async function addGroup(data: Group) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改仓库
 */
export async function updateGroup(data: Group) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 绑定仓库
 */
export async function bindGroup(data: Group) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group/bind',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量添加设备
 */
export async function addBatchGroup(data: Group[]) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group/batch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除仓库
 */
export async function removeGroup(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除仓库
 */
export async function removeBatchGroup(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-group/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
