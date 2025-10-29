
<template>
  <div class="dataset-info">
    <el-form label-width="100px" class="dataset-info-content">

      <div class="section-header">
        <el-icon><Operation /></el-icon>
        <span>任务信息</span>
      </div>
      <el-form-item label="任务名称:" class="dataset-info-item">
        {{ baseInfoObj.taskName }}
      </el-form-item>
      <el-form-item label="训练状态:" class="dataset-info-item">
        {{ baseInfoObj.status}}
      </el-form-item>
      <el-form-item label="运行时间:" class="dataset-info-item">
        {{ baseInfoObj.trainTime }}
      </el-form-item>
      <div style="margin: 20px 0">
        <div class="section-header">
          <el-icon><Operation /></el-icon>
          <span>基本信息</span>
        </div>

        <el-form-item label="模型名称:" class="dataset-info-item">
          {{ baseInfoObj.modelName }}
        </el-form-item>
        <el-form-item label="模型类型:" class="dataset-info-item">
          {{ getModelType(Number(baseInfoObj.modelType)) ? getModelType(Number(baseInfoObj.modelType)) :  baseInfoObj.modelType}}
        </el-form-item>
        <el-form-item label="模型所有者:" class="dataset-info-item">
          {{ baseInfoObj.owner }}
        </el-form-item>
        <el-form-item label="编程语言:" class="dataset-info-item" v-if="currentModelDetail.modelType =='1'">
          {{ baseInfoObj.developLanguage }}
        </el-form-item>
        <el-form-item label="模型使用场景:" class="dataset-info-item">
          {{ baseInfoObj.applicableScenario }}
        </el-form-item>
        <el-form-item label="创建时间:" class="dataset-info-item">
          {{ baseInfoObj.createTime }}
        </el-form-item>
        <el-form-item label="最近更新时间:" class="dataset-info-item">
          {{ baseInfoObj.updateTime }}
        </el-form-item>
        <el-form-item label="模型描述:" class="dataset-info-item">
          {{ baseInfoObj.notes }}
        </el-form-item>
      </div>

      <div class="section-header">
        <el-icon><Operation /></el-icon>
        <span>关联数据集（{{currentModelDetail.dataSetVOS ? currentModelDetail.dataSetVOS.length : 0}}）</span>
      </div>
      <correlationDataset pageType="training" :currentDetail="currentModelDetail"></correlationDataset>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,watch } from 'vue'
import {Operation} from "@element-plus/icons-vue";
import correlationDataset from './correlationDataset.vue'
const props =defineProps({
  currentModelDetail:{  //当前详情信息
    type: Object,
    default:{}
  },
  isEdit:{
    type: Boolean,
    default: false
  },
  pageType:{
    type: String,
    default:""
  },
  currentModelMachine:{
    type:Object,
    default:{}
  }
})
// 数据集基本信息
const baseInfoObj = ref({

})

// 获取模型类型
const getModelType = (type: number)=> {
  let modelTypeName = ''
  switch (type) {
    case 1:
      modelTypeName = '机器学习模型'
      break;
    case 2:
      modelTypeName = '智能体模型'
      break;
    case 3:
      modelTypeName = '数据规则模型'
      break;
  }
  return modelTypeName
}


watch(()=>props.currentModelDetail,(val)=>{
  if(val && Object.keys(val).length){
    baseInfoObj.value = val
  }
},{
  deep: true,
  immediate: true
})
onMounted(() => {
  // if(props.pageType == 'machine'){
  //   console.log(props.currentModelMachine,'currentModelDetail===-=')

  //   baseInfoObj.value.name = props.currentModelMachine.modelName
  //   baseInfoObj.value.createTime = props.currentModelMachine.createTime
  //   baseInfoObj.value.updateTime = props.currentModelMachine.modelName
  // }
})
</script>
<style lang="scss" scoped>
.dataset-info-content {
  :deep(.el-descriptions__label) {
    text-align: right;
  }
  .dataset-info-item {
    margin-bottom: 4px;
  }
}
:deep(.el-form-item__content){
  font-size: 12px !important;
}
:deep(.el-form-item--label-right .el-form-item__label){
  font-size: 12px !important;
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
</style>
