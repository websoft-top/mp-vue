import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDomain, CmsDomainParam } from './model';
import { SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询网站域名记录表
 */
export async function pageCmsDomain(params: CmsDomainParam) {
  const res = await request.get<ApiResult<PageResult<CmsDomain>>>(
    SERVER_API_URL + '/cms/cms-domain/page',
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
 * 查询网站域名记录表列表
 */
export async function listCmsDomain(params?: CmsDomainParam) {
  const res = await request.get<ApiResult<CmsDomain[]>>(
    SERVER_API_URL + '/cms/cms-domain',
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
 * 添加网站域名记录表
 */
export async function addCmsDomain(data: CmsDomain) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/cms/cms-domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站域名记录表
 */
export async function updateCmsDomain(data: CmsDomain) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/cms/cms-domain/domain',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站域名记录表
 */
export async function removeCmsDomain(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/cms/cms-domain/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站域名记录表
 */
export async function removeBatchCmsDomain(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/cms/cms-domain/batch',
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
 * 根据id查询网站域名记录表
 */
export async function getCmsDomain(id: number) {
  const res = await request.get<ApiResult<CmsDomain>>(
    SERVER_API_URL + '/cms/cms-domain/' + id
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
    SERVER_API_URL + '/cms/cms-domain/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function resolvable(id: number) {
  const res = await request.get<ApiResult<CmsDomain>>(
    SERVER_API_URL + '/cms/cms-domain/resolvable/' + id
  );
  if (res.data.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 根据授权主域名
 */
export async function getAuthorizedDomain() {
  if(!localStorage.getItem('WebsiteId')){
    return false;
  }
  const res = await request.get<ApiResult<CmsDomain>>(
    SERVER_API_URL + '/cms/cms-domain/getAuthorizedDomain/' + localStorage.getItem('WebsiteId')
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
