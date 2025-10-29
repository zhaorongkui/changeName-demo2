<template>
  <el-dialog v-model="dialogVisible" title="版本管理" width="50%" @close="handleClose" destroy-on-close :close-on-click-modal="false">
    <div class="bg-white p-3 px-7">
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
          <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.modelName" />
        </el-form-item>
        <el-form-item label="模型类型" prop="modelType">
          <el-select v-model="ruleForm.modelType" placeholder="请选择">
            <el-option
                v-for="item in modelTypeOptionsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型公开" prop="modelOpen">
          <el-select v-model="ruleForm.modelOpen" placeholder="请选择">
            <el-option
                v-for="item in modelOpenOptionsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型所有者" prop="modelOwner">
          <el-select v-model="ruleForm.modelOwner" placeholder="请选择">
            <el-option
                v-for="item in modelOwnerOptionsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编程语言" prop="devLanguage">
          <el-input maxlength="50"  show-word-limit v-model="ruleForm.devLanguage" placeholder="请输入"  />
        </el-form-item>
        <el-form-item label="模型适用场景" prop="modelApplicableScenarios">
          <el-select v-model="ruleForm.modelApplicableScenarios" placeholder="请选择">
            <el-option
                v-for="item in modelApplicableScenariosOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型描述" prop="modelDescribe">
          <el-input maxlength="100" show-word-limit v-model="ruleForm.modelDescribe"  :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" />
        </el-form-item>
      </el-form>

    </div>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 0 0;margin-bottom: 10px">
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
            <el-button type="primary" @click="submitForm">下一步</el-button>
          </template>
        </el-popover>

      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {ref, reactive, PropType, computed} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {modelTypeOptions} from "~/views/model-management/model-plaza/mockData";

interface RuleForm {
  modelName: string
  modelType: string
  modelOpen: string
  modelOwner: string
  devLanguage: string
  modelApplicableScenarios: string
  modelDescribe: string
}
let popoverVisible =ref (false)
let dialogVisible = ref(true)
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
const modelOpenOptionsoptions =ref([
  {
    value: '1',
    label: '公开模型',
  },
  {
    value: '2',
    label: '非公开模型',
  },
])
const modelOwnerOptionsoptions =ref([
  {
    value: '1',
    label: '个人',
  },
  {
    value: '2',
    label: '所在组织',
  },
])
const emits = defineEmits(['close'])
const modelApplicableScenariosOptions = ref([
  {
    value: '1',
    label: '工艺',
  },
  {
    value: '2',
    label: '设备',
  },
])
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  modelName: '污泥膨胀预测模型',
  modelType: '数据规则模型',
  modelOpen: '公开模型',
  modelOwner: '个人',
  devLanguage: 'Python',
  modelApplicableScenarios: '工艺',
  modelDescribe: '可以使用',
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
  modelOwner: [
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
  modelApplicableScenarios: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  modelDescribe: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})

const submitForm = async () => {
  if (!ruleFormRef.value) return

  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('表单校验通过！')
      popoverVisible.value = true // ✅ 校验通过后，手动显示 Popover（操作选项）
    } else {
      console.log('表单校验失败！', fields)
    }
  })
}

const handleClose = ()=> {
  emits('close')
}
// 点击下一步-模型训练
const handleModelTrain = ()=> {

}
// 点击下一步-数据规则模型
const handleDataRuleModel = ()=> {

}
</script>
<style scoped lang="postcss">
.table-search{
  width: 100%;
  @apply flex justify-between;
  .table-search-item{
    @apply flex ;
  }
}
</style>
