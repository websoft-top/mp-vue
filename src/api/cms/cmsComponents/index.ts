import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsComponents, CmsComponentsParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询组件
 */
export async function pageCmsComponents(params: CmsComponentsParam) {
  const res = await request.get<ApiResult<PageResult<CmsComponents>>>(
    MODULES_API_URL + '/cms/cms-components/page',
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
 * 查询组件列表
 */
export async function listCmsComponents(params?: CmsComponentsParam) {
  const res = await request.get<ApiResult<CmsComponents[]>>(
    MODULES_API_URL + '/cms/cms-components',
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
 * 添加组件
 */
export async function addCmsComponents(data: CmsComponents) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-components',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改组件
 */
export async function updateCmsComponents(data: CmsComponents) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-components',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除组件
 */
export async function removeCmsComponents(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-components/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除组件
 */
export async function removeBatchCmsComponents(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-components/batch',
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
 * 根据id查询组件
 */
export async function getCmsComponents(id: number) {
  const res = await request.get<ApiResult<CmsComponents>>(
    MODULES_API_URL + '/cms/cms-components/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
