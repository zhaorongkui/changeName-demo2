<!-- eslint-disable vue/no-v-html -->
<!--
* @description 组织管理
* @fileName list.vue
* @author zhangshufeng
* @date 2024/01/26 11:37:37
* @filePath src\views\system\user\list.vue
-->
<template>
  <div ref="pageRef"  class="manage-page detail-config">
    <div ref="topRef" class="page-filter">
      <advanced-search
        :form-item-list="formItemList"
        @on-search="handleFilterSearch"
        @on-reset="handleFilterReset"
      ></advanced-search>
    </div>
    <div class="data-table-container" v-loading="loading">
      <el-auto-resizer>
    <template v-if="!loading" #default="{ height, width }">
      <el-table-v2
        :data="tableData"
        :columns="columns"
        :width="tableConfig.width"
        :height="tableConfig.height"
        :expand-column-key="expandColumnKey"
        :default-expanded-row-keys="expandKey"
        row-key="orgId"
        :header-height="39"
        border
        fixed
        show-overflow-tooltip
        @expanded-rows-change="rowExpandChange"
      >
      </el-table-v2>
    </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import {ref, computed, h, onMounted} from 'vue'
// import layoutStore from '@/store/modules/layout';
import _ from 'lodash';
import { getOrgTree, updateIotStatusById } from '@/api/org';
import { ElTag, ElTooltip, type Column,ElAutoResizer,ElSwitch,ElMessage, } from 'element-plus';
import { treeToArray } from '@/utils/array_func';
import { OrgTableColumns } from './orgColumn';
import { ORG_TYPE, ORG_LEVEL, ORG_STATUS } from '@/utils/constant';
import type { SearchFormItem, ParamData } from '@/types/search';
import type { Organization, CommonColumn } from '@/types/org';
import { hasPermission } from '@/utils/hasPermission';
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import {  getStatusTree,filterTreeByValidName } from '@/utils/array_func';
// import WujieVue from 'wujie-vue3';
import { useI18n } from 'vue-i18n';

// const { bus } = WujieVue;
const { t } = useI18n();
// const layoutStores = layoutStore();
interface QueryItem {
  name: string;
  orgId: string;
  orgType: string;
  orgLevel: string | number;
  orgStatus: string;
}
// 搜索条件
const queryData = ref<QueryItem>({
  name: '',
  orgId: '',
  orgType: '',
  orgLevel: '',
  orgStatus: '',
});
// 查询
const handleFilterSearch = (data: ParamData | any) => {
  queryData.value.name = (data.name as string) || '';
  queryData.value.orgId = (data.orgId as string) || '';
  queryData.value.orgType = (data.orgType as string) || '';
  queryData.value.orgLevel = (data.orgLevel ) || '';
  queryData.value.orgStatus = (data.orgStatus as string) || '';
  initData();
};
// 重置
const handleFilterReset = () => {
  queryData.value.name = '';
  queryData.value.orgId = '';
  queryData.value.orgType = '';
  queryData.value.orgLevel = '';
  queryData.value.orgStatus = '';
  initData();
};
// 查询条件表单
const formItemList = ref<SearchFormItem[]>([
  {
    type: 'input',
    label: 'ORG_NAME',
    paramKey: 'name',
    placeholder: 'INPUT_PLACEHOLDER',
    modelValue: queryData.value.name,
  },
  {
    type: 'input',
    label: 'ORG_CODE',
    paramKey: 'orgId',
    placeholder: 'INPUT_PLACEHOLDER',
    modelValue: queryData.value.orgId,
  },
  {
    type: 'select',
    label: 'ORG_TYPE',
    paramKey: 'orgType',
    placeholder: '请选择组织类型',
    modelValue: queryData.value.orgType,
    selectOptions: ORG_TYPE.map((item) => {
      return {
        id: item.value,
        name: item.label,
      };
    }),
  },
  {
    type: 'select',
    label: 'ORG_LEVEL',
    paramKey: 'orgLevel',
    placeholder: '请选择组织层级',
    multiple: true,
    modelValue: queryData.value.orgLevel,
    selectOptions: ORG_LEVEL.map((item) => {
      return {
        id: item.value,
        name: item.label,
      };
    }),
  },
  {
    type: 'select',
    label: 'ORG_STATUS',
    paramKey: 'orgStatus',
    placeholder: '请选择组织状态',
    modelValue: queryData.value.orgStatus,
    selectOptions: ORG_STATUS.map((item) => {
      return {
        id: item.value,
        name: item.label,
      };
    }),
  },
]);
// 表格数据
const tableData = ref<Organization[]>([]);
const loading = ref(false);
const expandKey = ref<string[]>([]);
const initData = async () => {
  console.log(queryData.value.orgLevel,'queryData.value.orgLevel')
  loading.value = true;
  const { data,success } = await getOrgTree({
    orgId: queryData.value.orgId || '1',
    name: queryData.value.name || undefined,
    orgType: queryData.value.orgType || undefined,
    orgLevel: queryData.value.orgLevel || undefined,
    isLogin: '2',
  });
  const resultList = Object.keys(data)?.length ? data : [];
  if (queryData.value.orgStatus) {
    const arr: Organization[] = [];
    treeToArray(resultList, arr);
    tableData.value = arr.filter((item: Organization) => {
      delete item.children;
      if (queryData.value.orgStatus === '1') {
        return item.iotStatus === 1;
      } else {
        return item.iotStatus === 0;
      }
    });
  } else {
    tableData.value = resultList;
    expandKey.value = expandKey.value.length > 0 ? expandKey.value : [tableData.value[0]?.orgId];
  }
  loading.value = false;
};
initData();
// 列表展开状态改变
const rowExpandChange = (data) => {
  expandKey.value = data;
};

