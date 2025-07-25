import { PageParam } from '@/api';

/**
 * 字典数据
 */
export interface DictionaryData {
  // 字典数据id
  dictDataId?: number;
  // 字典id
  dictId?: number;
  // 字典数据标识
  dictDataCode?: string;
  // 字典数据名称
  dictDataName?: string;
  // 预设字段(路由地址)
  path?: string;
  // 组件路径
  component?: string;
  // 排序号
  sortNumber?: number;
  // 备注
  comments?: string;
  // 创建时间
  createTime?: string;
}

/**
 * 字典数据搜索条件
 */
export interface DictionaryDataParam extends PageParam {
  // 关键字
  keywords?: string;
  // 字典标识
  dictCode?: string;
  // 字典id
  dictId?: number;
}
