import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { OperationRecord, OperationRecordParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询操作日志
 */
export async function pageOperationRecords(params: OperationRecordParam) {
  const res = await request.get<ApiResult<PageResult<OperationRecord>>>(
    SERVER_API_URL + '/system/operation-record/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询操作日志列表
 */
export async function listOperationRecords(params?: OperationRecordParam) {
  const res = await request.get<ApiResult<OperationRecord[]>>(
    SERVER_API_URL + '/system/operation-record',
    { params }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
