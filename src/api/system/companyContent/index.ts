import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CompanyContent, CompanyContentParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用详情
 */
export async function pageCompanyContent(params: CompanyContentParam) {
  const res = await request.get<ApiResult<PageResult<CompanyContent>>>(
    SERVER_API_URL + '/system/company-content/page',
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
 * 查询应用详情列表
 */
export async function listCompanyContent(params?: CompanyContentParam) {
  const res = await request.get<ApiResult<CompanyContent[]>>(
    SERVER_API_URL + '/system/company-content',
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
 * 获取应用详情
 * @param id
 */
export async function getByCompanyId(id: number) {
  const res = await request.get<ApiResult<CompanyContent>>(
    SERVER_API_URL + '/system/company-content/getByCompanyId/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 添加应用详情
 */
export async function addCompanyContent(data: CompanyContent) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用详情
 */
export async function updateCompanyContent(data: CompanyContent) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用详情
 */
export async function removeCompanyContent(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-content/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用详情
 */
export async function removeBatchCompanyContent(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-content/batch',
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
 * 根据id查询应用详情
 */
export async function getCompanyContent(id: number) {
  const res = await request.get<ApiResult<CompanyContent>>(
    SERVER_API_URL + '/system/company-content/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
