import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDocsContent, CmsDocsContentParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询文档内容记录表
 */
export async function pageCmsDocsContent(params: CmsDocsContentParam) {
  const res = await request.get<ApiResult<PageResult<CmsDocsContent>>>(
    MODULES_API_URL + '/cms/cms-docs-content/page',
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
 * 查询文档内容记录表列表
 */
export async function listCmsDocsContent(params?: CmsDocsContentParam) {
  const res = await request.get<ApiResult<CmsDocsContent[]>>(
    MODULES_API_URL + '/cms/cms-docs-content',
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
 * 添加文档内容记录表
 */
export async function addCmsDocsContent(data: CmsDocsContent) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文档内容记录表
 */
export async function updateCmsDocsContent(data: CmsDocsContent) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文档内容记录表
 */
export async function removeCmsDocsContent(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-content/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文档内容记录表
 */
export async function removeBatchCmsDocsContent(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-content/batch',
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
 * 根据id查询文档内容记录表
 */
export async function getCmsDocsContent(id: number) {
  const res = await request.get<ApiResult<CmsDocsContent>>(
    MODULES_API_URL + '/cms/cms-docs-content/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
