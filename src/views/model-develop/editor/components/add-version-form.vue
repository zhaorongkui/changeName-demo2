<template>
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
      label-position="top"
  >
    <el-form-item label="模型名称" prop="modelName">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" disabled v-model="ruleForm.modelName" />
    </el-form-item>
    <el-form-item label="模型类型" prop="modelType" disabled="">
      <el-select v-model="ruleForm.modelType" placeholder="请选择" disabled>
        <el-option
            v-for="item in modelTypeOptionsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="版本" prop="modelVersion">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" disabled  v-model="ruleForm.modelVersion" />
    </el-form-item>
    <el-form-item label="版本别名" prop="versionAlias" >
      <el-input maxlength="50"  show-word-limit placeholder="请输入"  v-model="ruleForm.versionAlias" />
    </el-form-item>
    <el-form-item label="模型公开" prop="publicStatus">
      <el-select v-model="ruleForm.publicStatus" placeholder="请选择">
        <el-option
            v-for="item in modelPublicOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="编程语言" prop="developmentLanguage">
      <el-input maxlength="50"  show-word-limit v-model="ruleForm.developmentLanguage" placeholder="请输入"  />
    </el-form-item>

    <el-form-item label="版本描述" prop="versionDescribe">
      <el-input maxlength="100" show-word-limit v-model="ruleForm.versionDescribe"  :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  modelName: string
  modelType: string
  publicStatus: string
  modelVersion: string
  developmentLanguage: string
  versionDescribe?: string
  versionAlias?: string
}
const props = defineProps({
  currentModel:{  //当前模型
    type: Object,
    default: {}
  },
})
const modelTypeOptionsoptions = ref([
  {
    value: '1',
    label: '机器学习',
  },
  {
    value: '2',
    label: '智能体',
  },
  {
    value: '3',
    label: '数据规则模型',
  },
])


const modelPublicOptions = ref([
  {
    value: '1',
    label: '公开模型',
  },
  {
    value: '2',
    label: '未公开模型',
  },
])
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
  modelName: '',
  modelType: '',
  publicStatus: '', //模型公开
  modelVersion: 'V4', //当前版本
  developmentLanguage: '', //编程语言
  versionAlias: '',//版本别名
})

const rules = reactive<FormRules<RuleForm>>({
  modelName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  modelType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  modelOpen: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],

  devLanguage: [
    {
      required: true,
      message: '请输入',
      trigger: 'change',
    },
  ],
  versionAlias: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  versionDescribe: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
    } else {
    }
  })
}

onMounted(()=>{
  if(Object.keys(props.currentModel).length>0){
    ruleForm.value.modelName = props.currentModel.modelName
    ruleForm.value.modelType = props.currentModel.modelType
    ruleForm.value.publicStatus = props.currentModel.publicStatus
    ruleForm.value.modelVersion = props.currentModel.modelVersion
    ruleForm.value.developmentLanguage = props.currentModel.developmentLanguage
  }
})

defineExpose({
  ruleFormRef
})
</script>
