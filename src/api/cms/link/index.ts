import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Link, LinkParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询链接
 */
export async function pageLink(params: LinkParam) {
  const res = await request.get<ApiResult<PageResult<Link>>>(
    MODULES_API_URL + '/oa/link/page',
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
 * 查询链接列表
 */
export async function listLink(params?: LinkParam) {
  const res = await request.get<ApiResult<Link[]>>(
    MODULES_API_URL + '/oa/link',
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
 * 添加链接
 */
export async function addLink(data: Link) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/oa/link',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改链接
 */
export async function updateLink(data: Link) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/oa/link',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除链接
 */
export async function removeLink(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/oa/link/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除链接
 */
export async function removeBatchLink(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/oa/link/batch',
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
    MODULES_API_URL + '/oa/link/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
