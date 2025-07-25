import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsSpec, CmsSpecParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询规格
 */
export async function pageCmsSpec(params: CmsSpecParam) {
  const res = await request.get<ApiResult<PageResult<CmsSpec>>>(
    MODULES_API_URL + '/cms/cms-spec/page',
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
 * 查询规格列表
 */
export async function listCmsSpec(params?: CmsSpecParam) {
  const res = await request.get<ApiResult<CmsSpec[]>>(
    MODULES_API_URL + '/cms/cms-spec',
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
 * 添加规格
 */
export async function addCmsSpec(data: CmsSpec) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改规格
 */
export async function updateCmsSpec(data: CmsSpec) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除规格
 */
export async function removeCmsSpec(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除规格
 */
export async function removeBatchCmsSpec(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-spec/batch',
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
 * 根据id查询规格
 */
export async function getCmsSpec(id: number) {
  const res = await request.get<ApiResult<CmsSpec>>(
    MODULES_API_URL + '/cms/cms-spec/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
