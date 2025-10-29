<template>
<!--  模型试用-->
  <el-drawer v-model="dialogVisible" title="模型试用"  @close="handleClose" destroy-on-close size="80%" :modal="false"

             >
  <div class="model-management-container  detail-config">
    <!-- 模型详情--左侧面板 - 模型版本信息 -->
    <div class="left-content">
      <div class="panel-title">模型版本（{{currentModelDetail.version}}）</div>

      <div class="info-section">
        <div class="section-header">
          <el-icon><Operation /></el-icon>
          <span>基本信息</span>
        </div>
        <modeDetailInfo  :currentModelDetail="currentModelDetail" :currentModelMachine="currentModelMachine" :pageType="pageType"></modeDetailInfo>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-content">
      <div class="params-setting">
        <div class="tab-header">
          <div class="panel-title">参数设置</div>
<!--          <el-button type="primary" size="small" @click="handleTrial">试用</el-button>-->
        </div>
        <!-- 参数表格 -->
        <el-table :data="params" border style="width: 100%" max-height="450px" @selection-change="handleOneSelect">
          <el-table-column type="selection" width="55" v-if="pageType !== 'tryRelative'"></el-table-column>
          <el-table-column prop="paramName" label="参数名" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paramDesc" label="参数描述" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unit" label="单位" width="120">
            <template #default="{row}">
              {{ getTypeText(row.unit) }}
            </template>
          </el-table-column>
          <el-table-column prop="dataSet" label="选择数据集">
            <template #default="{row,$index}">
              <el-select v-model="row.dataSetName"
                         filterable
                         remote
                         reserve-keyword
                         placeholder="请选择"
                         remote-show-suffix
                         :remote-method="remoteMethod"
                         :loading="loading"
                         size="small"
                         :disabled="pageType === 'tryRelative'"
                         @change="(val) => handleDatasetChange(val, row,$index)"
                         popper-class="custom-dataset-select"
              >
                <el-option
                    v-for="item in row.datasetList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="coreObject" label="选择业务实体">
            <template #default="{row}">
              <el-select v-model="row.ldmName"
                         filterable
                         placeholder="请选择"
                         size="small"
                         :disabled="pageType === 'tryRelative'"
                         @change="(val)=>handleCoreObjectChange(val,row)"
              >
                <el-option
                    v-for="item in row.ldmList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="field" label="选择字段">
            <template #default="{row}">
              <el-select v-model="row.fieldName" placeholder="请选择" size="small"  filterable :disabled="pageType === 'tryRelative'" @change="(val) => handleFieldChange(val,row)">
                <el-option
                    v-for="item in fieldOptions"
                    :key="item.id"
                    :label="item.fieldName"
                    :value="item.id"
                >{{item.fieldName}} ~ {{item.description}}</el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 校验结果区域 -->
      <div class="verification-result">
            <div class="log-container">
              <el-button v-if="!tryRelativePage" type="primary" :icon="VideoPlay"  @click="runModel">运行</el-button>
              <!--              <el-button type="primary" size="small" @click="runModel">运行</el-button>-->
              <div class="log-content" ref="logContent">
                <el-input
                    v-model="operationLog"
                    style="margin-top: 15px"
                    readonly
                    :autosize="{ minRows: 8, maxRows: 15 }"
                    type="textarea"
                    placeholder="暂无"
                />
              </div>
            </div>
        <el-tabs v-if="isShowRunningResult" v-model="activeName" class="demo-tabs">
          <el-tab-pane label="输出结果" name="outputResult">
            <div class="log-container ">
              <be-table
                  :is-lock="false"
                  :table-data="outParams"
                  :columns="dynamicColumns"
                  :options="tableConfig"
              />

              <div  style="display: flex">
                <img v-if="props.currentModelId !=4" width="50%" :src="imgSrc1"  >
                <img v-if="props.currentModelId !=4"  width="50%" :src="imgSrc2" >
                <img v-if="props.currentModelId ==4"  :src="imgSrc3" >
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="评估指标" name="evaluationMetrics">
            <div class="log-container">
              <be-table
                  :is-lock="false"
                  :table-data="evaluateData"
                  :columns="evaluateColumns"
                  :options="tableConfig"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
    <el-dialog
        v-model="dialogVisibleWarning"
        width="20%"
        center
        :show-close="false"
        :close-on-click-modal="false"
    >
      <div class="progress-content">
        <el-progress type="circle" :percentage="percentage" :status="status" class="custom-circle-progress"/>
        <span class="warning-progress-text">模型运行中,请稍等......</span>
      </div>

    </el-dialog>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
