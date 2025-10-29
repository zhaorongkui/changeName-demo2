<template>
  <el-drawer v-model="drawer"  title="I am the title" :with-header="false" size="29%" @close="cancelClick">

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="BaseInfo">
        <el-descriptions title="" border :column="1" column-max-width="100px">
          <el-descriptions-item label="业务实体名称">{{ props.currentData.businessObject }}</el-descriptions-item>
          <el-descriptions-item label="编码">{{ props.currentData.catalogCode }}</el-descriptions-item>
          <el-descriptions-item label="所属系统/单元">{{ props.currentData.businessObjectType }}</el-descriptions-item>
          <el-descriptions-item label="对象层级">{{ props.currentData.objectHierarchy }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ statusMap[props.currentData.status.toString()] }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ailabLogicalDataModelDetail } from '@/api/backStageManage'
import { ElMessageBox } from 'element-plus'
const props = defineProps({
  currentData: {
    type: Object,
    default: {}
  }
})
const statusMap = {
  '0': '停用',
  '1': '启用'
}
// 当前tab
const activeName = ref('BaseInfo')
const detailInfo = ref({
  entity: '',
  entityCode: '',
  fieldCount: 0,
  businessDomain: '',
  dataSource: '',
  businessDefinition: '',
  businessRules: '',
  responsibleDepartment: '',
  versionInfo: '',
  lifecycleStatus: '',
  accessPermissions: '',
  title: ''
})
const emits = defineEmits(['close'])
const drawer = ref(true)
const cancelClick = () => {
  emits('close')
}
onMounted(() => {
  console.log(props.currentData, 'ccc')
  ailabLogicalDataModelDetail(props.currentData.id).then(res => {
    if (res.success) {
      detailInfo.value = res.data
    }
  })
})
</script>