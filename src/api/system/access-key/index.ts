import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { AccessKey, AccessKeyParam } from './model';
import { PageResult } from '@/api';
import { SERVER_API_URL } from '@/config/setting';
/**
 * 查询AccessKey列表
 */
export async function pageAccessKey(params: AccessKeyParam) {
  const res = await request.get<ApiResult<PageResult<AccessKey>>>(
    SERVER_API_URL + '/system/access-key/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加AccessKey
 */
export async function addAccessKey(data: AccessKey) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/access-key',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改AccessKey
 */
export async function updateAccessKey(data: AccessKey) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/access-key',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除AccessKey
 */
export async function removeAccessKey(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/access-key/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
