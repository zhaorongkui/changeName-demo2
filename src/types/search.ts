/*
 * @Description: 多条件查询组件类型
 */
import type { IDatePickerType } from './form';
export interface SearchFormItem {
  type: string; //类型，输入框，下拉选择
  label: string; //el-form-item label 显示名称
  iLabel?: string; //el-form-item label 显示名称,不使用i18n时使用
  paramKey: string; //变量名称,唯一,对应原有的v-mode的参数名字,
  dateType?: IDatePickerType; //type为date时用到，数据类型
  placeholder?: string; //提示信息
  modelValue?: string | number | boolean | null | Array<any>; //双向绑定数据
  code?: string; //dictionary-select组件需要code,其他可不填,区分是那个字典,dictionary-select中通过code区分数据源的获取
  selectOptions?: SelectOptionItem[] | null; //select组件,options下拉列表,必须传入id和name,组件中通过id和name展示
  isSlot?: boolean; //是否插槽,组件通过插槽的方式,直接兼容原有的查询组件和逻辑方法
  multiple?: boolean;
  dateFormat?: string;
  dateValueFormat?: string;
  clear?: boolean;
  change?: any;
}

export interface SelectOptionItem {
  id: number | string | boolean;
  name: string;
  [keys: string]: number | string | boolean | null;
}
export interface SearchFormRow {
  index: number;
  children: SearchFormItem[];
}
export interface ParamData {
  [key1: string]: string | number | boolean | undefined | null;
}
