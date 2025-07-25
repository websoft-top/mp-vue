import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type {CmsWebsiteField, CmsWebsiteFieldParam, Config} from './model';
import {MODULES_API_URL, TEMPLATE_ID} from '@/config/setting';

/**
 * 分页查询应用参数
 */
export async function pageCmsWebsiteField(params: CmsWebsiteFieldParam) {
  const res = await request.get<ApiResult<PageResult<CmsWebsiteField>>>(
    MODULES_API_URL + '/cms/cms-website-field/page',
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
 * 查询应用参数列表
 */
export async function listCmsWebsiteField(params?: CmsWebsiteFieldParam) {
  const res = await request.get<ApiResult<CmsWebsiteField[]>>(
    MODULES_API_URL + '/cms/cms-website-field',
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
 * 添加应用参数
 */
export async function addCmsWebsiteField(data: CmsWebsiteField) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用参数
 */
export async function updateCmsWebsiteField(data: CmsWebsiteField) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用参数
 */
export async function removeCmsWebsiteField(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-field/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用参数
 */
export async function removeBatchCmsWebsiteField(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-website-field/batch',
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
 * 根据id查询应用参数
 */
export async function getCmsWebsiteField(id: number) {
  const res = await request.get<ApiResult<CmsWebsiteField>>(
    MODULES_API_URL + '/cms/cms-website-field/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 恢复项目参数
 */
export async function undeleteWebsiteField(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/website-field/undelete/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}


/**
 * 查询项目参数列表
 */
export async function configWebsiteField(params?: CmsWebsiteFieldParam) {
  const res = await request.get<ApiResult<Config>>(
    MODULES_API_URL + '/cms/cms-website-field/config',
    {
      params,
      headers: {
        TenantId: TEMPLATE_ID
      }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
