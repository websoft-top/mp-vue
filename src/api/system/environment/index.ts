import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Environment, EnvironmentParam } from './model/index';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询应用
 */
export async function pageEnvironment(params?: EnvironmentParam) {
  const res = await request.get<ApiResult<PageResult<Environment>>>(
    SERVER_API_URL + '/system/environment/page',
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
 * 查询应用列表
 */
export async function listEnvironment(params?: EnvironmentParam) {
  const res = await request.get<ApiResult<Environment[]>>(
    SERVER_API_URL + '/system/environment',
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
 * 根据id查询应用
 */
export async function getEnvironment(id: number) {
  const res = await request.get<ApiResult<Environment>>(
    SERVER_API_URL + '/system/environment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用
 */
export async function updateEnvironment(data: Environment) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/environment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 排行榜
export async function ranking(params?: EnvironmentParam) {
  const res = await request.get<ApiResult<Environment[]>>(
    SERVER_API_URL + '/system/environment/ranking',
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
 * 检查IP是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/environment/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 搜索历史
export async function searchHistory(params?: String) {
  const res = await request.get<ApiResult<String[]>>(
    SERVER_API_URL + '/system/environment/search-history',
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
 * 制作插件
 */
export async function createEnvironment(data: Environment) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/environment/environment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
