<template>
<!--  操作日志-->
  <div ref="pageRef" class="login-log  detail-config">
    <div ref="topRef" class="log-filter common-filter">
      <advanced-search :form-item-list="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset">
        <template #rangeDate>
          <el-date-picker
              v-model="filterData.rangeDate"
              type="daterange"
              :start-placeholder="t('DATE_PICKER_START_PLACEHOLDER')"
              :end-placeholder="t('DATE_PICKER_END_PLACEHOLDER')"
              clearable
          />
        </template>
        <template #btnBox>
          <el-button  :disabled="exportBtnStatus" @click="exportLogs"
          ><el-icon size="20"><Download /></el-icon>{{ t('EXPORT') }}</el-button
          >
        </template>
      </advanced-search>
    </div>
    <div class="data-table-container" v-loading="loading">
      <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig" />
    </div>
    <be-pager
        v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize"
        :total="tableConfig.paginationConfig.total"
        :list="tableData"
        :page-sizes="TABLE_LIST_PAGE_RANGE"
        @callback="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import _ from 'lodash';
import { Download } from '@element-plus/icons-vue';
import { saveFile } from '@/utils/fileDownload';
import { getOperationLogs, exportOperatLogs } from '@/api/order';
import AdvancedSearch from '@/components/AdvancedSearch/index.vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
const { t } = useI18n();
const loading = ref(false)
const pageRef = ref();
const topRef = ref();
const tableData = ref([]);
const filterData = ref({
  userKeyword: '',
  rangeDate: [],
});
// 查询条件表单
const formItemList = ref([
  {
    type: 'input',
    label: t('LOG_ACCOUNT'),
    paramKey: 'userKeyword',
    placeholder: t('LOG_LOGIN_PLACEHOLDER'),
    modelValue: filterData.value.userKeyword,
  },
  {
    type: 'datapicker',
    label: t('LOG_OPERATE_DATE'),
    paramKey: 'rangeDate',
    modelValue: filterData.value.rangeDate,
    isSlot: true,
  },
]);
const handleFilterSearch = (data) => {
  filterData.value.userKeyword = (data.userKeyword as string) || '';
  tableConfig.value.paginationConfig.currentPage = 1;
  getOperationLogsData();
};

const handleFilterReset = () => {
  filterData.value = {
    userKeyword: '',
    rangeDate: [],
  };
  getOperationLogsData();
};

const tableConfig = ref({
  settingTable: false,
  tableId: 'loginlog_list',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },
  rowKey: 'orderId',
});

const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: t('INDEX'),
    align: 'center',
    width: 70,
  },
  {
    prop: 'username', //登录账号
    label: t('LOG_ACCOUNT'),
    minWidth: 100,
  },
  {
    prop: 'name', //用户名称
    label: t('LOG_USER_NAME'),
    minWidth: 120,
  },
  {
    prop: 'mobile', //手机号
    label: t('LOG_PHONE_NUMBER'),
    minWidth: 100,
  },
  {
    prop: 'ipAddress', //IP地址
    label: t('LOG_IP_ADDRESS'),
    minWidth: 120,
  },
  {
    prop: 'os', //操作系统
    label: t('LOG_OS'),
    minWidth: 120,
  },
  {
    prop: 'browser', //浏览器
    label: t('LOG_BROWSER'),
    minWidth: 120,
  },
  {
    prop: 'target', //访问路径
    label: t('LOG_VISITE_PATH'),
    minWidth: 120,
  },
  {
    prop: 'action', //动作
    label: t('LOG_ACTION'),
    minWidth: 120,
  },
  {
    prop: 'data', //相关数据
    label: t('LOG_DATA'),
    minWidth: 120,
  },
  {
    prop: 'eventTime', //操作时间
    label: t('LOG_EVENT_TIME'),
    minWidth: 120,
  },
  {
    prop: 'result', //操作结果
    label: t('LOG_RESUILT'),
    minWidth: 100,
  },
  {
    prop: 'remark',
    label: t('LOG_REMARK'),
    minWidth: 140,
  },
];

const getOperationLogsData = async () => {
  loading.value = true
  const { data } = await getOperationLogs({
    userKeyword: filterData.value.userKeyword,
    product: 'ailab',
    startDate:
        filterData.value.rangeDate && filterData.value.rangeDate[0]
            ? dayjs(filterData.value.rangeDate[0]).format('YYYY-MM-DD')
            : '',
    endDate:
        filterData.value.rangeDate && filterData.value.rangeDate[1]
            ? dayjs(filterData.value.rangeDate[1]).format('YYYY-MM-DD')
            : '',
    currPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
  });
  // console.log(data);
  tableData.value = data.records || [];
  tableConfig.value.paginationConfig.total = data.total;
  loading.value = false
};
getOperationLogsData();

const exportBtnStatus = ref(false);
const exportLogs = () => {
  exportBtnStatus.value = true;
  exportOperatLogs({
    userKeyword: filterData.value.userKeyword || undefined,
    product: 'ailab',
    actionResult: '',
    startDate:
        filterData.value.rangeDate && filterData.value.rangeDate[0]
            ? dayjs(filterData.value.rangeDate[0]).format('YYYY-MM-DD')
            : undefined,
    endDate:
        filterData.value.rangeDate && filterData.value.rangeDate[1]
            ? dayjs(filterData.value.rangeDate[1]).format('YYYY-MM-DD')
            : undefined,
    currPage: 1,
    pageSize: 99999,
  })
      .then((res) => {
        console.log('res', res);
        saveFile(res,'操作日志.xlsx');
      })
      .catch((res) => {
        saveFile(res,'操作日志.xlsx');
      })
      .finally(() => {
        exportBtnStatus.value = false;
      });
};

const handlePageChange = () => {
  getOperationLogsData();
};

const tableHeight = ref();

const onResize = _.debounce(() => {
  tableHeight.value = pageRef.value.offsetHeight - topRef.value.offsetHeight - 66;
  tableConfig.value.height = `${tableHeight.value}px`;
}, 500);

// // 侧边栏展开收起重新计算表格宽度
// watch(
//     () => layoutStore().isCollapse,
//     () => {
//       onResize();
//     },
//     { immediate: true }
// );
</script>

<style lang="scss" scoped>
@use '@/style/mainButton.scss';
@use '@/style/common-filter.scss';
.login-log {
  display: flex;
  flex-direction: column;
  .log-filter {
    width: 100%;
    flex-shrink: 1;
    display: flex;
    align-items: end;
    justify-content: space-between;
    &-export {
      color: $mainContentText;
      margin-bottom: $mainPadding;
    }
  }
}
:deep(.is-dark){
  max-width: 50%;
}
</style>
