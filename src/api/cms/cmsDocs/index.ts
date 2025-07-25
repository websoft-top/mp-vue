import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDocs, CmsDocsParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询文档管理记录表
 */
export async function pageCmsDocs(params: CmsDocsParam) {
  const res = await request.get<ApiResult<PageResult<CmsDocs>>>(
    MODULES_API_URL + '/cms/cms-docs/page',
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
 * 查询文档管理记录表列表
 */
export async function listCmsDocs(params?: CmsDocsParam) {
  const res = await request.get<ApiResult<CmsDocs[]>>(
    MODULES_API_URL + '/cms/cms-docs',
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
 * 添加文档管理记录表
 */
export async function addCmsDocs(data: CmsDocs) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文档管理记录表
 */
export async function updateCmsDocs(data: CmsDocs) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文档管理记录表
 */
export async function removeCmsDocs(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文档管理记录表
 */
export async function removeBatchCmsDocs(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs/batch',
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
 * 根据id查询文档管理记录表
 */
export async function getCmsDocs(id: number) {
  const res = await request.get<ApiResult<CmsDocs>>(
    MODULES_API_URL + '/cms/cms-docs/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
