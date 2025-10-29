<template>
  <!-- 配置弹窗 -->
  <el-dialog
      v-model="dialogVisible"
      title="配置"
      width="60%"
      @close="handleClose"
      :close-on-click-modal="false"
  >
    <div class="container">
    <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
        label-position="right"
        :rules="formRules"
    >
      <!-- Notebook名称 -->
      <el-form-item label="Notebook名称" prop="notebookName">
        <span>{{formData.notebookName}}</span>
<!--        <el-input-->
<!--            v-model="formData.notebookName"-->
<!--            placeholder="请输入Notebook名称"-->
<!--            clearable-->
<!--        />-->
      </el-form-item>

      <!-- 编程语言 -->
      <el-form-item label="编程语言" prop="developLanguage">
        <el-select
            v-model="formData.developLanguage"
            placeholder="请选择编程语言"
            style="width: 100%"
            filterable
        >
          <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- AI框架 -->
      <el-form-item label="AI框架" prop="aiFramework">
        <el-select
            v-model="formData.aiFramework"
            placeholder="请选择AI框架"
            style="width: 100%"
            filterable
        >
          <el-option
              v-for="item in frameworkOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 资源规格 -->
      <el-form-item label="资源规格" prop="resourceSpec">
        <el-table
            :data="resourceOptions"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            highlight-current-row
        >
          <!-- 名称列 -->
          <el-table-column prop="name" label="名称" width="120" >
            <template #default="{ row }">
              <el-radio
                  v-model="selectedResourceName"
                  :label="row.name"
                  @change="handleResourceChange(row)"
                  class="resource-radio"
              />
            </template>
          </el-table-column>>
          <!-- 规格列 -->
          <el-table-column prop="spec" label="规格" />
          <!-- 价格列 -->
          <el-table-column prop="price" label="价格">
            <template #default="{ row }">
              <el-tag v-if="row.free" type="success">限时免费</el-tag>
              <span v-else>{{ row.price }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认并启动</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const emits = defineEmits(['close'])
// 控制弹窗显示/隐藏
const dialogVisible = ref(true)
const formRef = ref(null)

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true
  // 重置表单
  resetForm()
}

// 关闭前的回调
const handleClose = () => {
  emits('close')
}

// 表单数据
const formData = reactive({
  notebookName: 'NLP通用模板实战演示',
  developLanguage: 'Python 3.7',
  aiFramework: 'PaddlePaddle 2.0.0',
  resourceSpec: 'TeslaGPU_V100_32GB显存单卡_8核 CPU_32GB内存' // 默认选中 GPU V100
})

// 表单验证规则
const formRules = reactive({
  notebookName: [
    { required: true, message: '请输入Notebook名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  developLanguage: [
    { required: true, message: '请选择编程语言', trigger: 'change' }
  ],
  aiFramework: [
    { required: true, message: '请选择AI框架', trigger: 'change' }
  ],
  resourceSpec: [
    { required: true, message: '请选择资源规格', trigger: 'change' }
  ]
})

// 语言选项
const languageOptions = reactive([
  { value: 'Python 3.7', label: 'Python 3.7' },
  { value: 'Python 3.8', label: 'Python 3.8' },
  { value: 'Python 3.9', label: 'Python 3.9' }
])

// AI框架选项
const frameworkOptions = reactive([
  { value: 'PaddlePaddle 2.0.0', label: 'PaddlePaddle 2.0.0' },
  { value: 'TensorFlow 2.5', label: 'TensorFlow 2.5' },
  { value: 'PyTorch 1.9', label: 'PyTorch 1.9' }
])

// 资源规格选项
const resourceOptions = reactive([
  {
    name: 'GPU V100',
    spec: 'TeslaGPU_V100_32GB显存单卡_8核 CPU_32GB内存',
    price: '￥0.5/分钟 当前账户前28.22(小时*节点)免费',
    free: false
  },
  {
    name: 'CPU 2核',
    spec: 'CPU 2核8GB内存',
    price: '限时免费',
    free: true
  },
  {
    name: 'GPU A100',
    spec: 'TeslaGPU_A100_80GB显存单卡_8核 CPU_64GB内存',
    price: '￥2.0/分钟 当前账户前10(小时*节点)免费',
    free: false
  }
])

// 选中的资源名称
const selectedResourceName = ref('GPU V100')

// 处理资源选择变化
const handleResourceChange = (row) => {
  console.log('选中资源:', row)
  formData.resourceSpec = row.spec
}

// 处理表格选择变化（备用方案）
const handleSelectionChange = (selection) => {
  // 这里可以添加额外的选择处理逻辑
  if (selection.length > 0) {
    const selectedRow = selection[0]
    selectedResourceName.value = selectedRow.name
    formData.resourceSpec = selectedRow.spec
  }
}

// 表单重置
const resetForm = () => {
  formData.notebookName = 'NLP通用模板实战演示'
  formData.developLanguage = 'Python 3.7'
  formData.aiFramework = 'PaddlePaddle 2.0.0'
  formData.resourceSpec = 'TeslaGPU_V100_32GB显存单卡_8核 CPU_32GB内存'
  selectedResourceName.value = 'GPU V100'
}

// 确认提交
const handleConfirm = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    // 这里可以添加提交前的逻辑处理
    console.log('表单数据:', formData)

    // 模拟API调用
    ElMessage.loading({
      message: '提交中...',
      duration: 0
    })

    setTimeout(() => {
      ElMessage.closeAll()
      ElMessage.success('配置提交成功')
      handleClose()
    }, 1500)

  } catch (error) {
    console.error('表单验证失败:', error)
    return false
  }
}
</script>

<style scoped>
.container{
  padding: 15px;
  background: #fff;
}
.config-form {
  padding: 0 20px;
}

/* 资源规格表格样式 */
:deep(.el-table__row) {
  cursor: pointer;
}

/* 当前行高亮 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 自定义单选按钮样式 */
.resource-radio {
  margin: 0 auto;
}

.resource-radio :deep(.el-radio__inner) {
  width: 16px;
  height: 16px;
}

.resource-radio :deep(.el-radio__inner::after) {
  width: 6px;
  height: 6px;
}

/* 确保单选按钮列居中 */
:deep(.el-table-column--selection .cell) {
  padding: 0;
  text-align: center;
}

/* 表格行点击效果增强 */
:deep(.el-table__row) {
  transition: background-color 0.2s;
}

:deep(.el-table__row:hover) {
  background-color: #f0f9ff;
}
</style>