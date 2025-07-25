import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { Cache, CacheParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询缓存数据
 */
export async function listCache(params?: CacheParam) {
  const res = await request.get<ApiResult<Cache[]>>(
    SERVER_API_URL + '/system/cache',
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
 * 获取缓存数据
 * @param key
 */
export async function getCache(key: String) {
  const res = await request.get<ApiResult<Cache>>(
    SERVER_API_URL + '/system/cache/' + key
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
}

/**
 * 更新缓存数据
 * @param cache
 */
export async function updateCache(cache: Cache) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/cache',
    cache
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除缓存数据
 * @param key
 */
export async function removeCache(key?: String) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/cache/' + key
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 更新缓存数据
 * @param cache
 */
export async function updateCacheTheme(cache: Cache) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/cache/theme',
    cache
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
}
