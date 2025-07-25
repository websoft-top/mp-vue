import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { Company, CompanyParam } from './model';
import { PageResult } from '@/api';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询企业资料
 */
export async function getCompany(params?: CompanyParam) {
  const res = await request.get<ApiResult<Company>>(
    SERVER_API_URL + '/system/company/profile',
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
 * 查询企业资料不限租户
 */
export async function getCompanyAll(companyId: number) {
  const res = await request.get<ApiResult<Company>>(
    SERVER_API_URL + '/system/company/profileAll/' + companyId
  );
  if (res.data.code === 0 && res.data) {
    console.log(res.data);
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询Company列表
 */
export async function pageCompany(params: CompanyParam) {
  const res = await request.get<ApiResult<PageResult<Company>>>(
    SERVER_API_URL + '/system/company/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询Company列表不限租户
 */
export async function pageCompanyAll(params: CompanyParam) {
  const res = await request.get<ApiResult<PageResult<Company>>>(
    SERVER_API_URL + '/system/company/pageAll',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加Company
 */
export async function addCompany(data: Company) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改Company
 */
export async function updateCompany(data: Company) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改CompanyAll
 */
export async function updateCompanyAll(data: Company) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company/updateCompanyAll',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除Company
 */
export async function removeCompany(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

// 销毁租户
export async function destructionTenant(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company/destruction/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除Company
 */
export async function removeBatchCompany(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
