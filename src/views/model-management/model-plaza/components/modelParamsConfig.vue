<template>
  <div class="params-container" >
    <!-- 输入参数表格 -->
    <div class="param-table">
      <div v-if="currentDetail.modelType == '3'">
        <div class="table-title">计算规则</div>
        <div>
          <el-input
              v-model="calculationRules"
              :rows="5"
              type="textarea"
              readonly
          />
        </div>
      </div>
      <div class="table-title">输入参数</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="inputParams"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
      </div>

    </div>

    <!-- 输出参数表格 -->
    <div class="param-table">
      <div class="table-title">输出参数</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="outputParams"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
      </div>

    </div>

    <!-- 评估指标表格 -->
    <div class="param-table">
      <div class="table-title">评估指标</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="evalMetrics"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  currentDetail:{
    type: Object,
    default: {}
  }
})
const calculationRules = ref('')
// be-table 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'model-detail-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})

// 表格列配置
const tableColumns = [
  //   参数名
  { prop: 'paramDesc', label: t('PARAM_NAME'), minWidth: 100 },
  //  参数描述
  { prop: 'paramName', label: t('PARAM_DESC'), minWidth: 100 },
  //   参数类型
  { prop: 'paramType', label: t('PARAM_TYPE'), minWidth: 120 },
]

// 输入参数list
const inputParams = ref([])
// 输出参数数据源List
const outputParams = ref([])
// 评估指标数据源list
const evalMetrics = ref([])
watch(()=>props.currentDetail,(val)=>{
  if(val && Object.keys(val).length>0){
    inputParams.value =  val.paramInList
    outputParams.value = val.paramOutList
    evalMetrics.value = val.paramEvaList
    calculationRules.value = val.formula
  }
},{deep:true,})
</script>
<style lang="scss" scoped>
.table-title{
  margin: 10px 0;
}
</style>
