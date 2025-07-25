import { PageParam } from '@/api';

/**
 * 字典数据
 */
export interface DictData {
  // 字典数据id
  dictDataId?: number;
  // 字典id
  dictId?: number;
  // 字典名称
  dictName?: string;
  // 字典数据标识
  dictDataCode?: string;
  // 字典数据名称
  dictDataName?: string;
  // 预设字段(路由地址)
  path?: string;
  // 预设字段(组件路径)
  component?: string;
  // 字典标识
  dictCode?: string;
  // 排序号
  sortNumber?: any;
  // 备注
  comments?: string;
  // 创建时间
  createTime?: string;
  tenantId?: number;
  label?: string;
  value?: number;
}

/**
 * 字典数据搜索条件
 */
export interface DictDataParam extends PageParam {
  // 关键字
  keywords?: string;
  // 字典标识
  dictCode?: string;
  // 字典id
  dictId?: number;
  //
  value?: number;
  //
  label?: string;
  dictDataId?: number;
}
