<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-19 17:14:19
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 09:32:58
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\resource-application\components\ReviewRecordModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose" destroy-on-close :close-on-click-modal="false">
    <div class="modal-container">
      <div class="main-content">
        <div class="open-modal-form">
          <el-form :model="addDataForm" ref="addFormRef" :rules="rules" label-width="100" class="w-full m-auto">
            <el-form-item :label="`数据集名称:`" prop="name">
              <!-- <el-input v-model="addDataForm.name" :placeholder="`请输入数据集名称`" clearable  /> dataSetList-->
              <el-select v-model="addDataForm.name" class="m-2" size="large" @change="changeItem">
                <el-option v-for="item in dataSetList" :key="item.id" :label="item.datasetName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="组织维度:" prop="orgName" disabled>
                <el-input v-model="addDataForm.orgName" placeholder="请输入组织维度" clearable disabled />
            </el-form-item>
            <el-form-item label="时间范围:" prop="dateRange" disabled>
              <el-date-picker v-model="addDataForm.dateRange" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" disabled />
            </el-form-item>
            <el-form-item label="数据集用途:" prop="openPurpose">
              <el-input v-model="addDataForm.openPurpose" placeholder="请输入数据集用途" clearable />
            </el-form-item>

            <el-form-item label="公开范围:" prop="openScope">
              <el-select v-model="addDataForm.openScope" placeholder="请选择公开范围" clearable @change="changeOpenScope">
                <el-option label="全行业" value="1" />
                <el-option label="特定组织" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="组织名称:" prop="orgNameId" v-if="addDataForm.openScope === '2'">

<!--              <OrgSelect v-model="addDataForm.orgNameId" :show-checkbox="true" :multiple="true"-->
<!--                                    :cascader="true" @update:modelValue="handleCheckedNodes" />-->
              <el-tree-select
                  class="org-tree-select"
                  node-key="orgId"
                  v-model="addDataForm.orgNameId"
                  :data="treeData"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :props="propsTree"
                  show-checkbox
                  placeholder="请选择"
                  style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DatasetType } from '@/types/dataSandbox'
import {getNamesStringByOrgIdsOptimized, initTreeData} from '@/utils/dataSandbox'


const emit = defineEmits(['close', 'success', 'submit'])
interface DataSetItem {
  id: string | number
  datasetName: string
  beginTime?: string
  endTime?: string
  orgName?: string
}
const props = defineProps<{
  dataSetList: DataSetItem[]
}>()
const treeData = ref([])
const propsTree = ref( {
  label: 'name',
  children: 'children',
  value: 'orgId',
})
const dialogVisible = ref(true)
const dialogTitle = ref('数据公开')

const addFormRef = ref()
const addDataForm = ref<DatasetType>({} as DatasetType)
const rules = {
  name: [{ required: true, message: '请输入数据集名称', trigger: 'blur' }],
  orgName: [{ required: false, message: '请输入组织维度', trigger: 'blur' }],
  dateRange: [{ required: false, message: '请选择时间范围', trigger: 'change' }],
  openPurpose: [{ required: false, message: '请输入数据集用途', trigger: 'blur' }],
  openScope: [{ required: true, message: '请选择公开范围', trigger: 'change' }],
  orgNameId: [{ required: true, message: '请选择组织名称', trigger: 'change' }]
}
const handleCheckedNodes = (nodes) => {
  addDataForm.value.orgNameId = nodes; // 同步到queryData,临时处理
};
function handleClose() {
  dialogVisible.value = false
  emit('close')
}
const changeItem = (e) => {
  // 根据选中的value在原数组中匹配对应的item
  const selectedItem = props.dataSetList.find(item => item.id === e);
  console.log(selectedItem,'selectedItem')
  if (selectedItem) {
    addDataForm.value.orgName = getNamesStringByOrgIdsOptimized(selectedItem.orgId) ;
    addDataForm.value.dateRange = [selectedItem.beginTime, selectedItem.endTime];
    addDataForm.value.dataId = selectedItem.id;
    console.log('选中的完整选项数据：', selectedItem, addDataForm);
    // 这里可以使用selectedItem的所有属性（label、desc、extra等）
  }
}
const changeOpenScope = (e)=> {
  console.log(e);
  if(e === '1'){
    addDataForm.value.orgNameId = '';
  }
}
function handleConfirm() {
  const formRef = addFormRef.value as any
  if (!formRef) return
  formRef.validate((valid: boolean) => {
    if (valid) {

      if(addDataForm.value.orgNameId){
        addDataForm.value.orgNameId = addDataForm.value.orgNameId!.join(',')
      }
      emit('submit', addDataForm.value)
      handleClose()
    }
  })
}

onMounted(() => {
  treeData.value = initTreeData()
})
</script>

<style lang="scss" scoped>
.modal-container {
  .main-content {
    .open-modal-form {
      flex: 1;
    }
  }
}
</style>
