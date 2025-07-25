import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CompanyGit, CompanyGitParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询代码仓库
 */
export async function pageCompanyGit(params: CompanyGitParam) {
  const res = await request.get<ApiResult<PageResult<CompanyGit>>>(
    SERVER_API_URL + '/system/company-git/page',
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
 * 查询代码仓库列表
 */
export async function listCompanyGit(params?: CompanyGitParam) {
  const res = await request.get<ApiResult<CompanyGit[]>>(
    SERVER_API_URL + '/system/company-git',
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
 * 添加代码仓库
 */
export async function addCompanyGit(data: CompanyGit) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-git',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改代码仓库
 */
export async function updateCompanyGit(data: CompanyGit) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-git',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除代码仓库
 */
export async function removeCompanyGit(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-git/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除代码仓库
 */
export async function removeBatchCompanyGit(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-git/batch',
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
 * 根据id查询代码仓库
 */
export async function getCompanyGit(id: number) {
  const res = await request.get<ApiResult<CompanyGit>>(
    SERVER_API_URL + '/system/company-git/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
