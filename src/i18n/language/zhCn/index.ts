import { CommonZH } from './common_zh';
import { DictZH } from './dict_zh';
import { FORM_ZH } from './form_zh';
import FORM_MAKER_ZH from './form_maker_zh';
import { OrgZH } from './org_zh';
import { ResourceZH } from './resource_zh';
import { IotManagerZH } from './iot_manager_zh';
import { IotAlarmZH } from './iot_alarm_zh';
import { ModelZH } from './modelManage_zh'
import { DatasetZH } from './dataset_zh'
export default {
  ...CommonZH,
  ...OrgZH,
  ...ResourceZH,
  ...DictZH,
  ...FORM_ZH,
  ...FORM_MAKER_ZH,
  ...IotManagerZH,
  ...IotAlarmZH,
    ...ModelZH,
    ...DatasetZH,
};
