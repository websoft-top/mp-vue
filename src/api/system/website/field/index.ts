import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type {
  Config,
  WebsiteField,
  WebsiteFieldParam
} from '@/api/system/website/field/model';
import {SERVER_API_URL, TEMPLATE_ID} from '@/config/setting';

/**
 * 分页查询项目参数
 */
export async function pageWebsiteField(params: WebsiteFieldParam) {
  const res = await request.get<ApiResult<PageResult<WebsiteField>>>(
    SERVER_API_URL + '/system/website-field/page',
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
 * 查询项目参数列表
 */
export async function listWebsiteField(params?: WebsiteFieldParam) {
  const res = await request.get<ApiResult<WebsiteField[]>>(
    SERVER_API_URL + '/system/website-field',
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
 * 根据id查询项目参数
 */
export async function getWebsiteField(id: number) {
  const res = await request.get<ApiResult<WebsiteField>>(
    SERVER_API_URL + '/system/website-field/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加项目参数
 */
export async function addWebsiteField(data: WebsiteField) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改项目参数
 */
export async function updateWebsiteField(data: WebsiteField) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除项目参数
 */
export async function removeWebsiteField(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website-field/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除项目参数
 */
export async function removeBatchWebsiteField(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website-field/batch',
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
 * 检查IP是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/website-field/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询项目参数列表
 */
export async function configWebsiteField(params?: WebsiteFieldParam) {
  const res = await request.get<ApiResult<Config>>(
    'https://cms-api.websoft.top/api/cms/cms-website-field/config',
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

/**
 * 恢复项目参数
 */
export async function undeleteWebsiteField(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/cms/website-field/undelete/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
