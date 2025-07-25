import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmQuestions, HjmQuestionsParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询题目
 */
export async function pageHjmQuestions(params: HjmQuestionsParam) {
  const res = await request.get<ApiResult<PageResult<HjmQuestions>>>(
    MODULES_API_URL + '/hjm/hjm-questions/page',
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
 * 查询题目列表
 */
export async function listHjmQuestions(params?: HjmQuestionsParam) {
  const res = await request.get<ApiResult<HjmQuestions[]>>(
    MODULES_API_URL + '/hjm/hjm-questions',
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
 * 添加题目
 */
export async function addHjmQuestions(data: HjmQuestions) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-questions',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改题目
 */
export async function updateHjmQuestions(data: HjmQuestions) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-questions',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除题目
 */
export async function removeHjmQuestions(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-questions/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除题目
 */
export async function removeBatchHjmQuestions(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-questions/batch',
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
 * 根据id查询题目
 */
export async function getHjmQuestions(id: number) {
  const res = await request.get<ApiResult<HjmQuestions>>(
    MODULES_API_URL + '/hjm/hjm-questions/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
