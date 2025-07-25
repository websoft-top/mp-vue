import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Url, UrlParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用域名
 */
export async function pageUrl(params: UrlParam) {
  const res = await request.get<ApiResult<PageResult<Url>>>(
    SERVER_API_URL + '/system/url/page',
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
 * 查询应用域名列表
 */
export async function listUrl(params?: UrlParam) {
  const res = await request.get<ApiResult<Url[]>>(
    SERVER_API_URL + '/system/url',
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
 * 添加应用域名
 */
export async function addUrl(data: Url) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/url',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用域名
 */
export async function updateUrl(data: Url) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/url',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用域名
 */
export async function removeUrl(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/url/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用域名
 */
export async function removeBatchUrl(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/url/batch',
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
 * 根据id查询应用域名
 */
export async function getUrl(id: number) {
  const res = await request.get<ApiResult<Url>>(
    SERVER_API_URL + '/system/url/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
