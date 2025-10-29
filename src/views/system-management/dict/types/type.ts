/*
 * @Description: 数据字典 类型集合
 */
export interface dataDictionaryModel {
  id: number;
  displayName: string;
  name: string;
  valueProviderType: enumModel;
  valueProvider: string;
  remark: string;
  state?: enumModel;
  source?: enumModel;
}
export interface enumModel {
  code: string | number;
  name: string;
}
