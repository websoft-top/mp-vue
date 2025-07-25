import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CompanyUrl, CompanyUrlParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用域名
 */
export async function pageCompanyUrl(params: CompanyUrlParam) {
  const res = await request.get<ApiResult<PageResult<CompanyUrl>>>(
    SERVER_API_URL + '/system/company-url/page',
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
export async function listCompanyUrl(params?: CompanyUrlParam) {
  const res = await request.get<ApiResult<CompanyUrl[]>>(
    SERVER_API_URL + '/system/company-url',
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
export async function addCompanyUrl(data: CompanyUrl) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-url',
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
export async function updateCompanyUrl(data: CompanyUrl) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-url',
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
export async function removeCompanyUrl(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-url/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用域名
 */
export async function removeBatchCompanyUrl(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-url/batch',
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
export async function getCompanyUrl(id: number) {
  const res = await request.get<ApiResult<CompanyUrl>>(
    SERVER_API_URL + '/system/company-url/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
