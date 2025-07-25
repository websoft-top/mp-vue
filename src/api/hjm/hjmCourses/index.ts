import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmCourses, HjmCoursesParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询课程
 */
export async function pageHjmCourses(params: HjmCoursesParam) {
  const res = await request.get<ApiResult<PageResult<HjmCourses>>>(
    MODULES_API_URL + '/hjm/hjm-courses/page',
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
 * 查询课程列表
 */
export async function listHjmCourses(params?: HjmCoursesParam) {
  const res = await request.get<ApiResult<HjmCourses[]>>(
    MODULES_API_URL + '/hjm/hjm-courses',
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
 * 添加课程
 */
export async function addHjmCourses(data: HjmCourses) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-courses',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改课程
 */
export async function updateHjmCourses(data: HjmCourses) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-courses',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除课程
 */
export async function removeHjmCourses(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-courses/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除课程
 */
export async function removeBatchHjmCourses(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-courses/batch',
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
 * 根据id查询课程
 */
export async function getHjmCourses(id: number) {
  const res = await request.get<ApiResult<HjmCourses>>(
    MODULES_API_URL + '/hjm/hjm-courses/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
