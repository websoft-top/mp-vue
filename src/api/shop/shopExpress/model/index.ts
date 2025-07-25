import type { PageParam } from '@/api';

/**
 * 物流公司
 */
export interface ShopExpress {
  // 物流公司ID
  expressId?: number;
  // 物流公司名称
  expressName?: string;
  // 物流公司编码 (微信)
  wxCode?: string;
  // 物流公司编码 (快递100)
  kuaidi100Code?: string;
  // 物流公司编码 (快递鸟)
  kdniaoCode?: string;
  // 排序号
  sortNumber?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 物流公司搜索条件
 */
export interface ShopExpressParam extends PageParam {
  expressId?: number;
  keywords?: string;
}
