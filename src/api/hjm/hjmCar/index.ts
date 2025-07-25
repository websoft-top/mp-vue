import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { HjmCar, HjmCarParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询车辆管理
 */
export async function pageHjmCar(params: HjmCarParam) {
  const res = await request.get<ApiResult<PageResult<HjmCar>>>(
    MODULES_API_URL + '/hjm/hjm-car/page',
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
 * 查询车辆管理列表
 */
export async function listHjmCar(params?: HjmCarParam) {
  const res = await request.get<ApiResult<HjmCar[]>>(
    MODULES_API_URL + '/hjm/hjm-car',
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
 * 添加车辆管理
 */
export async function addHjmCar(data: HjmCar) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-car',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改车辆管理
 */
export async function updateHjmCar(data: HjmCar) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-car',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除车辆管理
 */
export async function removeHjmCar(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-car/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除车辆管理
 */
export async function removeBatchHjmCar(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-car/batch',
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
 * 根据id查询车辆管理
 */
export async function getHjmCar(id: number) {
  const res = await request.get<ApiResult<HjmCar>>(
    MODULES_API_URL + '/hjm/hjm-car/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 车辆批量导入
 */
export async function importHjmCar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/hjm/hjm-car/import',
    formData
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据code查询黄家明_车辆管理
 */
export async function getHjmCarByCode(code: string) {
  const res = await request.get<ApiResult<HjmCar>>(
    MODULES_API_URL + '/hjm/hjm-car/getByCode/' + code
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
