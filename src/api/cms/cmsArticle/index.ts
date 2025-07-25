import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticle, CmsArticleParam } from './model';
import {MODULES_API_URL} from '@/config/setting';

/**
 * 分页查询文章
 */
export async function pageCmsArticle(params: CmsArticleParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticle>>>(
    MODULES_API_URL + '/cms/cms-article/page',
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
 * 查询文章列表
 */
export async function listCmsArticle(params?: CmsArticleParam) {
  const res = await request.get<ApiResult<CmsArticle[]>>(
    MODULES_API_URL + '/cms/cms-article',
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
 * 添加文章
 */
export async function addCmsArticle(data: CmsArticle) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文章
 */
export async function updateCmsArticle(data: CmsArticle) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量修改文章
 */
export async function updateBatchCmsArticle(data: any) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article/batch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文章
 */
export async function removeCmsArticle(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文章
 */
export async function removeBatchCmsArticle(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article/batch',
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
 * 根据id查询文章
 */
export async function getCmsArticle(id: number) {
  const res = await request.get<ApiResult<CmsArticle>>(
    MODULES_API_URL + '/cms/cms-article/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function getCount(params: CmsArticleParam) {
  const res = await request.get(MODULES_API_URL + '/cms/cms-article/data', {
    params
  });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 文章批量导入
 */
export async function importArticles(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article/import',
    formData
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
