import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CompanyParameter, CompanyParameterParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用参数
 */
export async function pageCompanyParameter(params: CompanyParameterParam) {
  const res = await request.get<ApiResult<PageResult<CompanyParameter>>>(
    SERVER_API_URL + '/system/company-parameter/page',
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
 * 查询应用参数列表
 */
export async function listCompanyParameter(params?: CompanyParameterParam) {
  const res = await request.get<ApiResult<CompanyParameter[]>>(
    SERVER_API_URL + '/system/company-parameter',
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
 * 添加应用参数
 */
export async function addCompanyParameter(data: CompanyParameter) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用参数
 */
export async function updateCompanyParameter(data: CompanyParameter) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用参数
 */
export async function removeCompanyParameter(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-parameter/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用参数
 */
export async function removeBatchCompanyParameter(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-parameter/batch',
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
 * 根据id查询应用参数
 */
export async function getCompanyParameter(id: number) {
  const res = await request.get<ApiResult<CompanyParameter>>(
    SERVER_API_URL + '/system/company-parameter/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
