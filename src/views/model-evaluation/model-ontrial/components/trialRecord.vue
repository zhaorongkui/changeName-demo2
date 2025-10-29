<template>
<!--  试用记录-->
  <div class="model-training ">
    <div class="content-main">
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
  <!--  试用弹窗-->
  <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail" :currentModelId="currentModelId" pageType="tryRelative"></viewModelDetail>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import { getModelTrialRecord } from '@/api/modelManage.ts'
// 表格数据
const tasks = ref([
  {
    taskName: '训练任务_test1',
    type: '通用-图像分类',
    framework: 'Paddle2.3.0',
    status: '运行完成',
    duration: '10分16秒',
    createTime: '2024-01-01 00:00:00'
  },
  {
    taskName: '训练任务_test2',
    type: '通用-图像分类',
    framework: 'Paddle2.3.0',
    status: '异常',
    duration: '10分16秒',
    createTime: '2024-01-01 00:00:00'
  },
  {
    taskName: '训练任务_test3',
    type: '通用-图像分类',
    framework: 'Paddle2.3.0',
    status: '已停止',
    duration: '10分16秒',
    createTime: '2024-01-01 00:00:00'
  },
  {
    taskName: '训练任务_test4',
    type: '通用-图像分类',
    framework: 'Paddle2.3.0',
    status: '运行中',
    duration: '08分25秒',
    createTime: '2024-01-01 00:00:00'
  },
  {
    taskName: '训练任务_test5',
    type: '通用-图像分类',
    framework: 'Paddle2.3.0',
    status: '排队中',
    duration: '00分00秒',
    createTime: '2024-01-01 00:00:00'
  }
])
const isShowViewModelDetail = ref(false)
const { t } = useI18n()
const props = defineProps({
  currentModelId:{
    type: String,
    default: ''
  }
})
const pageKey = 'model-train'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '450px',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  maxHeight:'450px',
  rowKey: `${pageKey}Id`
})
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
      prop: 'trialTime',
      label: '时间',
      align: 'center'
    },
    {
      prop: 'creator',
      label: '试用人',
      align: 'center'
    },
    {
      prop: 'delayTime',
      label: '推理延迟时间(ms)',
      align: 'center'
    },
    {
      prop: 'memoryUsed',
      label: '内存使用(MB)',
      align: 'center'
    },

    {
      prop: 'mistakeAvg',
      label: '均方误差（MSE/RMSE',
      align: 'center'
    },
    {
      prop: 'relateDataSet',
      label: '关联数据集',
      align: 'center'
    },
    {
      prop: 'reasoningResult',
      label: '推理结果',
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
      ]
    }
  ]
})
// 筛选相关
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalTasks = ref(tasks.value.length)

// 计算属性 - 筛选后的任务
const tableData = ref([
    // {
    //   "index": 1,
    //   "time": "2025-07-01 08:30:22",
    //   "user": "张工程师",
    //   "inferenceLatency": 124,
    //   "memoryUsage": 856,
    //   "squaredError": "0.023/0.152",
    //   "dataset": "华东污水厂 | 2025-1-1~2025-3-31 | 328条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 2,
    //   "time": "2025-07-01 09:12:45",
    //   "user": "李研究员",
    //   "inferenceLatency": 98,
    //   "memoryUsage": 792,
    //   "squaredError": "0.018/0.134",
    //   "dataset": "华南污水厂 | 2025-2-15~2025-5-15 | 412条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 3,
    //   "time": "2025-07-01 10:05:33",
    //   "user": "王技术员",
    //   "inferenceLatency": 156,
    //   "memoryUsage": 1024,
    //   "squaredError": "0.031/0.176",
    //   "dataset": "华北污水厂 | 2025-1-10~2025-4-10 | 287条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 4,
    //   "time": "2025-07-01 11:23:17",
    //   "user": "赵分析师",
    //   "inferenceLatency": 87,
    //   "memoryUsage": 712,
    //   "squaredError": "0.015/0.123",
    //   "dataset": "西部污水厂 | 2025-3-1~2025-6-1 | 376条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 5,
    //   "time": "2025-07-01 13:45:09",
    //   "user": "张工程师",
    //   "inferenceLatency": 203,
    //   "memoryUsage": 1248,
    //   "squaredError": "0.042/0.205",
    //   "dataset": "东部污水厂 | 2025-4-5~2025-6-30 | 254条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 6,
    //   "time": "2025-07-01 14:30:51",
    //   "user": "刘主管",
    //   "inferenceLatency": 112,
    //   "memoryUsage": 932,
    //   "squaredError": "0.027/0.164",
    //   "dataset": "华中污水厂 | 2025-1-20~2025-5-20 | 498条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 7,
    //   "time": "2025-07-01 15:18:26",
    //   "user": "李研究员",
    //   "inferenceLatency": 76,
    //   "memoryUsage": 684,
    //   "squaredError": "0.012/0.110",
    //   "dataset": "华东污水厂 | 2025-2-1~2025-5-31 | 521条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 8,
    //   "time": "2025-07-01 16:05:44",
    //   "user": "王技术员",
    //   "inferenceLatency": 134,
    //   "memoryUsage": 876,
    //   "squaredError": "0.019/0.138",
    //   "dataset": "华南污水厂 | 2025-3-10~2025-6-20 | 403条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 9,
    //   "time": "2025-07-02 08:42:33",
    //   "user": "赵分析师",
    //   "inferenceLatency": 92,
    //   "memoryUsage": 768,
    //   "squaredError": "0.014/0.118",
    //   "dataset": "华北污水厂 | 2025-4-1~2025-6-30 | 312条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // },
    // {
    //   "index": 10,
    //   "time": "2025-07-02 09:55:21",
    //   "user": "刘主管",
    //   "inferenceLatency": 167,
    //   "memoryUsage": 1082,
    //   "squaredError": "0.035/0.187",
    //   "dataset": "西部污水厂 | 2025-1-5~2025-4-5 | 287条",
    //   "result": "回流比预测完成（标准误差±0.02）"
    // }

])


// 分页
const handlePageChange = ()=> {}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail':
      handleView(row)
      break
  }
}
/**
 * 详情
 */
const handleView = ()=> {
  isShowViewModelDetail.value = true
}
/**
 * 关闭详情
 */
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
}
const getRecordList  = ()=>{
  
}
watch(()=> props.currentModelId,(val)=>{
  getModelTrialRecord({
    currentModelId: tableConfig.value.paginationConfig.currentPage,
    pageSize:tableConfig.value.paginationConfig.pageSize,
    sort:1,
    modelId: val
  }).then( res =>{
    if(res.success){
     tableConfig.value.paginationConfig.total = res.data.total
      tableData.value = res.data.body
    }
  })
},{
  deep:true,
  immediate:true
})
</script>

<style scoped lang="postcss">
.model-training {
  @apply flex flex-col h-full;
}
</style>