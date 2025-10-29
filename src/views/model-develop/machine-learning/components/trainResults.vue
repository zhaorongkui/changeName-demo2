<template>
  <!--  模型试用-->
  <el-drawer v-model="dialogVisible" title="训练结果"  @close="handleClose" destroy-on-close size="80%" :modal="false"
             >
    <div class="model-management-container  detail-config">
      <!-- 模型详情--左侧面板 - 模型版本信息 -->
      <div class="left-content">
        <div class="panel-title">模型版本（{{currentModelDetail.version}}）</div>

        <div class="info-section">
          <baseInfo  :currentModelDetail="currentModelDetail" :currentModelMachine="currentModelMachine" :pageType="pageType"></baseInfo>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="right-content">
        <div class="params-setting">
          <div class="tab-header">
            <div class="panel-title">参数设置</div>
            <el-input
                v-model="currentModelDetail.inputJson"
                style="margin-top: 15px"
                readonly
                :autosize="{ minRows: 4, maxRows: 15 }"
                type="textarea"
                placeholder="参数"
            />
          </div>
          <!-- 参数表格 -->

        </div>

        <!-- 校验结果区域 -->
        <div class="verification-result">
          <el-tabs  v-model="activeName" class="demo-tabs">
            <el-tab-pane label="输出结果" name="outputResult">
              <div class="log-container ">
                <be-table
                    :key="tableKey"
                    :is-lock="false"
                    :table-data="outParams"
                    :columns="dynamicColumns"
                    :options="tableConfig"
                />
                <div  style="display: flex">
                  <img width="50%" :src="`http://10.195.6.251:11010/images/${item}`" v-for="item in currentModelDetail.picList" :key="item" >
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick, watch, inject} from 'vue'
import {
  Operation,
} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import  { ElMessage } from 'element-plus'
import baseInfo from '@/views/model-develop/machine-learning/components/trainResultBseInfo.vue'
import { getTrainResult } from '@/api/common'
const tableConfig = ref({
  settingTable: false,
  tableId: `run-table`,
  height: '320px',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: ``
})
let dialogVisible = ref(true)
const version = ref('V1版本')
const activeName = ref('outputResult')
const tableKey = ref(0)
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

const currentModelDetail = ref({})

// 评估指标
const evaluateData = ref([])

// 输出结果列
const dynamicColumns = ref([])
// 输出结果数据
const outParams = ref([])
// 评估指标列
const evaluateColumns = ref([
  { prop: 'evaIndex', label: '指标' },
  { prop: 'describe', label: '描述' },
  { prop: 'value', label: '值' },
])
const emit = defineEmits(['close','confirmNext'])
const handleClose = ()=>{
  emit('close')
}
const imgSrc1 = ref('')
const imgSrc2 = ref('')

const route = useRoute()
const getDetailInfo = () =>{
  getTrainResult(props.currentModelId).then(res=>{
    if(res.success){
      nextTick(()=>{
        currentModelDetail.value = res.data
        if(Object.keys(res.data.runDataVO.csvReturnVO.titleMap).length > 0){
          dynamicColumns.value  = Object.entries(res.data.runDataVO.csvReturnVO.titleMap)
              .map(([prop, label]) => ({ prop, label }))
              .sort((a, b) => {
                // 提取column后面的数字进行比较
                const numA = parseInt(a.prop.replace('column', ''));
                const numB = parseInt(b.prop.replace('column', ''));
                return numA - numB;
              });
        }
        outParams.value = res.data.runDataVO.csvReturnVO.dataList
        evaluateData.value = res.data.runDataVO.evaIndexList
        tableKey.value++
      })

    }else{
      ElMessage.error(res.msg)
    }
  })
}

onMounted(() => {

  nextTick(() => {
    if(props.currentModelId){
      getDetailInfo()
    }
    imgSrc1.value = 'http://10.195.6.251:11010/images/1.png';
    imgSrc2.value = 'http://10.195.6.251:11010/images/2.png';
  });
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
  overflow: scroll;
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
  overflow: scroll;
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