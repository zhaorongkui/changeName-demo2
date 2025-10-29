import { EnumValue } from '@/utils/enum';
import { ORG_LEVEL, ORG_TYPE, ORG_SOURCE, DEPT_TYPE } from '@/utils/constant';
import type { Organization, CommonColumn } from '@/types/org';

export const OrgTableColumns: CommonColumn[] = [
  {
    prop: 'name',
    label: '组织名称',
    lang: 'ORG_NAME',
    width: 200,
  },
  {
    prop: 'orgId',
    label: '组织编码',
    lang: 'ORG_CODE',
  },
  {
    prop: 'thirdPartyUserCnt',
    label: '第三方编码',
    lang: 'THIRD_CODE',
  },
  {
    prop: 'orgType',
    label: '组织类型',
    lang: 'ORG_TYPE',
    format: (row: Organization) => {
      return EnumValue.getLabelByValue(ORG_TYPE, row.orgType!);
    },
  },
  {
    prop: 'depth',
    label: '组织层级',
    lang: 'ORG_LEVEL',
    width: 120,
    format: (row: Organization) => {
      return EnumValue.getLabelByValue(ORG_LEVEL, row.orgLevel!) || '-';
    },
  },
  {
    prop: 'deptType',
    label: '部门类型',
    lang: 'DEPART_TYPE',
    width: 120,
    format: (row: Organization) => {
      return EnumValue.getLabelByValue(DEPT_TYPE, row.deptType!) || '-';
    },
  },
  {
    prop: 'source',
    label: '来源',
    lang: 'SOURCE',
    width: 180,
    format: (row: Organization) => {
      return EnumValue.getLabelByValue(ORG_SOURCE, row.source!);
    },
  },
  {
    prop: 'createdBy',
    label: '创建人',
    lang: 'CREATOR',
    width: 180,
    format: (row: Organization) => {
      return row.createdBy || '-';
    },
  },
  {
    prop: 'updatedAt',
    label: '更新时间',
    lang: 'UPDATE_TIME',
    width: 150,
  },
  {
    prop: 'iotStatus',
    label: '组织状态',
    lang: 'ORG_STATUS',
    width: 150,
  },
];
