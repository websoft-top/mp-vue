import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsTemplate, CmsTemplateParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询网站模版
 */
export async function pageCmsTemplate(params: CmsTemplateParam) {
  const res = await request.get<ApiResult<PageResult<CmsTemplate>>>(
    MODULES_API_URL + '/cms/cms-template/page',
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
 * 查询网站模版列表
 */
export async function listCmsTemplate(params?: CmsTemplateParam) {
  const res = await request.get<ApiResult<CmsTemplate[]>>(
    MODULES_API_URL + '/cms/cms-template',
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
 * 添加网站模版
 */
export async function addCmsTemplate(data: CmsTemplate) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-template',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改网站模版
 */
export async function updateCmsTemplate(data: CmsTemplate) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-template',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除网站模版
 */
export async function removeCmsTemplate(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-template/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除网站模版
 */
export async function removeBatchCmsTemplate(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-template/batch',
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
 * 根据id查询网站模版
 */
export async function getCmsTemplate(id: number) {
  const res = await request.get<ApiResult<CmsTemplate>>(
    MODULES_API_URL + '/cms/cms-template/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
