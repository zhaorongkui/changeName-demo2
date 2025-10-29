<template>
  <el-drawer title="创建模型训练" v-model="dialogVisible" size="80%" @close="handleClose" :modal="false">
    <div class="bg-white p-3 px-7" style="width: 100%;height: 100%; ">
      <div style="display: flex; justify-content: center; align-items: center;">
      <el-steps :active="active" style="width: 60%"  class="stepsBox" >
        <el-step :title="getStepTitle(0)" description="模型上传指南" />
        <el-step :title="getStepTitle(1)" description="模型在线训练" />
      </el-steps>
      </div>
      <div v-show="active == 0" class="uoload-content">
        <uploadFuide></uploadFuide>
      </div>
      <div v-show="active == 1" class="uoload-content">
        <trainForm ref="trainFormInfo" :pageType="pageType" :currentModel="currentModel"></trainForm>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" v-if="active ==0">取消</el-button>
        <el-button @click="handleUp" v-if="active == 1">上一步</el-button>
        <el-button type="primary" @click="next" v-if="active==0">已上传，创建模型在线训练</el-button>
        <el-button type="primary" @click="startTraing" v-if="active ==1">开始在线训练</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import uploadFuide from './uploadGuide.vue'
import trainForm from './trainForm.vue'
import {getSaveTrain} from '@/api/modelManage'
import {ElMessage} from "element-plus";
const dialogVisible = ref(true)
const props = defineProps({
  currentModel:{
    type: Object,
    default: () => {}
  },
  pageType: {
    type: String,
    default: ''
  }
})
const trainFormInfo = ref()
const active = ref(0)
// const trainForm = ref()
const emits = defineEmits(['close'])
const handleClose = ()=>{
  emits('close')
}
const handleUp = ()=>{
  active.value = 0
}
// 根据步骤索引和active值，返回对应标题
const getStepTitle = (index) => {
  if (index < active.value) {
    // 步骤索引小于active：已完成
    return '已完成';
  } else if (index === active.value) {
    return '进行中';
  } else {
    return '待进行';
  }
};
const next = ()=> {
  active.value = 1
}
const startTraing = ()=>{
  trainFormInfo.value.ruleFormRef.validate((valid: boolean) => {
    if (valid) {
      getSaveTrain(trainFormInfo.value.ruleForm).then(res =>{
        if(res.success){
          ElMessage.success(res.message)
          handleClose()
        }
      })
    }
  })

}
</script>
<style scoped>
:deep(.el-drawer__body .el-form-item) {
  flex-direction: row !important;
}

.resource-radio :deep(.el-radio__inner) {
  width: 16px;
  height: 16px;
}
.resource-radio :deep(.el-radio__inner::after) {
  width: 6px;
  height: 6px;
}

.uoload-content{
  height: calc( 100vh - 260px);
  width: 100%;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
}

:deep(.el-step__description){
  font-size: 16px;
  font-weight: bold;
}
</style>
