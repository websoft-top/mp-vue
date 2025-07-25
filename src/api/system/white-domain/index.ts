import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { WhiteDomain, WhiteDomainParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询服务器白名单
 */
export async function pageWhiteDomain(params: WhiteDomainParam) {
  const res = await request.get<ApiResult<PageResult<WhiteDomain>>>(
    SERVER_API_URL + '/system/white-domain/page',
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
 * 查询服务器白名单列表
 */
export async function listWhiteDomain(params?: WhiteDomainParam) {
  const res = await request.get<ApiResult<WhiteDomain[]>>(
    SERVER_API_URL + '/system/white-domain',
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
 * 添加服务器白名单
 */
export async function addWhiteDomain(data: WhiteDomain) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/white-domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改服务器白名单
 */
export async function updateWhiteDomain(data: WhiteDomain) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/white-domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除服务器白名单
 */
export async function removeWhiteDomain(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/white-domain/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除服务器白名单
 */
export async function removeBatchWhiteDomain(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/white-domain/batch',
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
 * 修改用户状态
 */
export async function updateWhiteDomainStatus(
  docsId?: number,
  status?: number
) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/white-domain/status',
    {
      docsId,
      status
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询服务器白名单
 */
export async function getWhiteDomain(id: number) {
  const res = await request.get<ApiResult<WhiteDomain>>(
    SERVER_API_URL + '/system/white-domain/' + id
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
    SERVER_API_URL + '/system/white-domain/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
