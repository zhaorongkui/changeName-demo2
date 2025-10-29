<template>
<!--  登录日志-->
  <div ref="pageRef" v-resize="onResize" class="main-page detail-config">
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
          <el-button   @click="exportLogs" :loading="isLoading"
          ><el-icon size="20"><Download /></el-icon>{{ t('EXPORT') }}</el-button
          >
        </template>
      </advanced-search>
    </div>
    <div class="data-table-container" v-loading="loading">
      <be-table
          :is-lock="false"
          :table-data="tableData"
          :columns="tableColumns"
          :options="tableConfig"
      />
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
import { computed, ref, watch } from 'vue';
import _ from 'lodash';
import { Download } from '@element-plus/icons-vue';
import { saveFile } from '@/utils/fileDownload';
import { exportLoginLogs, getLoginLogs } from '@/api/order';
import dayjs from 'dayjs';
import AdvancedSearch from '@/components/AdvancedSearch/index.vue';
import { useI18n } from 'vue-i18n';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
import {ElMessage} from "element-plus";
const { t } = useI18n();
const loading = ref(false)
const pageRef = ref();
const topRef = ref();
const tableData = ref([]);
const isLoading = ref(false)
const filterData = ref({
  userKeyword: '',
  rangeDate: [],
});

const handleFilterSearch = (data) => {
  filterData.value.userKeyword = (data.userKeyword as string) || '';
  tableConfig.value.paginationConfig.currentPage = 1;
  getLoginLogsData();
};

const handleFilterReset = () => {
  filterData.value = {
    userKeyword: '',
    rangeDate: [],
  };
  getLoginLogsData();
};

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

const tableColumns = computed(() => [
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
    minWidth: 120,
  },
  {
    prop: 'action', //操作类型
    label: t('LOG_OPERATE_TYPE'),
    minWidth: 100,
  },
  {
    prop: 'name', //用户名称
    label: t('LOG_USER_NAME'),
    minWidth: 80,
  },
  {
    prop: 'mobile', //手机号
    label: t('LOG_PHONE_NUMBER'),
    minWidth: 120,
  },
  {
    prop: 'ipAddress', //IP地址
    label: t('LOG_IP_ADDRESS'),
    minWidth: 120,
  },
  {
    prop: 'os',//操作系统
    label: t('LOG_OS'),
    minWidth: 120,
  },
  {
    prop: 'browser', //浏览器
    label: t('LOG_BROWSER'),
    minWidth: 120,
  },
  {
    prop: 'product', //访问系统
    label: t('LOG_VISITE_SYSTEM'),
    minWidth: 120,
    format: (row) =>{
      if(row.product =='ailab'){
        return `<span >模型实验室</span>`
      } else{
        return ``
      }
    }
  },
  {
    prop: 'eventTime', //操作时间
    label: t('LOG_EVENT_TIME'),
    minWidth: 120,
  },
  {
    prop: 'result', //操作结果
    label: t('LOG_RESUILT'),
    minWidth: 120,
  },
  {
    prop: 'remark',
    label: t('LOG_REMARK'),
    minWidth: 120,
  },
]);

//获取列表数据
const getLoginLogsData = async () => {
  // loading.value = true
  getLoginLogs({
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
  }).then(res => {
    if(res.success) {
      tableData.value = res.data.records || [];
      console.log('tableData', tableData);
      tableConfig.value.paginationConfig.total = res.data.total;

    }else{
      ElMessage.error(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
};

getLoginLogsData();

const handlePageChange = () => {
  getLoginLogsData();
};

const exportBtnStatus = ref(false);
// 导出
const exportLogs = () => {
  exportBtnStatus.value = true;
  isLoading.value = true
  exportLoginLogs({
    userKeyword: filterData.value.userKeyword || undefined,
    product: 'ailab',
    actionResult: '',
    startDate:
        filterData.value.rangeDate && filterData.value.rangeDate[0]
            ? dayjs(filterData.value.rangeDate[0]).format('YYYY-MM-DD')
            : '',
    endDate:
        filterData.value.rangeDate && filterData.value.rangeDate[1]
            ? dayjs(filterData.value.rangeDate[1]).format('YYYY-MM-DD')
            : '',
    currPage: 1,
    pageSize: 99999,
  })
      .then((res) => {
        saveFile(res,'登录日志.xlsx');
      })
      .catch((res) => {
        saveFile(res,'登录日志.xlsx');
      })
      .finally(() => {
        exportBtnStatus.value = false;
        isLoading.value = false
      });
};

const tableHeight = ref();
const onResize = _.debounce(() => {
  tableHeight.value = pageRef.value.offsetHeight - topRef.value.offsetHeight - 66;
  tableConfig.value.height = `${tableHeight.value}px`;
}, 500);

// 侧边栏展开收起重新计算表格宽度
// watch(
//     () => layoutStore().isCollapse,
//     () => {
//       onResize();
//     },
//     { immediate: true }
// );
</script>

<style lang="scss" scoped>
.main-page {
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
