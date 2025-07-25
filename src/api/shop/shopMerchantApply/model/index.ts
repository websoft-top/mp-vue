import type { PageParam } from '@/api';

/**
 * 商户入驻申请
 */
export interface ShopMerchantApply {
  // ID
  applyId?: number;
  // 类型
  type?: number;
  // 主体名称
  merchantName?: string;
  // 证件号码
  merchantCode?: string;
  // 商户图标
  image?: string;
  // 商户手机号
  phone?: string;
  // 商户姓名
  realName?: string;
  // 身份证号码
  idCard?: string;
  // 店铺类型
  shopType?: string;
  // 商户分类
  category?: string;
  // 手续费
  commission?: string;
  // 关键字
  keywords?: string;
  // 营业执照
  yyzz?: string;
  // 身份证正面
  sfz1?: string;
  // 身份证反面
  sfz2?: string;
  // 资质图片
  files?: string;
  // 所有人
  userId?: number;
  // 是否自营
  ownStore?: number;
  // 是否推荐
  recommend?: number;
  // 是否需要审核
  goodsReview?: number;
  // 工作负责人
  name2?: string;
  // 驳回原因
  reason?: string;
  // 备注
  comments?: string;
  // 状态
  status?: number;
  // 排序号
  sortNumber?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 商户入驻申请搜索条件
 */
export interface ShopMerchantApplyParam extends PageParam {
  applyId?: number;
  userId?: number;
  shopType?: string;
  phone?: string;
  keywords?: string;
}
