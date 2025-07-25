import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Plug, PlugParam } from './model/index';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询应用
 */
export async function pagePlug(params: PlugParam) {
  const res = await request.get<ApiResult<PageResult<Plug>>>(
    SERVER_API_URL + '/system/plug/page',
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
export async function listPlug(params?: PlugParam) {
  const res = await request.get<ApiResult<Plug[]>>(
    SERVER_API_URL + '/system/plug',
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
export async function getPlug(id: number) {
  const res = await request.get<ApiResult<Plug>>(
    SERVER_API_URL + '/system/plug/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用
 */
export async function updatePlug(data: Plug) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/plug',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 排行榜
export async function ranking(params?: PlugParam) {
  const res = await request.get<ApiResult<Plug[]>>(
    SERVER_API_URL + '/system/plug/ranking',
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
    SERVER_API_URL + '/system/plug/existence',
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
    SERVER_API_URL + '/system/plug/search-history',
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
export async function createPlug(data: Plug) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/plug/plug',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
