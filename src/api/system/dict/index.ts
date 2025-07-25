import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { Dict, DictParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询字典列表
 */
export async function listDictionaries(params?: DictParam) {
  const res = await request.get<ApiResult<Dict[]>>(
    SERVER_API_URL + '/system/dict',
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
 * 添加字典
 */
export async function addDict(data: Dict) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改字典
 */
export async function updateDict(data: Dict) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除字典
 */
export async function removeDict(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
