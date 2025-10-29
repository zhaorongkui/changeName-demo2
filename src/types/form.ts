import { type FormItemRule } from 'element-plus';
import { type DictMapItem } from './dict.ts';

// 表单管理
export interface FormItem {
  id: number | string;
  formName: string;
  formCode: string;
  menuId: string;
  formDesc: string;
  sortNo: number;
  businessExtFieldName?: string; // 业务扩展字段名称
  customFieldName?: string;
  createdBy: string;
  updatedBy: string;
  createdTime: string;
  updatedTime: string;
}

// 定义合法的日期类型
export type IDatePickerType =
  | 'date'
  | 'year'
  | 'month'
  | 'week'
  | 'datetime'
  | 'datetimerange'
  | 'daterange'
  | 'monthrange'
  | 'yearrange';

export interface FormFieldItem {
  id: number | string;
  fieldCodeCamelCase: string;
  formCode: string; // 所属表单编码
  fieldCode: string;
  fieldName: string;
  groupId: string;
  groupName?: string;
  sortNo: number;
  fieldType: string; // 前端不用-字段类型
  fieldCategory: FieldCategoryEnum;
  fieldCategoryName: string;
  fieldDesc: string;
  nullFlag: boolean;
  mainFlag: boolean;
  fieldStatus: FieldStatusEnum;
  fieldStatusName?: string;
  formControlType: ControlType;
  formControlTypeName?: string;
  placeholder: string;
  maxLength: number;
  minLength: number;
  defaultValue?: number;
  unit: string;
  decimalDigit: number;
  maxValue?: number;
  minValue?: number;
  dictType: FieldDictType; // 字典类型
  timeType: string;
  tileFlag: boolean; // 是否平铺，YES是，NO否
  editable: boolean;
  fileNumLimit: number;
  fileFormat: string;
  fileSizeLimit: number;
  extFlag: boolean;
  formFieldFlag: boolean; // 是否表单字段
  optionalRange: string; // 可选区间
  nonOptionalRange: string; // 不可选区间
  createdBy?: string;
  updatedBy: string;
  createdTime?: string;
  updatedTime: string;
  timeRangeGroup: string;
  colspan: number;
  optionsPreview: string;
  requiredFlag: boolean; // 前端加，与nullFlag相反
  dateType?: { type: IDatePickerType; label: string; format: string };
}

export interface FormControlItem extends FormFieldItem {
  options?: OptionItem[];
  showLabelTooltip?: boolean;
  rules?: FormItemRule[];
  dateType?: any;
  disabledDate?: (date: Date) => boolean;
}

export interface FieldDictType {
  orgId: string | number;
  name: string;
}

export enum ControlType {
  input = 'INPUT_TEXT',
  textarea = 'TEXTAREA',
  number = 'INPUT_NUMBER',
  money = 'INPUT_CURRENCY',
  checkbox = 'CHECKBOX',
  radio = 'RADIO',
  dateRange = 'INPUT_DATE_RANGE',
  date = 'INPUT_DATE',
  upload = 'UPLOAD_ATTACHMENT',
  uploadImage = 'UPLOAD_IMAGE',
  cascader = 'MULTILEVEL_LINKAGE',
  organization = 'ORGANIZATIONAL_STRUCTURE_TREE',
}

export enum FieldCategoryEnum {
  SystemField = 0,
  BusinessField = 1,
  CustomField = 2,
}

export enum FieldStatusEnum {
  Disabled = 0,
  Normal = 1,
}

export enum BooleanEnum {
  true = 'yes',
  false = 'no',
}

export interface FieldsGroup {
  id: number;
  sortNo: number;
  formCode: string;
  groupId: string;
  groupName: string;
  colspan?: number;
}

export interface FormGroupFields extends FieldsGroup {
  fields: FormFieldItem[];
}

export interface FieldControlItem {
  type: string;
  name: string;
  group: string;
  maxLength?: number;
}

export interface FieldControlData {
  BASIC_CONTROL: FieldControlItem[];
  ADVANCED_CONTROL: FieldControlItem[];
}

export type FormOptionType = 'getGroup' | 'getDictTypes';
export type FormDictType = 'TIME_SELECT_TYPE' | 'OPTIONAL_TIME_RANGE' | 'CURRENCY_UNIT' | 'NON_OPTIONAL_TIME_RANGE';

export interface FormItemData {
  type: 'input' | 'number' | 'select' | 'checkbox' | ['checkbox', 'number' | 'text'] | 'textarea';
  label: string;
  prop: keyof FormFieldItem;
  required?: boolean;
  placeholder?: string;
  max?: number;
  min?: number;
  precision?: number;
  options?: OptionItem[];
  optionsType?: FormOptionType; // 作为获取options系列方法的key
  previewOptions?: boolean; // 是否预览选择后的内容
  dictOptionsType?: FormDictType;
  disabled?: boolean;
  getDisabled?: () => boolean;
  key?: string; // select的value-key
  isShow?: (data: any) => boolean;
  rules?: FormItemRule | FormItemRule[];
  prefix?: string;
  default?: number;
  checkBoxStatus?: boolean; //用来控制勾选后，显示输入框
}

export type FormDictsData = {
  [key in FormDictType]: DictMapItem[];
};