<!--        <el-button type="primary" @click="dialogVisible = false">-->
<!--          Confirm-->
<!--        </el-button>-->
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick, watch, inject} from 'vue'
import {
  Operation,
  DataAnalysis,
  VideoPlay
} from '@element-plus/icons-vue'
import modeDetailInfo from './model-plaza/components/modeDetailInfo.vue'
import {useRoute} from "vue-router";
import  { ElMessage } from 'element-plus'
import { getModelTrialDetailInfo,getModelRunData,getPegging,getDetailForTrial }from '@/api/modelManage.ts'
import { getDatasetList,getDatasetDetailField, } from '@/api/dataSet.ts'
const operationLog =ref('')
const tableConfig = ref({
  settingTable: false,
  tableId: `run-table`,
  height: '320px',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `runId`
})
let dialogVisible = ref(true)
let dialogVisibleWarning = ref(false)
const version = ref('V1版本')
const activeName = ref('outputResult')
const isShowRunningResult = ref(false)
const percentage = ref(0)
const status = ref('')
const optionData = ref({
  xAxis: {},
  yAxis: {},
  tooltip: {
    trigger: 'item', // 当鼠标移到图表的数据项（点）上时触发
    // formatter: function (params) {
    //   // params.data 是当前点的数据，比如 [x, y]
    //   return `X: ${params.data[0]}<br/>Y: ${params.data[1]}`;
    // }
  },
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter'
    },
    {
      data: [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [10, 10],
        [11, 11],
        [12, 12],
        [13, 13],
        [14, 14],
        [15, 15]
      ],
      name:"进水",
      type: 'line',
      smooth: false,
      lineStyle: { color: 'gray', type: 'dashed', width: 1 },
      itemStyle: {
        color: 'red'
      },
      // symbol: 'circle',
      symbol: 'none',
      symbolSize: 6
    }
  ]
})
const props = defineProps({
  currentModelId:{ //当前行id
    type: String || Number,
    default: ''
  },
  pageType:{ //当前页面
    type:String,
    default:''
  },
  currentModelMachine:{
    type: Object, //机器学习模型跳过来的
    default:{}
  }
})
const currentDatasetId = ref(null)
const dataSetOptions = ref([]) //选择数据集数据
const coreObjectOptions = ref([]) //选择业务实体数据
const fieldOptions = ref([])
const currentModelDetail = ref({})
// 模型参数数据
const params = ref([
  {
    "paramName": "V_FLOW_PHASE_OUT", //参数名
    "paramDesc": "出水流量", //参数描述
    "unit": "m³/h", //单位
    dataSet:'', //选择数据集
    field:'',//选择字段,
    coreObject:'',
  },
  {
    "paramName": "V_FLOW_INLET",
    field:'',//选择字段
    "paramDesc": "进水流量",
    "unit": "m³/h",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_NH3N_INLET",
    field:'',//选择字段
    "paramDesc": "进水氨氮",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_TN_INLET",
    field:'',//选择字段
    "paramDesc": "进水总氮",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_NH3N_PHASE_OUT",
    field:'',//选择字段
    "paramDesc": "出水氨氮",
    "unit": "mg/L",
    dataSet:''
  },
  {
    "paramName": "V_TN_PHASE_OUT",
    field:'',//选择字段
    "paramDesc": "出水总氮",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_DO_FRONT",
    field:'',//选择字段
    "paramDesc": "前段DO",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_DO_MID",
    field:'',//选择字段
    "paramDesc": "中段DO",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_DO_END",
    field:'',//选择字段
    "paramDesc": "末端DO",
    "unit": "mg/L",
    dataSet:'',
    coreObject:'',
  },
  {
    "paramName": "V_ORP_ANA",
    field:'',//选择字段
    "paramDesc": "厌氧区ORP",
    "unit": "mV",
    dataSet:'',
    coreObject:''
  },
  {
    "paramName": "V_ORP_ANO",
    field:'',//选择字段
    "paramDesc": "缺氧区ORP",
    "unit": "mV",
    dataSet:''}
])
// 评估指标
const evaluateData = ref([


])
const realTimeOptions =[
  {
    value: '1',
    label: '[基础]水厂进出水实时数据',
  },
  {
    value: '2',
    label: '[基础]鼓风机实时数据',
  },
  {
    value: '3',
    label: '[基础]AOA实时数据',
  },
  {
    value: '4',
    label: '[基础]业务分类',
  },
]
// 输出结果列
const dynamicColumns = ref([

])
// 输出结果数据
const outParams = ref([
  {
    "cod_duration": 2.0,
    "tp_horizon": 2.0,
    "n_events": 288.0,
    "exceed_prob": 0.225694,
    "mean_increase": 0.053379,
    "max_increase": 0.4994,
  },
  {
    "cod_duration": 2.0,
    "tp_horizon": 3.0,
    "n_events": 288.0,
    "exceed_prob": 0.309028,
    "mean_increase": 0.091624,
    "max_increase": 0.4994
  },
  {
    "cod_duration": 2.0,
    "tp_horizon": 4.0,
    "n_events": 288.0,
    "exceed_prob": 0.329861,
    "mean_increase": 0.099872,
    "max_increase": 0.4994
  },
  {
    "cod_duration": 2.0,
    "tp_horizon": 5.0,
    "n_events": 288.0,
    "exceed_prob": 0.340278,
    "mean_increase": 0.104598,
    "max_increase": 0.4994
  },
  {
    "cod_duration": 2.0,
    "tp_horizon": 6.0,
    "n_events": 288.0,
    "exceed_prob": 0.340278,
    "mean_increase": 0.107082,
    "max_increase": 0.4994
  },
  {
    "cod_duration": 3.0,
    "tp_horizon": 2.0,
    "n_events": 213.0,
    "exceed_prob": 0.164319,
    "mean_increase": 0.020930,
    "max_increase": 0.4812
  },
  {
    "cod_duration": 3.0,
    "tp_horizon": 3.0,
    "n_events": 213.0,
    "exceed_prob": 0.178404,
    "mean_increase": 0.028282,
    "max_increase": 0.4812
  },
  {
    "cod_duration": 3.0,
    "tp_horizon": 4.0,
    "n_events": 213.0,
    "exceed_prob": 0.183099,
    "mean_increase": 0.032720,
    "max_increase": 0.4812
  },
  {
    "cod_duration": 3.0,
    "tp_horizon": 5.0,
    "n_events": 213.0,
    "exceed_prob": 0.201878,
    "mean_increase": 0.041148,
    "max_increase": 0.4812
  },
  {
    "cod_duration": 3.0,
    "tp_horizon": 6.0,
    "n_events": 213.0,
    "exceed_prob": 0.206573,
    "mean_increase": 0.043891,
    "max_increase": 0.4812
  },
  {
    "cod_duration": 4.0,
    "tp_horizon": 2.0,
    "n_events": 128.0,
    "exceed_prob": 0.062500,
    "mean_increase": 0.004225,
    "max_increase": 0.3800
  },
  {
    "cod_duration": 4.0,
    "tp_horizon": 3.0,
    "n_events": 128.0,
    "exceed_prob": 0.085938,
    "mean_increase": 0.014184,
    "max_increase": 0.3800
  },
  {
    "cod_duration": 4.0,
    "tp_horizon": 4.0,
    "n_events": 128.0,
    "exceed_prob": 0.085938,
    "mean_increase": 0.015754,
    "max_increase": 0.3800
  },
  {
    "cod_duration": 4.0,
    "tp_horizon": 5.0,
    "n_events": 128.0,
    "exceed_prob": 0.085938,
    "mean_increase": 0.017052,
    "max_increase": 0.3800
  },
  {
    "cod_duration": 4.0,
    "tp_horizon": 6.0,
    "n_events": 128.0,
    "exceed_prob": 0.109375,
    "mean_increase": 0.026231,
    "max_increase": 0.3900
  },
  {
    "cod_duration": 5.0,
    "tp_horizon": 2.0,
    "n_events": 59.0,
    "exceed_prob": 0.050847,
    "mean_increase": 0.008410,
    "max_increase": 0.3604
  },
  {
    "cod_duration": 5.0,
    "tp_horizon": 3.0,
    "n_events": 59.0,
    "exceed_prob": 0.050847,
    "mean_increase": 0.012825,
    "max_increase": 0.3604
  },
  {
    "cod_duration": 5.0,
    "tp_horizon": 4.0,
    "n_events": 59.0,
    "exceed_prob": 0.101695,
    "mean_increase": 0.034134,
    "max_increase": 0.3750
  },
  {
    "cod_duration": 5.0,
    "tp_horizon": 5.0,
    "n_events": 59.0,
    "exceed_prob": 0.135593,
    "mean_increase": 0.046664,
    "max_increase": 0.3750
  },
  {
    "cod_duration": 5.0,
    "tp_horizon": 6.0,
    "n_events": 59.0,
    "exceed_prob": 0.135593,
    "mean_increase": 0.047514,
    "max_increase": 0.3750
  },


])
// 评估指标列
const evaluateColumns = ref([
  { prop: 'evaIndex', label: '指标' },
  { prop: 'describe', label: '描述' },
  { prop: 'value', label: '值' },
])
// 获取参数类型文本
const getTypeText = (type) => {
  const typeMap = {
    'IOFloat': 'IOFloat',
    // 可以添加更多的类型映射
  }
  return typeMap[type] || type
}

