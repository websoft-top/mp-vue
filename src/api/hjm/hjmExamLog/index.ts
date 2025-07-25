import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmExamLog, HjmExamLogParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询黄家明_学习记录
 */
export async function pageHjmExamLog(params: HjmExamLogParam) {
  const res = await request.get<ApiResult<PageResult<HjmExamLog>>>(
    MODULES_API_URL + '/hjm/hjm-exam-log/page',
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
 * 查询黄家明_学习记录列表
 */
export async function listHjmExamLog(params?: HjmExamLogParam) {
  const res = await request.get<ApiResult<HjmExamLog[]>>(
    MODULES_API_URL + '/hjm/hjm-exam-log',
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
 * 添加黄家明_学习记录
 */
export async function addHjmExamLog(data: HjmExamLog) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-exam-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改黄家明_学习记录
 */
export async function updateHjmExamLog(data: HjmExamLog) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-exam-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除黄家明_学习记录
 */
export async function removeHjmExamLog(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-exam-log/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除黄家明_学习记录
 */
export async function removeBatchHjmExamLog(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-exam-log/batch',
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
 * 根据id查询黄家明_学习记录
 */
export async function getHjmExamLog(id: number) {
  const res = await request.get<ApiResult<HjmExamLog>>(
    MODULES_API_URL + '/hjm/hjm-exam-log/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
