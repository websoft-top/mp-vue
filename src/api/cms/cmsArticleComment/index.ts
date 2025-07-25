import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticleComment, CmsArticleCommentParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询文章评论表
 */
export async function pageCmsArticleComment(params: CmsArticleCommentParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticleComment>>>(
    MODULES_API_URL + '/cms/cms-article-comment/page',
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
 * 查询文章评论表列表
 */
export async function listCmsArticleComment(params?: CmsArticleCommentParam) {
  const res = await request.get<ApiResult<CmsArticleComment[]>>(
    MODULES_API_URL + '/cms/cms-article-comment',
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
 * 添加文章评论表
 */
export async function addCmsArticleComment(data: CmsArticleComment) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文章评论表
 */
export async function updateCmsArticleComment(data: CmsArticleComment) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文章评论表
 */
export async function removeCmsArticleComment(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-comment/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文章评论表
 */
export async function removeBatchCmsArticleComment(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-comment/batch',
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
 * 根据id查询文章评论表
 */
export async function getCmsArticleComment(id: number) {
  const res = await request.get<ApiResult<CmsArticleComment>>(
    MODULES_API_URL + '/cms/cms-article-comment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
