<template>

  <div class="base-model detail-config" v-show="!isChildRoute">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>模型部署审核列表</h3>
      </div>
      <div class="content-main">
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset"
            @onClear="handleFilterClear">
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
  <modelDetail v-if="isShowModelDetail" @close="handleCloseModelDetail" :itemModelId="itemModelId" :busId="busId">
  </modelDetail>
  <router-view :key="route.path"></router-view>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from "~/utils/constant";
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import modelDetail from './components/modelDetail.vue'
import { getmodelApprovalList } from '@/api/backStageManage'
import { arrayToMap, getInitialValue } from '@/utils/index'
import { useTaskTodo } from '@/hooks/useTaskTodo';
const { t } = useI18n()
const isShowModelDetail = ref(false)
const formData = ref({
  modelName: '',
  modelType: '',
  applicationStatus: ''
})
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('check'));
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
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `${pageKey}Id`
})
const statusOptions = ref([
  {
    label: '全部',
    value: 'all'
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
])
const modelTypeOptions = ref([
  {
    label: '机器学习',
    value: 1,
  },
  {
    label: '智能体',
    value: 2,
  },

  {
    label: '数据规则模型',
    value: 3,
  },
])
const formItemList = ref([
  {
    type: 'input',
    label: '模型名称',
    paramKey: 'modelName',
    placeholder: '请选择',
    modelValue: formData.value.modelName,

  },
  {
    type: 'select',
    label: '模型类型',
    paramKey: 'modelType',
    placeholder: '请选择',
    modelValue: formData.value.modelType,
    selectOptions: modelTypeOptions
  },
  {
    type: 'select',
    label: '申请状态',
    paramKey: 'applicationStatus',
    placeholder: '请选择',
    modelValue: formData.value.applicationStatus,
    selectOptions: statusOptions
  },
  // {
  //   type: 'dateRange',
  //   multiple: 2,
  //   label: '时间范围',
  //   paramKey: 'timeRange',
  //   modelValue: formData.value.timeRange,
  //   isSlot: true
  // },


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
      prop: 'modelId',
      label: '模型ID',
      align: 'center'
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'modelType',
      label: '模型类型',
      align: 'center'
    },
    {
      prop: 'version',
      label: '当前版本',
      align: 'center'
    },
    {
      prop: 'description',
      label: '功能描述',
      align: 'center',
      width: 80
    },
    {
      prop: 'paramInStr',
      label: '输入数据',
      align: 'center'
    },
    {
      prop: 'paramOutStr',
      label: '输出参数',
      align: 'center'
    },
    {
      prop: 'applicableScenario',
      label: '应用场景',
      align: 'center'
    },
    {
      prop: 'paramEva',
      label: '评估指标',
      align: 'center'
    },
    {
      prop: 'trialTimes',
      label: '试用次数',
      align: 'center'
    },
    // {
    //   prop: 'description',
    //   label: '申请描述',
    //   align: 'center'
    // },
   {
      prop: 'instructions',
      label: '使用说明',
      align: 'center'
    },
    {
      prop: 'createBy',
      label: '申请人',
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '申请时间',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 130,
      buttons: (row) => {
        const btns = [
          {
            name: '试用详情',
            command: 'recoderDetail',
            type: 'primary',
            visibleWhen: (r) => r.reviewStatus,
          },
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
  getmodelApprovalList({
    workFlowList: procInstParams.value,
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    modelType: formData.value.modelType,
    modelName: formData.value.modelName,
    pageType: 2,
    reviewStatus: formData.value.applicationStatus === 'all' ? '' : formData.value.applicationStatus,
    // beginTime: formData.value.timeRange[0],
    // endTime: formData.value.timeRange[1]
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
    formData.value[key] = data && data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })
  loadTableData()
}
const handleFilterClear = (key) => {
  formData.value[key] = getInitialValue(key);
}
// 重置
const handleFilterReset = () => {
  formData.value.modelName = ''
  formData.value.modelType = ''
  formData.value.applicationStatus = ''
  loadTableData()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //版本管理
      goDetail(row)
      break
    case 'recoderDetail': //试用详情
      handleDetail(row)
      break
    case 'review': //审核
      handleReview(row)
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
// 详情
const goDetail = (row) => {
  router.push({
    path: '/backend-management/review-management/review-model-deploy/check',
    query: {
      workflowId: row.workflowId,
      modelId: row.busId,
      busId: row.busId,
      taskId: row.taskId,
      pageType: 'reviewDetail',
      pageTypeNum: 5,
    }
  })
}
// 审核
const handleReview = (row) => {
  router.push({
    path: '/backend-management/review-management/review-model-deploy/check',
    query: {
      workflowId: row.workflowId,
      modelId: row.busId,
      busId: row.busId,
      taskId: row.taskId,
      pageType: 'review',
      pageTypeNum: 5,
    }
  })
}
/**
 * 查看详情
 */
const itemModelId = ref('');
const busId = ref('');
const handleDetail = (row) => {
  itemModelId.value = row.modelId;
  busId.value = row.busId;
  isShowModelDetail.value = true
  isShowModelDetail.value = true
}
/**
 * 关闭详情
 */
const handleCloseModelDetail = () => {
  isShowModelDetail.value = false
}
/**
 * 试用详情
 */
const handleTrial = () => {

}

/**
 * 分页
 */
const handlePageChange = () => {
  loadTableData();
}
// 引入Hook，并传入当前页面的列表方法
const { procInstParams, getTaskTodoAct } = useTaskTodo(loadTableData); // 导出
onMounted(() => {
  // 先调用代办
  getTaskTodoAct(
    tableConfig.value.paginationConfig.currentPage, // userName
    tableConfig.value.paginationConfig.pageSize,    // page
  );
})


</script>
<style scoped>
.search-container {
  display: flex;
  justify-content: end;
}
</style>
