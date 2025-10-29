<template>
  <el-dialog
      v-model="dialogVisible"
      title="确认发布"
      width="30%"
      @close="handleClose"
      :close-on-click-modal="false"
  >
    <div class="content">

      <el-icon style="color: #E6A23C;margin-right: 10px;vertical-align: text-bottom" size="18px"><WarningFilled /></el-icon>
      <span style="display: inline-block;font-size: 16px">确定发布当前 {{currentModel.modelVersion}}版模型？</span>
      <el-form
          ref="formRef"
          :model="formInfo"
          :rules="formRules"
          label-width="80px"
          style="margin-top: 20px"
      >
        <el-form-item label="使用说明" prop="instructions">
          <el-input
              v-model="formInfo.instructions"
              :rows="4"
              type="textarea"
              placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {ElMessage, ElMessageBox,} from 'element-plus'
import { WarningFilled } from'@element-plus/icons-vue'
import {getModelMachineRelease} from "~/api/modelManage";
const dialogVisible = ref(true)
const loading = ref(false)
const props = defineProps({
  currentModel:{
    type: Object,
    default: null
  }
})
const emits  = defineEmits(['close','submit'])
const formInfo = ref({
  instructions: ''
})
const formRef = ref()
// 表单校验规则
const formRules = {
  instructions: [
    {
      required: true,
      message: '请输入使用说明',
      trigger: 'blur'
    }
  ]
}
const handleClose = (done: () => void) => {
  emits('close')
}
// 确定
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      getModelMachineRelease({
        id: props.currentModel.id,
        instructions: formInfo.value.instructions,
      }).then(res => {
        if(res.success){
          ElMessage.success(res.message)
          emits('close')
        }else{
          ElMessage.error(res.message)
        }
      }).finally(() => {
        loading.value = false
      })
    } else {
    }
  })
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.content{
  background: #fff;
  padding: 20px;
}
</style>
