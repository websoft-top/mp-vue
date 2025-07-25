/**
 * 字典
 */
export interface Dict {
  // 字典id
  dictId?: number;
  // 字典标识
  dictCode?: string;
  // 字典名称
  dictName?: string;
  // 排序号
  sortNumber?: number;
  // 备注
  comments?: string;
  // 创建时间
  createTime?: string;
  type?: number;
  tenantId?: number;
}

/**
 * 字典搜索条件
 */
export interface DictParam {
  dictCode?: string;
  dictName?: string;
  type?: number;
  tenantId?: number;
}
