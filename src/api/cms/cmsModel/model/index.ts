import type { PageParam } from '@/api';

/**
 * 模型
 */
export interface CmsModel {
  // ID
  modelId?: number;
  // 模型名称
  name?: string;
  // 唯一标识
  model?: string;
  // 详情页组件
  componentDetail?: string;
  // 菜单组件地址, 目录可为空
  component?: string;
  // 模型banner图片
  banner?: string;
  // 缩列图
  thumb?: string;
  // 文件后缀
  suffix?: string;
  // 封面图宽
  imageWidth?: string;
  // 封面图高
  imageHeight?: string;
  // 样式
  style?: string;
  // Banner上的标题
  title?: string;
  // Banner上的描述
  desc?: string;
  // 列表显示方式(10小图展示 20大图展示)
  showType?: number;
  // 是否禁用
  disabled?: boolean;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0已发布, 1待审核 2已驳回 3违规内容
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  label?: string;
  value?: string;
}

/**
 * 模型搜索条件
 */
export interface CmsModelParam extends PageParam {
  modelId?: number;
  keywords?: string;
}
