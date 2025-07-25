import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Domain, DomainParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询授权域名
 */
export async function pageDomain(params: DomainParam) {
  const res = await request.get<ApiResult<PageResult<Domain>>>(
    SERVER_API_URL + '/system/domain/page',
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
 * 查询授权域名列表
 */
export async function listDomain(params?: DomainParam) {
  const res = await request.get<ApiResult<Domain[]>>(
    SERVER_API_URL + '/system/domain',
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
 * 添加授权域名
 */
export async function addDomain(data: Domain) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改授权域名
 */
export async function updateDomain(data: Domain) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除授权域名
 */
export async function removeDomain(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/domain/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除授权域名
 */
export async function removeBatchDomain(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/domain/batch',
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
 * 根据id查询授权域名
 */
export async function getDomain(id: number) {
  const res = await request.get<ApiResult<Domain>>(
    SERVER_API_URL + '/system/domain/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
