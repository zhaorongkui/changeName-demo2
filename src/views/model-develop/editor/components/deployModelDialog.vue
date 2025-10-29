<template>
  <el-dialog v-model="dialogVisible" title="部署模型" @close="handleClose" destroy-on-close :close-on-click-modal="false">
    <div class="bg-white p-3 px-7">
      <el-form :model="dataForm" ref="addFormRef" :rules="rules" label-width="100" class="w-full m-auto">
        <el-form-item label="部署模型" prop="modelName">
          <el-input v-model="dataForm.modelName" disabled clearable />
        </el-form-item>
        <el-form-item label="部署方式" prop="deploymentMethod">
          <el-input v-model="dataForm.deploymentMethod" disabled clearable />
        </el-form-item>
        <el-form-item label="应用名称" prop="applyName">
          <el-input v-model="dataForm.applyName" maxlength="50" :show-word-limit="true" clearable />
        </el-form-item>
        <el-form-item label="配置文件">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">上传文件</el-button>
            <!--            <template #tip>-->
            <!--              <div class="el-upload__tip">-->
            <!--                jpg/png files with a size less than 500KB.-->
            <!--              </div>-->
            <!--            </template>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="其他要求">
          <el-input
            v-model="dataForm.description"
            :autosize="{ minRows: 10, maxRows: 10 }"
            type="textarea"
            maxlength="100"
            :show-word-limit="true"
            placeholder="请输入"
            class="border"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">取消</el-button>
        <!-- <el-button type="primary" @click="handleSubmit">确定</el-button> -->
        <el-button type="primary" @click="handleSubmit">提交申请</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, PropType, onMounted } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { tagTypeList } from '@/api/tagType'
import { tagList } from '@/api/tag'
// 模型接口
import { modelSave } from '@/api/model'
// 数据集接口
import { datasSave } from '@/api/dataSet'
interface ModelForm {
  id?: string | number
  deploymentMethod: string
  modelName: string
  applyName: string
  description?: string
  licence?: string
}
const fileList = ref([])
// 定义组件暴露的事件
const emit = defineEmits(['close', 'success', 'next'])
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  deployObjectCurrent: {
    type: Object,
    default: () => ({})
  }
})
// 对话框可见状态
const dialogVisible = ref(true)
// 对话框标题
const dialogTitle = ref(props.isEdit ? '编辑数据集' : '添加数据集')

// 获取标签类型列表
const tagTypeLIstData = ref([])
const getTagTypeFn = () => {
  tagTypeLIstData.value = []
  tagTypeList().then((res) => {
    const { data } = res
    tagTypeLIstData.value = data
  })
}

getTagTypeFn()

const dataForm = ref({
  modelName: '',
  deploymentMethod: '',
  description: '',
  applyName: '',
  licence: ''
})
const rules = ref<FormRules>({
  modelName: [{ required: true, message: `请输入数据集名称`, trigger: ['blur', 'change'] }],
  deploymentMethod: [{ required: true, message: `请选择`, trigger: ['blur', 'change'] }],
  applyName: [{ required: true, message: `请输入`, trigger: ['blur', 'change'] }],
  licence: [{ required: true, message: `请选择`, trigger: ['blur', 'change'] }]
})
// 获取标签列表
const tagListData = ref([])

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  emit('close')
}
// 点击了确定按钮
const addFormRef = ref()
const handleSubmit = async () => {
  await addFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('close')
    }
  })
}

const handleNext = () => {
  // 这里可以添加下一步的逻辑

  emit('next', dataForm.value)
  ElMessage.info('下一步操作')
  handleClose()
}
onMounted(() => {
  if (Object.keys(props.deployObjectCurrent).length > 0) {
    dataForm.value.modelName = props.deployObjectCurrent.versionAlias
    dataForm.value.deploymentMethod = props.deployObjectCurrent.AIframework
  }
})

// ✅ 删除文件
const handleRemove = (file: File, fileList: File[]) => {
  console.log('删除文件:', file, fileList)
}
// ✅ 上传成功
const handleUploadSuccess = (response: any, file: File, fileList: File[]) => {
  console.log('上传成功！', response, file, fileList)
  // 可以在这里处理上传成功逻辑，比如保存 response 中的文件 URL 到表单数据中
}
// ✅ 上传失败
const handleUploadError = (error: any, file: File, fileList: File[]) => {
  console.error('上传失败！', error, file, fileList)
  // 可以提示用户上传失败
}
// ✅ 上传前钩子
const beforeUpload = (file: File) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt500K = file.size / 1024 < 500

  if (!isJPGorPNG) {
    console.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt500K) {
    console.error('图片大小不能超过 500KB!')
    return false
  }
  console.log('上传前校验通过:', file)
  return true
}
</script>
<style scoped lang="scss">
.text-center {
  padding: 0 !important;
}
</style>
