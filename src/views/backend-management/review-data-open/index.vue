<template>
  <div style="height: 100vh;"
    v-if="['review-data-open-detail', 'review-data-open-check'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="base-model detail-config" v-else>
    <div class="content-wrapper">
      <div class="content-title">
        <h3>数据公开审核列表</h3>
      </div>
      <div class="content-main">
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset"
            @onClear="handleFilterClear">
            <template #organizationsDimensions>
              <el-tree-select class="org-tree-select" node-key="orgId" v-model="formData.organizationsDimensions"
                :data="treeData" multiple collapse-tags collapse-tags-tooltip :props="propsTree" show-checkbox
                placeholder="请选择" ref="OrgSelectRef" style="width: 100%" />
            </template>
            <template #timeRange>
              <el-date-picker v-model="formData.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
            </template>
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
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from "~/utils/constant";
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import { getopenDataApprovalList } from '@/api/backStageManage';
import { getInitialValue } from '@/utils/index'
import { useTaskTodo } from '@/hooks/useTaskTodo';
import { initTreeData } from '@/utils/dataSandbox'
const { t } = useI18n()
const treeData = ref([])
const propsTree = ref({
  label: 'name',
  children: 'children',
  value: 'orgId',
})
const formData = ref({
  dataSetName: '',
  organizationsDimensions: [],
  applicationStatus: '',
  timeRange: []
})
const route = useRoute()
// 监听路由参数变化
watch(
  () => route,
  (newRoute, oldRoute) => {
    if (newRoute) {
      loadTableData()
    }
    // 在这里可以执行需要的操作，如重新加载数据
  },
  { deep: true } // 深度监听，因为$route是一个对象
)
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
    label: '全部',
    value: 'all',
  },
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
  {
    label: '已下架',
    value: 4,
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
    type: 'custom',
    label: '组织维度',
    paramKey: 'organizationsDimensions',
    placeholder: '请选择组织维度',
    modelValue: formData.value.organizationsDimensions,
    isSlot: true
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
// 定义枚举映射关系
const openScopeMap = {
  '1': '全行业',
  '2': '特定组织',
  // 可扩展其他值
};
const tableColumns = computed(() => {
  return [
    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },
    // {
    //   prop: 'reviewStatus',
    //   label: '申请状态',
    //   align: 'center'
    // },
    {
      prop: 'busType',
      label: '单据类型',
      align: 'center',
      width: 220,
      format: (row) => {
        return row.busType?.toString() === '1' ? '数据集公开' : '数据集下架'
      }
    },
    {
      prop: 'reviewStatus',
      label: '申请状态',
      align: 'center',
      minWidth: 100,
      // 自定义渲染
      format: (row) => {
        const statusClass = {
          '审核中': '#1775ff',
          '审核未通过': '#ff9900',
          '审核通过': '#19be6b',
          null: 'inherit'
        }
        return `<span style="color:${statusClass[row.reviewStatus]}">${row.reviewStatus}</span>`
      }
    },
    
    {
      prop: 'datasetsId',
      label: '数据集ID',
      align: 'center'
    },
    {
      prop: 'datasetName',
      label: '数据集名称',
      align: 'center'
    },
    // {
    //   prop: 'pushTime',
    //   label: '发布时间',
    //   align: 'center'
    // },
    {
      prop: 'deadline',
      label: '到期时间',
      align: 'center'
    },
    {
      prop: 'dataVolume',
      label: '数据规模',
      align: 'center'
    },
    {
      prop: 'ldmName',
      label: '业务实体',
      align: 'center',
      width: 80
    },
    {
      prop: 'orgName',
      label: '组织维度',
      align: 'center'
    },
    {
      prop: 'dateRange',
      label: '时间范围',
      align: 'center',
      width: 220,
      format: (row) => {
        return `${row.beginTime}-${row.endTime} `
      }
    },
    {
      prop: 'openScope',
      label: '公开范围',
      align: 'center',
      // 自定义渲染单元格内容
      format: (row) => {
        return row.openScope ? openScopeMap[row.openScope] : ''
      }
    },
    {
      prop: 'datasetUse',
      label: '公开用途',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: (row) => {
        const btns = [
          {
            name: '详情',
            command: 'detail',
            type: 'primary',
            visibleWhen: (r) => ['审核中'].includes(r.reviewStatus) === false,
          },
          {
            name: '审核',
            command: 'review',
            type: 'primary',
            visibleWhen: (r) => r.reviewStatus === '审核中',
          },
        ]
        return btns.filter((btn) => btn.visibleWhen(row));
      }
    }
  ]
})

const router = useRouter()
// 表格数据和分页
const tableData = ref([])
const isLoading = ref(false)
// 加载表格数据
const loadTableData = () => {
  isLoading.value = true
  getopenDataApprovalList({
    workFlowList: procInstParams.value,
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    datasetName: formData.value.dataSetName,
    orgIds: Array.isArray(formData.value.organizationsDimensions)
      ? formData.value.organizationsDimensions
      : formData.value.organizationsDimensions
        ? [formData.value.organizationsDimensions]
        : [],
    reviewStatus: formData.value.applicationStatus === 'all' ? '' : formData.value.applicationStatus,
    beginTime: formData.value.timeRange[0],
    endTime: formData.value.timeRange[1]
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.records
        tableConfig.value.paginationConfig.total = res.data.total
        console.log(tableData.value, 'value====')
      }

    })
    .finally(() => {
      isLoading.value = false
    })
}
// 搜索
const handleFilterSearch = (data) => {
  Object.keys(formData.value).forEach((key) => {
    if (!['organizationsDimensions', 'timeRange'].includes(key)) {
      formData.value[key] = data && data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
    }
  })
  loadTableData()
}
const OrgSelectRef = ref(null);
// 重置
const handleFilterReset = () => {
  formData.value.dataSetName = ''
  formData.value.organizationsDimensions = []
  formData.value.timeRange = []
  formData.value.applicationStatus = ''
  // OrgSelectRef.value.clearselectedData();
  loadTableData()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //版本管理
      handleDetail(row)
      break
    case 'review': //审核
      handleReview(row)
      break
  }
}
const handleFilterClear = (key) => {
  formData.value[key] = getInitialValue(key);
}
// 详情
const handleDetail = (row) => {
  router.push({
    path: '/backend-management/review-management/review-data-open/detail',
    query: {
      workflowId: row.workflowId,
      datasetId: row.busId,
      rowId: row.id,
      pageTypeNum: 3,
      taskId: row.taskId || '1'
    }
  })
}
// 审核
const handleReview = (row) => {
  router.push({
    path: '/backend-management/review-management/review-data-open/check',
    query: {
      workflowId: row.workflowId,
      datasetId: row.busId,
      rowId: row.id,
      taskId: row.taskId || '1',
      pageType: 'review',
      pageTypeNum: 3,
      busType: row.busType,
    }
  })
}
const handlePageChange = () => {
  loadTableData()
}
// 引入Hook，并传入当前页面的列表方法
const { procInstParams, getTaskTodoAct } = useTaskTodo(loadTableData); // 导出
onMounted(() => {
  treeData.value = initTreeData()
  // 先调用代办
  getTaskTodoAct(
    tableConfig.value.paginationConfig.currentPage, // userName
    tableConfig.value.paginationConfig.pageSize,    // page
  );
})

</script>