// 校验结果相关
const logContent = ref(null)
const tryRelativePage =ref(false) //试用记录详情

// 数据集分页
const datasetPageNum = ref(1)
const currentDatasetKeyword = ref('') //选择数据集搜索字段
const hasMore = ref(true)
const loading = ref(false)
const isFetchingMore = ref(false) // 专为滚动加载更多而设的锁


const emit = defineEmits(['close','confirmNext'])
const handleClose = ()=>{
  emit('close')
}
// 选择数据集 远程搜索
const remoteMethod = (query: string) => {
  currentDatasetKeyword.value = query;
  if (query) {
    datasetPageNum.value = 1;
    loading.value = true
    hasMore.value = true
    dataSetOptions.value = []
    getDataPageList(query)
  }
}
// 获取数据集的列表
const getDataPageList = (query: string) => {
  getDatasetList({
    pageNum: datasetPageNum.value,
    pageSize: 10,
    directory:null,
    keyWord: query,
    orgId: [],
    status: null,
    applicationStatus:2
  })
      .then((res) => {
        if(res.success){
          loading.value = false
          const newItems = res.data.records || []
          if (newItems.length > 0) {
            dataSetOptions.value = [...dataSetOptions.value, ...newItems]
            datasetPageNum.value += 1
          }
          if (newItems.length < 10) {
            hasMore.value = false
          }
        }
      }).finally(() => {
    isFetchingMore.value = false
  })
}
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target

  // 滚动到底部附近（比如差 10px）时，触发加载
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (hasMore.value && !isFetchingMore.value) {
      isFetchingMore.value = true
      getDataPageList(currentDatasetKeyword.value)
    }
  }
}

