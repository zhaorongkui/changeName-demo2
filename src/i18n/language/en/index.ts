import { CommonEN } from './common_en';
import { DictEN } from './dict_en';
import { FORM_EN } from './form_en';
import FORM_MAKER_EN from './form_maker_en';
import { OrgEN } from './org_en';
import { ResourceEN } from './resource_en';
import { IotManagerEN } from './iot_manager_en';
import { IotAlarmEN } from './iot_alarm_en';
import {ModelEN} from './modelManage_en'
import {DatasetEN} from './dataset_en'
export default {
  ...CommonEN,
  ...OrgEN,
  ...ResourceEN,
  ...DictEN,
  ...FORM_EN,
  ...FORM_MAKER_EN,
  ...IotManagerEN,
  ...IotAlarmEN,
    ...ModelEN,
    ...DatasetEN,
};
