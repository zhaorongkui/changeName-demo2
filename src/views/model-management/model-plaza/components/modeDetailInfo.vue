
<template>
  <div class="dataset-info">
    <el-form label-width="100px" class="dataset-info-content">
      <el-form-item label="模型名称:" class="dataset-info-item">
        {{ baseInfoObj.name }}
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
        {{ baseInfoObj.applicableScenarioStr }}
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
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,watch } from 'vue'
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
  name: '-',
  modelType: '-',
  publicStatus: '-',
  owner: '-',
  developLanguage: '-',
  applicableScenario: '-',
  businessObject: '-',
  createTime: '-',
  notes: '-',
  updateTime: '-'
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
// 初始化方法：根据业务对象ID模拟接口请求并赋值 baseInfoObj
function initInfo(businessId: string) {
  // 这里可以替换为实际接口请求
  setTimeout(() => {
    // 示例：直接赋值为图片内容
    baseInfoObj.value = {
      name: 'A2O外回流比推理模型',
      modelType: '数据规则模型',
      publicStatus: '公开模型',
      owner: '组织',
      developLanguage: 'Python',
      applicableScenario: '工艺',
      createTime: '2024-01-01 00:00:00',
      notes: '根据历史参数，构建 外回流比（r）动态控制策略优化方案\n' +
          '梳理已有参数如下：进水流量、外回流流量、进水氨氮、进水TN、出水氨氮、出水TN、厌氧段ORP、缺氧段ORP、好氧段DO；',
      updateTime: '2025-01-01 00:00:00'
    }
  }, 500)
}

watch(()=>props.currentModelDetail,(val)=>{
  console.log(val,'val====-=')
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
  //   baseInfoObj.value = props.currentModelMachine
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
</style>
