import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsModel, CmsModelParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询模型
 */
export async function pageCmsModel(params: CmsModelParam) {
  const res = await request.get<ApiResult<PageResult<CmsModel>>>(
    MODULES_API_URL + '/cms/cms-model/page',
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
 * 查询模型列表
 */
export async function listCmsModel(params?: CmsModelParam) {
  const res = await request.get<ApiResult<CmsModel[]>>(
    MODULES_API_URL + '/cms/cms-model',
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
 * 添加模型
 */
export async function addCmsModel(data: CmsModel) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-model',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改模型
 */
export async function updateCmsModel(data: CmsModel) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-model',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除模型
 */
export async function removeCmsModel(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-model/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除模型
 */
export async function removeBatchCmsModel(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-model/batch',
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
 * 根据id查询模型
 */
export async function getCmsModel(id: number) {
  const res = await request.get<ApiResult<CmsModel>>(
    MODULES_API_URL + '/cms/cms-model/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
