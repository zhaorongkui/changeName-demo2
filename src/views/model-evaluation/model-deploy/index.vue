<template>
  <!--  模型部署-->
  <div class="deploy detail-config" v-show="!isChildRoute">
    <div class="content-title">
      <h3>模型部署列表</h3>
    </div>
    <!-- 查询条件区域 -->
    <div class="search-criteria">
      <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset">
        <template #timeRange>
          <el-date-picker
              v-model="formData.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
          />
        </template>
      </AdvancedSearch>
    </div>
    <div class="content-main">
      <div class="table-operate">
        <el-button type="primary" @click="handleSelectModel">选择模型</el-button>
      </div>
      <div class="data-table-container">
      <be-table
          :is-lock="false"
          :table-data="tableData"
          :columns="tableColumns"
          :options="tableConfig"
          @command="onCommand"
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
  </div>
  <selectModel v-if="isShowSelectModel" @close="handleCloseSelectModel"></selectModel>
  <router-view :key="route.path"></router-view>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import selectModel from './components/select-model.vue'
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import {getDeployList, getModelMachineList} from "~/api/modelManage";
import {useRoute, useRouter} from "vue-router";
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('check'));
let isShowSelectModel = ref(false)
const { t } = useI18n()
// 搜索条件
const formData = ref({
  name: '',
  modelVersion: '',
  deployStatus: '',
  timeRange:[]
})
const statusOptions = ref([
  {
    label:'审批中',
    value:1,
  },
  {
    label:'审批通过',
    value:2,
  },
  {
    label:'审批未通过',
    value:3,
  },
])
const formItemList = ref([
  {
    type: 'input',
    label: '模型名称',
    paramKey: 'name',
    placeholder: '请选择',
    modelValue: formData.value.name,

  },
  {
    type: 'input',
    label: '版本',
    paramKey: 'modelVersion',
    placeholder: '请选择',
    modelValue: formData.value.modelVersion,
  },
  {
    type: 'select',
    label: '审批状态',
    paramKey: 'deployStatus',
    placeholder: '请选择',
    modelValue: formData.value.deployStatus,
    selectOptions: statusOptions.value.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },
  {
    type: 'dateRange',
    multiple: 2,
    label: '申请时间',
    paramKey: 'timeRange',
    modelValue: formData.value.timeRange,
    isSlot: true
  }

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
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'modelVersion',
      label: '版本',
      align: 'center'
    },
    {
      prop: 'aliasName',
      label: '版本别名',
      align: 'center'
    },
    // {
    //   prop: 'deploymentScope',
    //   label: '部署范围',
    //   align: 'center'
    // },
    {
      prop: 'applicant',
      label: '申请人',
      align: 'center'
    },
    {
      prop: 'applyTime',
      label: '申请时间',
      align: 'center',
    },
    {
      prop: 'deployStatus',
      label: '审批状态',
      align: 'center'
    },
    // {
    //   prop: 'approvalStatus',
    //   label: '审批状态',
    //   align: 'center'
    // },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: [
        {
          name: '查看',
          command: 'detail',
          type: 'primary'
        }
      ]
    }
  ]
})

const pageKey = 'model-deploy'
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


// 表格数据
const tableData = ref([])
const loading = ref(false)
// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getDeployList({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
        name: formData.value.name,
        deployStatus: formData.value.deployStatus,
        sort:1,
        modelVersion:formData.value.modelVersion,
        applyStartTime: formData.value.timeRange.length ? formData.value.timeRange[0] : '',
        applyEndTime: formData.value.timeRange.length ? formData.value.timeRange[1] : '',
      }
  ).then((res) => {
    if(res.success){
      tableData.value = res.data?.body || []
      tableConfig.value.paginationConfig.total = res.data.total || 0
    }else{
      ElMessage.error(res.msg)
    }
  })
      .finally(() => {
        loading.value = false
      })

}
// 搜索
const handleFilterSearch = (data) => {
    Object.keys(formData.value).forEach((key) => {
      if( key != 'timeRange'){
       formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
      }
    })
  loadTableData()
}
// 重置
const handleFilterReset = () => {
  formData.value.modelName = ''
  formData.value.modelVersion = ''
  formData.value.deployStatus =''
  formData.value.timeRange = []
  loadTableData()
}
const router = useRouter()
// 查看详情
const handleView = (row) => {
  router.push({
    path: '/model-management/model-deploy/check',
    query: {
      workflowId: row.workflowId,
      modelId: row.modelKey,
      busId: row.busId,
      taskId: row.taskId || '1',
      pageType: 'deploy',

    }
  })

}


//     分页
const handlePageChange = () => {
  loadTableData()
}
// 打开选择模型弹窗
const handleSelectModel = ()=> {
  isShowSelectModel.value = true
}
const handleCloseSelectModel = ()=> {
  isShowSelectModel.value = false
  loadTableData()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail':
      handleView(row)
      break
  }
}
// 组件挂载时加载数据
onMounted(() => {
  loadTableData()
})
</script>

<style scoped lang="postcss">
.deploy{
  @apply flex flex-col h-full;
}
</style>