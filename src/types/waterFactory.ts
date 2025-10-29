import type { User } from '@/types/org';
export interface FactoryQueryParams {
  factoryName?: string;
  factoryCode?: string;
  factoryStartTime?: string;
  startTime?: string;
  endTime?: string;
  factoryStatus?: FactoryStatusEnum;
  factoryType?: FactoryTypeEnum;
  factoryShortName?: string;
  parentOrgCode?: string[]; // 所属组织编码
  completeInfoStatus?: CompleteStatusEnum;
  region?: RegionInfo;
  businessExtFields?: any; // 业务扩展字段查询条件
  customFields?: any; // 自定义查询字段
  coverArea?: NumberScope;
  operationScalePeriod?: TimeScope;
}

export interface RegionInfo {
  provinceCode: string;
  cityCode: string;
  countyCode: string;
}

export interface RegionDesc extends RegionInfo {
  cityName: string;
  countyName: string;
  provinceName: string;
}

export interface NumberScope {
  min: number;
  max: number;
}

export interface TimeScope {
  start: string; // yyyy-MM-dd HH:mm:ss
  end: string;
}
export interface FactoryBaseInfo {
  id?: number; //主建
  factoryCode: string; //水厂编码
  factoryName: string; //水厂名称
  factoryShortName: string; //水厂简称
  parentOrgCode: string; //所属上级组织编码
  parentOrgName?: string; //所属上级组织名称
  factoryManager: User[]; //水厂总负责人
  status: number; //状态，1：启用，2：停用
  notify?: number | null; //消息通知
  notifyPerson?: User[]; //通知人
}
export interface FactoryItem extends FactoryBaseInfo {
  factorySerialNo: string; //水厂序号
  areaLevel: number; //行政区域分级
  factoryType: FactoryTypeEnum; //水厂类型
  region: RegionDesc; //所在区域
  factoryAddress: string; //详细地址
  latitude: number; //纬度
  longitude: number; //经度
  coverArea: number; //占地面积, 单位：万㎡
  dailyWaterVolume: number; //日处理水量, 单位：万m³/d
  serviceArea: number; //服务面积, 单位：万㎡
  servicePopulation: number; //服务人口, 单位：万人
  factoryDesc: string; //厂区简介
  entrustOperateType: number; //是否委托运营，0否，1是
  operationResidenceTime: string; //运营驻厂时间
  businessOperationStartTime: string; //转入商运时间
  businessOperationEndTime: string; //退出商运时间
  operationScale: number; //运营规模, 单位：万m³/d
  operationScalePeriod: TimeScope; // 运营规模有效期
  planningScale: number; //规划规模, 单位：万m³/d
  constructionScale: number; //建设规模, 单位：万m³/d
  contractScale: number; //合同规模, 单位：万m³/d
  contractPeriod: number; //合同期限, 单位：年
  pipeNetworkLength: number; //水厂维护管网长度, 单位：km
  shareholdingPercentage: number; //持股比例, 单位：%
  headCount: number; //编制人数, 单位：人
  actualCount: number; //实际人数, 单位：人
  actualProductionCount: number; //实际生产人员数量, 单位：人
  actualManagementCount: number; //实际管理人员数量, 单位：人
  completeInfoStatus: CompleteStatusEnum; //完善信息状态，0待完善，1已完善
  businessExtFields: {
    //业务扩展字段
    [key: string]: any;
  };
  customFields: {
    // 自定义字段集合
    [key: string]: any;
  };
  updatedTime: string; //更新时间
  updatedBy: string; //更新人
}

export enum FactoryTypeEnum {
  Sewage = 1,
}

export enum CompleteStatusEnum {
  // 完善信息状态，0待完善，1已完善, 为空时查询全部
  INCOMPLETE = 0,
  COMPLETE = 1,
}
export enum FactoryStatusEnum {
  // 水厂状态 0 停用  1 启用
  DISABLED = '0',
  ENABLED = '1',
  All = '',
}
export interface RegionDetail {
  regionCode: string;
  regionName: string;
  parentCode: string;
  regionLevel: number;
  regionLevelName: string;
}
