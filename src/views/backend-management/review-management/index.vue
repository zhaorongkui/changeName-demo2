<template>
  <div class="base-model detail-config">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>审核管理列表</h3>
      </div>
      <div class="content-main">
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset">
          </AdvancedSearch>
        </div>
        <div class="data-table-container">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
            @command="onCommand" />
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from "~/utils/constant";
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
const { t } = useI18n()
const formData = ref({
  dataSetName: '',
  organizationsDimensions: '',
  applicationStatus: '',
  timeRange: []
})
const pageKey = 'review-management'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `${pageKey}Id`
})
const statusOptions = ref([
  {
    label: '审核中',
    value: 1,
  },
  {
    label: '审核通过',
    value: 2,
  },
  {
    label: '审核未通过',
    value: 3,
  },
])
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'dataSetName',
    placeholder: '请选择',
    modelValue: formData.value.dataSetName,

  },
  {
    type: 'input',
    label: '组织维度',
    paramKey: 'organizationsDimensions',
    placeholder: '请选择',
    modelValue: formData.value.organizationsDimensions,
  },
  {
    type: 'select',
    label: '申请状态',
    paramKey: 'applicationStatus',
    placeholder: '请选择',
    modelValue: formData.value.applicationStatus,
    selectOptions: statusOptions.value.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },
  {
    type: 'dateRange',
    multiple: 2,
    label: '时间范围',
    paramKey: 'timeRange',
    modelValue: formData.value.timeRange,
    isSlot: true
  },


])
const tableColumns = computed(() => {
  return [
    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },

    {
      prop: 'applicationStatus',
      label: '申请状态',
      align: 'center'
    },
    {
      prop: 'datasetId',
      label: '数据集ID',
      align: 'center'
    },
    {
      prop: 'name',
      label: '数据集名称',
      align: 'center'
    },
    {
      prop: 'publishTime',
      label: '发布时间',
      align: 'center'
    },
    {
      prop: 'downloadCount',
      label: '数据规模',
      align: 'center'
    },
    {
      prop: 'businessObject',
      label: '业务范围(对象)',
      align: 'center',
      width: 80
    },
    {
      prop: 'organization',
      label: '组织维度',
      align: 'center'
    },
    {
      prop: 'dateRange',
      label: '时间范围',
      align: 'center'
    },
    {
      prop: 'applicationDescription',
      label: '申请描述',
      align: 'center'
    },
    {
      prop: 'applicationInstructions',
      label: '申请说明',
      align: 'center'
    },
    {
      prop: 'updateUser',
      label: '申请人',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: [
        {
          name: '详情',
          command: 'detail',
          type: 'primary'
        },
        {
          name: '审核',
          command: 'review',
          type: 'primary'
        },
      ]
    }
  ]
})

const router = useRouter()
// 表格数据和分页
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadTableData = () => {

}
// 搜索
const handleFilterSearch = () => {

}
// 重置
const handleFilterReset = () => {
  formData.value.dataSetName = ''
  formData.value.organizationsDimensions = ''
  formData.value.timeRange = []
  formData.value.applicationStatus = ''
  // handleFilterSearch()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'version': //版本管理
      handleVersion(row)
      break
    case 'ontrial': //试用
      handleTrial(row)
      break
    case 'debug': //调试
      break
    case 'del': //删除
      // handleDelete(row)
      break
  }
}

const handlePageChange = () => {

}
onMounted(() => {
  loadTableData() // 初始加载表格数据
})


</script>
<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: end;
}
</style>