const initScrollListener = () => {
  nextTick(() => {
    // 找到 el-select 下拉框中的滚动容器
    const popperEl = document.querySelector('.custom-dataset-select .el-select-dropdown__wrap')
    if (popperEl) {
      // 先移除旧的监听（避免重复绑定）
      popperEl.removeEventListener('scroll', handleScroll)
      // 再绑定新的
      popperEl.addEventListener('scroll', handleScroll)
    }
  })
}
// 控制选择数据集是否已经进行过“非统一”的数据集设置
const hasAnyCustomDataset = ref(false);
// 选择数据集
const handleDatasetChange = (val, row,index) => {
  currentDatasetId.value = val;
  getDetailData(row.paramName,index);
};
// 获取业务实体
const getDetailData = (fieldName,index)=>{
  getPegging({
    id:currentDatasetId.value,
    fieldName:fieldName,
  }).then(res => {
    if(res.success){
      coreObjectOptions.value = res.data.allObject
        params.value[index].coreObject = typeof(res.data.selected) == Number?  Number(res.data.selected) : res.data.selected
        params.value[index].field = res.data.fieldId
      fieldOptions.value = res.data.fieldList
    }
  })

}
// 控制选择业务实体是否已经进行过“非统一”的数据集设置
const hasAnyCustomCoreObject = ref(false)
// 选择业务实体
const handleCoreObjectChange = (val,row)=> {
  // if (!hasAnyCustomCoreObject.value) {
  //   // 首次选择，统一设置所有行
  //   params.value.forEach(item => {
  //     item.coreObject = val;
  //   });
  //   hasAnyCustomCoreObject.value = true; // 标记已经统一设置过
  // } else {
  //   row.coreObject = val;
  // }

  getFieldData(val)
}
// 获取某个数据集下的字段
const getFieldData = (id)=> {
    getDatasetDetailField({
      pageNum: 1,
      pageSize: 100,
      objectId: id,
      id: currentDatasetId.value,
      keyWord: ''
    }).then(res => {
      if(res.success){
        fieldOptions.value = res.data.records
      }else{
        ElMessage.error(res.message)
      }
    })
}
// 控制选择业务实体是否已经进行过“非统一”的数据集设置
const hasAnyCustomField = ref(false)
// 选择字段
const  handleFieldChange = (val,row)=>{
  // if (!hasAnyCustomField.value) {
  //   // 首次选择，统一设置所有行
  //   params.value.forEach(item => {
  //     item.field = val;
  //   });
  //   hasAnyCustomField.value = true; // 标记已经统一设置过
  // } else {
  //   row.field = val;
  // }
}
const selectTableData = ref([])
// 选择列表数据
const handleOneSelect = (data)=> {
  selectTableData.value = data
}
// 数据输出结果json数据函数
const processData = () => {
  // 1. 处理表头
  // dynamicColumns.value = mockResult.columns.map((col, index) => ({
  //   prop: `col${index}`,
  //   label: col
  //   // 可以添加其他el-table-column支持的属性
  // }))
  // // 2. 处理行数据
  // outParams.value = mockResult.data.map(row => {
  //   const rowData = {}
  //   mockResult.columns.forEach((col, index) => {
  //     rowData[`col${index}`] = row[index]
  //   })
  //   return rowData
  // })
}
const projectEnv: any = inject('$projectEnv')
const imgSrc1 = ref('')
const imgSrc2 = ref('')
const imgSrc3 = ref('')

