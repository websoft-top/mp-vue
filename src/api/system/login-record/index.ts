import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { LoginRecord, LoginRecordParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询登录日志
 */
export async function pageLoginRecords(params: LoginRecordParam) {
  const res = await request.get<ApiResult<PageResult<LoginRecord>>>(
    SERVER_API_URL + '/system/login-record/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询登录日志列表
 */
export async function listLoginRecords(params?: LoginRecordParam) {
  const res = await request.get<ApiResult<LoginRecord[]>>(
    SERVER_API_URL + '/system/login-record',
    { params }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
