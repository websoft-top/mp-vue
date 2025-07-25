import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsForm, CmsFormParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询表单设计表
 */
export async function pageCmsForm(params: CmsFormParam) {
  const res = await request.get<ApiResult<PageResult<CmsForm>>>(
    MODULES_API_URL + '/cms/cms-form/page',
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
 * 查询表单设计表列表
 */
export async function listCmsForm(params?: CmsFormParam) {
  const res = await request.get<ApiResult<CmsForm[]>>(
    MODULES_API_URL + '/cms/cms-form',
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
 * 添加表单设计表
 */
export async function addCmsForm(data: CmsForm) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改表单设计表
 */
export async function updateCmsForm(data: CmsForm) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除表单设计表
 */
export async function removeCmsForm(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除表单设计表
 */
export async function removeBatchCmsForm(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form/batch',
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
 * 根据id查询表单设计表
 */
export async function getCmsForm(id: number) {
  const res = await request.get<ApiResult<CmsForm>>(
    MODULES_API_URL + '/cms/cms-form/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
