import type { PageParam } from '@/api';

/**
 * 表单数据记录表
 */
export interface CmsFormRecord {
  // ID
  formRecordId?: number;
  // 手机号
  phone?: string;
  // 表单数据
  formData?: string;
  // 表单ID
  formId?: number;
  // 用户ID
  userId?: number;
  // 商户ID
  merchantId?: number;
  // 姓名
  name?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 表单数据记录表搜索条件
 */
export interface CmsFormRecordParam extends PageParam {
  formRecordId?: number;
  keywords?: string;
}
