import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxPayRanking, BszxPayRankingParam } from './model';
import { MODULES_API_URL } from '@/config/setting';
import {BszxClass, BszxClassParam} from "@/api/bszx/bszxClass/model";

/**
 * 分页查询百色中学-捐款排行
 */
export async function pageBszxPayRanking(params: BszxPayRankingParam) {
  const res = await request.get<ApiResult<PageResult<BszxPayRanking>>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/page',
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
 * 查询百色中学-捐款排行列表
 */
export async function listBszxPayRanking(params?: BszxPayRankingParam) {
  const res = await request.get<ApiResult<BszxPayRanking[]>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function ranking(params?: BszxPayRankingParam) {
  const res = await request.get<ApiResult<BszxPayRanking[]>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/ranking',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function ranking2(params?: BszxClassParam) {
  const res = await request.get<ApiResult<BszxClass[]>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/ranking2',
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
 * 添加百色中学-捐款排行
 */
export async function addBszxPayRanking(data: BszxPayRanking) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-捐款排行
 */
export async function updateBszxPayRanking(data: BszxPayRanking) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-捐款排行
 */
export async function removeBszxPayRanking(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-捐款排行
 */
export async function removeBatchBszxPayRanking(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/batch',
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
 * 根据id查询百色中学-捐款排行
 */
export async function getBszxPayRanking(id: number) {
  const res = await request.get<ApiResult<BszxPayRanking>>(
    MODULES_API_URL + '/bszx/bszx-pay-ranking/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