// 运行
const runModel = async () => {
  dialogVisibleWarning.value = true       // 显示加载弹窗
  percentage.value = 0                    // 进度条初始为 0
  status.value = ''                       // 状态文本（可选）
  let progressTimer = null
  try {
    progressTimer = setInterval(() => {
      percentage.value = Math.min(percentage.value + 5, 90)
      // updateStatusText(percentage.value)
    }, 300)
    // 发起真正的接口请求
    const res = await getModelRunData({
      modelId: Number(props.currentModelId),
      modelParams: [],
    })
    clearInterval(progressTimer)
    if (res.success) {
      // processData()

      outParams.value = res.data.csvReturnVO ?  res.data.csvReturnVO.dataList :[]
      if(Object.keys(res.data.csvReturnVO.titleMap).length > 0){
        dynamicColumns.value  = Object.entries(res.data.csvReturnVO.titleMap)
            .map(([prop, label]) => ({ prop, label }))
            .sort((a, b) => {
              // 提取column后面的数字进行比较
              const numA = parseInt(a.prop.replace('column', ''));
              const numB = parseInt(b.prop.replace('column', ''));
              return numA - numB;
            });
      }
      evaluateData.value = res.data.evaIndexList
      // if(props.currentModelId ==4){
      //   dynamicColumns.value = [
      //     { prop: 'column1', label: 'COD持续时间(小时)' },
      //     { prop: 'column2', label: 'TP周期(小时)' },
      //     { prop: 'column3', label: '有效事件数' },
      //     { prop: 'column4', label: '超标概率(%)' },
      //     { prop: 'column5', label: 'TP平均增幅' },
      //     { prop: 'column6', label: 'TP最大增幅' },
      //   ]
      // }
      let baseUrl = projectEnv.VITE_APP_MODEL_SANDBOX
      // imgSrc1.value = `${baseUrl}/opt/saas/ailab/model-sandbox/backend/uploads/${res.data.path1}`
      // imgSrc2.value = `${baseUrl}/opt/saas/ailab/model-sandbox/backend/uploads/${res.data.path2}`
    } else {
      ElMessage.error(res.message || '模型运行失败')
    }

    // ✅ 接口请求完成（无论成功/失败），手动设置进度条为 100%
    percentage.value = 100

    // 延迟一点点关闭弹窗，让用户看到 100%
    setTimeout(() => {
      dialogVisibleWarning.value = false
      isShowRunningResult.value = true
    }, 300)

  } catch (error) {
    console.error('模型运行异常', error)
    // ElMessage.error('模型运行异常，请重试')

    // 即使异常，也手动设置进度条为 100%，然后关闭弹窗
    percentage.value = 100

    setTimeout(() => {
      dialogVisibleWarning.value = false
      isShowRunningResult.value = true
    }, 300)
  }
}
const route = useRoute()
// 监听传过来的模型id
watch(()=>props.currentModelId,(val)=>{
  if((val || val===0)){
    if(props.pageType ==='ontrial' || props.pageType==='tryRelative' || props.pageType =='machine' || props.pageType =='agent'  ){ //模型试用列表详情 、模型试用记录详情
      getDetailForTrial(val).then(res=>{
        if(res.success){
          currentModelDetail.value = res.data
          params.value = res.data.paramList
          getDataPageList('')
          initScrollListener()
        }else{
          ElMessage.error(res.msg)
        }
      })
    }

  }
},{
  deep: true,
  immediate: true,
})
onMounted(() => {
  nextTick(() => {
    imgSrc1.value = 'http://10.195.6.251:11010/images/1.png';
    imgSrc2.value = 'http://10.195.6.251:11010/images/2.png';
    imgSrc3.value = 'http://10.195.6.251:11010/images/3.png';
  });
 if(props.pageType && props.pageType === 'tryRelative'){
   tryRelativePage.value = true
   isShowRunningResult.value = true
 }else{
   tryRelativePage.value = false
   isShowRunningResult.value = false
 }
  getDataPageList('')
})
</script>

<style scoped lang="scss">
.model-management-container {
  display: flex !important;
  height: 100%;
  background-color: #ffffff;
  padding-top: 35px;
}

.left-content {
  width: 350px;
  border-right: 1px solid #ebeef5;
  padding-right: 10px;
  margin-right: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}
.info-section {
  margin-bottom: 20px;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}
.section-header :deep(.el-icon) {
  margin-right: 8px;
  font-size: 16px;
}
/* 右侧主内容区样式 */
.right-content {
  flex: 1;
  overflow-y: auto;
}
/* 校验结果区域 */
.verification-result {
  margin-top: 20px;
}
/* 日志区域样式 */
.log-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}
.progress-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}
:deep(.custom-circle-progress .el-progress-circle__track) {
  stroke: #e4e7ed !important;
}
:deep(.custom-circle-progress .el-progress-circle__path) {
  stroke: #67c23a !important;
}
.warning-progress-text{
  display: inline-block;
  margin-top: 30px;
  font-size: 20px;
}
:deep(.el-form-item){
  flex-direction: row !important;
}
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>
<style>
.el-dialog:before{
  display: none !important;
}
</style>