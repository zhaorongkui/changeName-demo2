<template>
<!--  新建版本-->
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" @close="handleClose">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="模型信息" name="first">
        <addVersionForm ref="modelFormRef"></addVersionForm>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 0 0;">
        <el-button @click="handleClose">取消</el-button>
        <el-popover
            placement="top-start"
            :visible="popoverVisible"
            :width="200"
            content=""
        >
          <div>
            <p><el-button  style="width: 100%; margin-bottom: 8px;" @click="handleModelTrain">模型训练</el-button></p>
            <p><el-button   style="width: 100%; margin-bottom: 8px;" @click="handleDataRuleModel">数据规则模型</el-button></p>
          </div>
          <template #reference>
            <el-button type="primary" @click="handleConfirmNext">下一步</el-button>
          </template>
        </el-popover>

      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import addVersionForm from './add-version-form.vue'
import {useRouter} from "vue-router";
import addModelDataset from './add-mode-dataset.vue'
import addModelParameterConfig from './add-model-parameter-config.vue'
const drawer = ref(true)
const activeName = ref('first')
const popoverVisible = ref(false)
const modelFormRef = ref()
const emits = defineEmits(['close', 'confirmNext'])
const handleClick = (tab: TabsPaneContext, event: Event) => {
}
const handleClose = ()=> {
  emits('close')
}
const handleConfirmNext = ()=> {
  if (!modelFormRef.value) {
    console.error('未获取到子组件实例')
    return
  }
  modelFormRef.value.ruleFormRef.validate((valid: boolean) => {
    if (valid) {
      popoverVisible.value = true
      // ✅ 校验通过，比如跳转到下一个 tab 或者提交数据
    } else {
    }
  })
}
const router = useRouter()
// 点击下一步-模型训练
const handleModelTrain = ()=> {
  router.push({
    path: '/model-management/model-train',
    query: {
      // modelId: data.modelID
    }
  })
}
// 点击下一步-数据规则模型
const handleDataRuleModel = ()=> {
  emits('confirmNext', 'dataRuleModel')
}


</script>
<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
:deep(.el-tabs__item){
  font-size: 18px;
}
</style>