const expandColumnKey = 'name';
const tableConfig = ref({
  width: 500,
  height: 500,
});

const getOrgTreeDataFn = () => {
  getOrgTree({
    orgId: '1',
    isLogin: '2',
  }).then((res) => {
    const data = res.data || [];
    const newTreeData = ref<Organization[]>([]);
    getStatusTree(data, newTreeData.value);
    localStorage.setItem('selectListFactory', JSON.stringify(filterTreeByValidName(newTreeData.value) || []));
  });
};

const tableColumns = ref(OrgTableColumns);
const changeStatus = async (rowData) => {
  const { success, message } = await updateIotStatusById({
    orgId: rowData.orgId,
    iotStatus: rowData.iotStatus,
  });
  if (success) {
    await initData();
    getOrgTreeDataFn();
    ElMessage.success('操作成功');
    // bus.$emit('changeOrgStatus');
  } else {
    rowData.iotStatus = rowData.iotStatus === 1 ? 0 : 1;
    ElMessage.warning(message);
  }
};

// column数据
const generateColumns = (column: CommonColumn[]): Column<any>[] =>
    column.map((_) => {
      return {
        key: _.prop,
        title: t(_.lang!),
        width: _.width || 120,
        dataKey: _.prop,
        cellRenderer: ({ rowData }: any) => {
          const cellContent = (_.format && _.format(rowData)) || rowData[_.prop];

          if (['name', 'orgId', 'source'].includes(_.prop)) {
            return h(ElTooltip, {
              content: cellContent,
              'show-after': 1500
            }, () => cellContent);
          } else if (_.prop == 'orgType') {
            return h(ElTag, {
              type: rowData.orgType == 1 ? 'info' : rowData.orgType == 2 ? 'success' : undefined
            }, () => cellContent);
          } else {
            return h('div', [
              _.prop == 'iotStatus' && hasPermission('settings:org:enable')
                  ? h(ElSwitch, {
                    modelValue: rowData.iotStatus,
                    'onUpdate:modelValue': (newValue: number) => {
                      rowData.iotStatus = newValue;  // 更新数据
                      changeStatus(rowData);         // 调用 API 或其他逻辑
                    },
                    class: 'ml-2',
                    'active-value': 1,
                    'inactive-value': 0,
                    style: '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949',
                    // onClick: () => changeStatus(rowData)
                  })
                  : null,
              _.prop !== 'iotStatus' ? cellContent : ''
            ]);
          }
        },
      };
    });

const columns = computed(() => {
  const column = generateColumns(tableColumns.value);
  return column || [];
});

// 计算table高度
const pageRef = ref();
const topRef = ref();
const onResize = _.debounce(() => {
  tableConfig.value.height = pageRef.value.offsetHeight - topRef.value.offsetHeight - 75;
  tableConfig.value.width = pageRef.value.offsetWidth - 30;
}, 500);

onMounted(()=>{
  onResize()
  window.addEventListener('resize', onResize);
})

// 侧边栏展开收起重新计算表格宽度
// watch(
//   () => layoutStores.isCollapse,
//   () => {
//     onResize();
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
</script>
<style lang="scss" scoped>
@use '@/style/virtual-table.scss' as *;
@use '@/style/virtual-button.scss' as *;
@use '@/style/mainButton.scss' as *;
.manage-page {
  display: flex;
  flex-direction: column;
  .page-filter {
    padding: 0 0 0 16px;
    width: 100%;
    &-right {
      display: flex;
      margin-bottom: 18px;
    }
    :deep(.el-input),
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-input) {
      --el-input-border-color: #ffffff !important;
      --el-input-hover-border-color: #ffffff !important;
      --el-input-focus-border-color: #ffffff !important;
      width: 100%;
    }
    :deep(.el-input__wrapper) {
      border: 0px solid #ffffff;
      padding: 0px !important;
    }
  }
  :deep(.el-dropdown) {
    margin-left: 6px;
    vertical-align: middle;
    &:focus-visible {
      outline: none;
    }
  }
  :deep(.el-table-v2__right .el-table-v2__row-cell .dropdown-link) {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    &:focus-visible {
      outline: none;
    }
  }

  :deep(.el-table th.el-table__cell.is-leaf) {
    padding: 8px 0;
  }
  :deep(.el-tag--info) {
    color: $color_info;
    background-color: #f4f4f5;
    border-color: #e9e9eb;
  }
}
@media screen and (max-width: 1182px) {
  .page-filter {
    flex-direction: column;
    align-items: flex-start !important;
  }
}
.page-filter-right {
  display: flex;
  flex-direction: row;
}
</style>
