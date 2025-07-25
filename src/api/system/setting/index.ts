import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Setting, SettingParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询设置
 */
export async function pageSetting(params: SettingParam) {
  const res = await request.get<ApiResult<PageResult<Setting>>>(
    SERVER_API_URL + '/system/setting/page',
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
 * 查询设置列表
 */
export async function listSetting(params?: SettingParam) {
  const res = await request.get<ApiResult<Setting[]>>(
    SERVER_API_URL + '/system/setting',
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
 * 根据id查询
 */
export async function getSetting(id: number) {
  const res = await request.get<ApiResult<Setting>>(
    SERVER_API_URL + '/system/setting/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据key查询
 */
export async function getSettingByKey(key: string) {
  const res = await request.get<ApiResult<any>>(
    SERVER_API_URL + '/system/setting/getByKey/' + key
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加设置
 */
export async function addSetting(data: Setting) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改设置
 */
export async function updateSetting(data: Setting) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据Key修改设置
 */
export async function updateSettingByKey(data: Setting) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting/updateByKey',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除设置
 */
export async function removeSetting(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除设置
 */
export async function removeBatchSetting(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting/batch',
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
 * 检查IP是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/setting/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
