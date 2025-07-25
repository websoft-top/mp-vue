import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDocsBook, CmsDocsBookParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询书籍记录表
 */
export async function pageCmsDocsBook(params: CmsDocsBookParam) {
  const res = await request.get<ApiResult<PageResult<CmsDocsBook>>>(
    MODULES_API_URL + '/cms/cms-docs-book/page',
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
 * 查询书籍记录表列表
 */
export async function listCmsDocsBook(params?: CmsDocsBookParam) {
  const res = await request.get<ApiResult<CmsDocsBook[]>>(
    MODULES_API_URL + '/cms/cms-docs-book',
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
 * 添加书籍记录表
 */
export async function addCmsDocsBook(data: CmsDocsBook) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-book',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改书籍记录表
 */
export async function updateCmsDocsBook(data: CmsDocsBook) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-book',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除书籍记录表
 */
export async function removeCmsDocsBook(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-book/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除书籍记录表
 */
export async function removeBatchCmsDocsBook(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-docs-book/batch',
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
 * 根据id查询书籍记录表
 */
export async function getCmsDocsBook(id: number) {
  const res = await request.get<ApiResult<CmsDocsBook>>(
    MODULES_API_URL + '/cms/cms-docs-book/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
