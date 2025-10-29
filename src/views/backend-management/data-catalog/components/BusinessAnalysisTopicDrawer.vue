<template>
  <el-drawer
      v-model="drawer"
    :title="`${titleText}业务分析主题`"
    width="600px"
    @close="handleClose"
      :modal="false"
  >
    <div class="drawer-content">
      <el-form ref="formRef" label-position="top"  :rules="rules" :model="formData" label-width="120px" >
        <el-form-item label="主题名称"  prop="categoryName">
          <el-input v-model="formData.categoryName" placeholder="请输入主题名称" />
        </el-form-item>
        <el-form-item label="主题编码" prop="categoryCode">
          <el-input v-model="formData.categoryCode" placeholder="请输入主题编码" />
        </el-form-item>
        <el-form-item label="所属分类" prop="parentCategory">
          <el-select v-model="formData.parentCategory" placeholder="请选择分类" style="width: 100%">
            <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主题描述" prop="categoryDescription">
          <el-input v-model="formData.categoryDescription" type="textarea" :rows="3" placeholder="请输入主题描述" />
        </el-form-item>
        <el-form-item label="业务负责人" prop="businessOwner">
          <el-input v-model="formData.businessOwner" placeholder="请输入业务负责人" />
        </el-form-item>
        <el-form-item label="数据负责人" prop="dataOwner">
          <el-input v-model="formData.dataOwner" placeholder="请输入数据负责人" />
        </el-form-item>
        <el-form-item label="关联报表" prop="relatedReports">
          <el-select v-model="formData.relatedReports" placeholder="请选择关联报表" style="width: 100%">
            <el-option
                v-for="item in reportOptions"
                :key="item.id"
                :label="item.reportName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="() => handleClose(() => {})">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, defineEmits, defineProps, reactive, onMounted} from 'vue'
import {ElMessage, ElMessageBox, FormInstance, FormRules} from 'element-plus'
import {getBusinessDetail, getBusinessReportsList, getSaveOrUpdateBu} from '@/api/backStageManage'
const drawer = ref(true)
const emits =defineEmits(['close'])
const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true
  },
  currentTopic: {
    type: Object,
    default:{}
  }
})
const titleText = ref('新增')
const formData = ref({
  categoryCode: '',
  categoryName: '',
  categoryDescription: '',
  businessOwner: '',
  dataOwner: '',
  category: '',
  relatedReports: '',
  parentCategory:'',
})

const handleClose = (done: () => void) => {
  emits('close')
}
const resetForm = () => {
  formData.value = {
    categoryCode: '',
    categoryName: '',
    categoryDescription: '',
    businessOwner: '',
    dataOwner: '',
    category: '',
    relatedReports: ''
  }
}
const rules = reactive<FormRules<RuleForm>>({
  categoryName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  categoryCode: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  categoryDescription: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  businessOwner: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  relatedReports: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  category: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  dataOwner: [
    {
      required: true,
      message: '请输入',
      trigger: 'change',
    },
  ],
})
const categoryOptions = ref([
  {
    label:'水量',
    value:'水量',
  },
  {
    label:'电量',
    value:'电量',
  },
  {
    label:'污泥',
    value:'污泥',
  },
  {
    label:'药剂',
    value:'药剂 ',
  },
  {
    label:'水质',
    value:'水质',
  },
  {
    label:'设备',
    value:'设备',
  },
  {
    label:'设施',
    value:'设施',
  },
  {
    label:'工单',
    value:'工单',
  },
  {
    label:'经营',
    value:'经营',
  },

])
const reportOptions = ref([])
const getReportData = () => {
  getBusinessReportsList().then(res => {
    if(res.success){
      reportOptions.value = res.data
    }
  })
}
getReportData()
const currentId = ref(null)
const formRef = ref<FormInstance>()
const submitForm = async () => {
  if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        getSaveOrUpdateBu({
          id: props.isEdit ? currentId.value : null,
          categoryName: formData.value.categoryName,
          categoryCode: formData.value.categoryCode,
          parentCategory: formData.value.parentCategory,
          categoryDescription: formData.value.categoryDescription,
          businessOwner: formData.value.businessOwner,
          dataOwner: formData.value.dataOwner,
          relatedReports: formData.value.relatedReports,

        }).then(res=>{
          if(res.success){
            ElMessage.success(res.message)
            handleClose()
          }
        })
      }
    })

}
onMounted(()=>{
  if(props.isEdit){
    titleText.value = '编辑'
    getBusinessDetail(props.currentTopic.id).then(res =>{
      if(res.success){
        formData.value.categoryName =  res.data.categoryName
        formData.value.categoryCode =  res.data.categoryCode
        formData.value.parentCategory =  res.data.parentCategory
        formData.value.categoryDescription =  res.data.categoryDescription
        formData.value.businessOwner =  res.data.businessOwner
        formData.value.dataOwner =  res.data.dataOwner
        formData.value.relatedReports =  res.data.relatedReports
        currentId.value = res.data.id
      }
    })
  }
})
</script>

<style scoped lang="postcss">
.drawer-content {
  padding: 20px 0;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}
</style>
