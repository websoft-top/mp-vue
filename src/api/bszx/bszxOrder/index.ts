import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import { MODULES_API_URL } from '@/config/setting';
import {ShopOrder, ShopOrderParam} from "@/api/shop/shopOrder/model";

/**
 * 分页查询百色中学-捐款记录
 */
export async function pageBszxOrder(params: ShopOrderParam) {
  const res = await request.get<ApiResult<PageResult<ShopOrder>>>(
    MODULES_API_URL + '/bszx/bszx-order/page',
    {
      params
    }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
