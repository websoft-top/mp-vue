import type { PageParam } from '@/api';

/**
 * 网站信息记录表
 */
export interface Website {
  // 站点ID
  websiteId?: number;
  // 网站名称
  websiteName?: string;
  // 网站标识
  websiteCode?: string;
  // 网站LOGO
  websiteIcon?: string;
  // 网站LOGO
  websiteLogo?: string;
  // 网站LOGO(深色模式)
  websiteDarkLogo?: string;
  // 网站类型
  websiteType?: string;
  // 网站关键词
  keywords?: string;
  // 域名前缀
  prefix?: string;
  // 绑定域名
  domain?: string;
  // 全局样式
  style?: string;
  // 后台管理地址
  adminUrl?: string;
  // 应用版本 10免费版 20专业版 30永久授权
  version?: number;
  // 服务到期时间
  expirationTime?: string;
  // 模版ID
  templateId?: number;
  // 行业类型(父级)
  industryParent?: string;
  // 行业类型(子级)
  industryChild?: string;
  // 企业ID
  companyId?: number;
  // 所在国家
  country?: string;
  // 所在省份
  province?: string;
  // 所在城市
  city?: string;
  // 所在辖区
  region?: string;
  // 经度
  longitude?: string;
  // 纬度
  latitude?: string;
  // 街道地址
  address?: string;
  // 联系电话
  phone?: string;
  // 电子邮箱
  email?: string;
  // ICP备案号
  icpNo?: string;
  // 公安备案
  policeNo?: string;
  // 备注
  comments?: string;
  // 是否推荐
  recommend?: number;
  // 状态 0未开通 1运行中 2维护中 3已关闭 4已欠费停机 5违规关停
  status?: number;
  // 维护说明
  statusText?: string;
  // 关闭说明
  statusClose?: string;
  // 全局样式
  styles?: string;
  // 排序号
  sortNumber?: number;
  // 用户ID
  userId?: number;
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
 * 网站信息记录表搜索条件
 */
export interface WebsiteParam extends PageParam {
  websiteId?: number;
  keywords?: string;
}
