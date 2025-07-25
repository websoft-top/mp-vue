import type { PageParam } from '@/api';
import {HjmFence} from "@/api/hjm/hjmFence/model";

/**
 * 车辆管理
 */
export interface HjmCar {
  // 自增ID
  id?: number;
  // 车辆名称
  name?: string;
  // 车辆图片
  image?: string;
  // 类型 0汽车 1其他车
  type?: number;
  // 快递公司
  kuaidi?: string;
  // 管理负责人
  kuaidiAdmin?: string;
  // 车辆编号
  code?: string;
  // 绑定操作员
  driverId?: number;
  // 操作员名称
  driver?: string;
  // 操作员名称
  driverName?: string;
  // 操作员手机号
  driverPhone?: string;
  // 安装人员
  installerId?: number;
  // 安装时间
  installTime?: string;
  // 保险状态
  insuranceStatus?: string;
  // GPS设备编号
  gpsNo?: string;
  // 电子围栏ID
  fenceId?: number;
  // 电子围栏名称
  fenceName?: string;
  //  车辆是否在电子围栏内
  inFence?: boolean;
  // 电子围栏名称
  fence?: HjmFence;
  // 位置
  location?: string;
  // 经度
  longitude?: string,
  // 纬度
  latitude?: string,
  // 区域
  district?: string;
  // 地址
  address?: string,
  // 组织ID
  organizationId?: number;
  // 父级组织ID
  organizationParentId?: number;
  // 用户ID
  userId?: number;
  // 认领状态
  claim?: number;
  // 认领时间
  claimTime?: string;
  // 绑定用户
  toUser?: string;
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
 * 车辆管理搜索条件
 */
export interface HjmCarParam extends PageParam {
  id?: number;
  status?: number;
  organizationId?: number;
  installerId?: number;
  organizationParentId?: number;
  keywords?: string;
}
