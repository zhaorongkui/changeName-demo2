<template>
  <el-drawer :model-value="props.drawerVisible" @update:model-value="" title="I am the title" :with-header="false" :modal="false"
    width="600px" :before-close="handleClose" size="40%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="BaseInfo">
        <div class="drawer-content">
          <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
            <el-form-item label="所属业务实体" required prop="businessObject">
              <el-select v-model="formData.businessObject" placeholder="请选择所属业务实体" style="width: 100%">
                <!-- businessObject -->
                <el-option v-for="item in selectBusinessObjectTypeList" :key="item.id" :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据分类" required prop="dataType">
              <el-select v-model="formData.dataType" placeholder="请选择数据分类" style="width: 100%">
                <el-option v-for="item in dataTypeList" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据更新频率" required prop="dateDim">
              <el-select v-model="formData.dateDim" placeholder="请选择数据更新频率" style="width: 100%">
                <el-option v-for="item in dateDimList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="逻辑数据模型" required prop="dataModelIds">
              <el-select v-model="formData.dataModelIds" placeholder="请选逻辑数据模型" style="width: 100%">
                <!-- businessDomainList -->
                <el-option v-for="item in dataModelIdsList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务应用场景" required prop="businessScenarios">
              <el-select v-model="formData.businessScenarios" placeholder="请选择数据来源" style="width: 100%">
                <el-option v-for="item in reportTypeOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="版本信息" required prop="versionInfo">
              <el-input v-model="formData.versionInfo" placeholder="请输入版本信息" />
            </el-form-item>
            <el-form-item label="状态" required prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
                <el-option label="草稿" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="访问权限" required prop="accessPermissions">
              <el-select v-model="formData.accessPermissions" placeholder="请选择访问权限" style="width: 100%">
                <el-option label="受权限控制" value="1" />
                <el-option label="公开访问" value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="详情" name="dataSet">
        <el-button type="primary" @click="addItem" class="mb-5">
          新增
        </el-button>
        <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
          @command="onCommand" />
      </el-tab-pane>

    </el-tabs>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog v-model="dialogVisible" :title="'选择指标'" :before-close="dialogClose" destroy-on-close :close-on-click-modal="false">
    <div class="modal-container">
      <div class="main-content">
        中间体
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { LogicalDataModel } from '../logicalMockData'
import { saveOrUpdateDataType } from '@/api/backStageManage'

interface BusinessDomainItem {
  dictCode: string
  dictName: string
}

interface DetailObjectType {
  entityCode?: string
  entity?: string
  fieldCount?: string
  businessDomain?: string
  dataSource?: string
  businessDefinition?: string
  businessRules?: string
  responsibleDepartment?: string
  versionInfo?: string
  lifecycleStatus?: string
  accessPermissions?: string
}

const props = defineProps<{
  itemId: String,
  drawerVisible: boolean
  detailObject: {}
  dateDimList: BusinessDomainItem[]
  selectBusinessObjectTypeList: any[],
  dataTypeList: any[],
  reportTypeOptions: any[],
  dataModelIdsList: any[],
  dataSourceList: any[]
}>()
const tableData = ref([{}, {}])
const emit = defineEmits<{
  'update:drawerVisible': [value: boolean]
  'submit': []
}>()


const activeName = ref('BaseInfo')
const formRef = ref()
const formData = ref({
  id: '',
  businessObject: '',
  dataType: '',
  dateDim: '',
  dataModelIds: '',
  versionInfo: '',
  status: '',
  businessScenarios: '',
  accessPermissions: '',
})
import type { FormRules } from 'element-plus'
const getDetailValue = (row) => {
  console.log(props.detailObject, 454545454, row);
  formData.value.id = row.itemId,
  formData.value.businessObject = row.businessObject,
  formData.value.dataType = row.dataType,
  formData.value.dateDim = row.dateDim,
  formData.value.dataModelIds = row.dataModelIds,
  formData.value.versionInfo = row.versionInfo,
  formData.value.status = row.status,
  formData.value.businessScenarios = row.businessScenarios,
  formData.value.accessPermissions = row.accessPermissions
}
const rules = ref<FormRules>({
  entity: [{ required: true, message: `请输入实体/表名`, trigger: ['blur', 'change'] }],
  entityCode: [{ required: true, message: `请输入实体编码`, trigger: ['blur', 'change'] }],
  fieldCount: [{ required: true, message: `请输入字段数量`, trigger: ['blur', 'change'] }],
  businessDomain: [{ required: true, message: `请选择业务域`, trigger: ['blur', 'change'] }],
  dataSource: [{ required: true, message: `请选择数据来源`, trigger: ['blur', 'change'] }],
  businessDefinition: [{ required: true, message: `请输入业务定义`, trigger: ['blur', 'change'] }],
  businessRules: [{ required: true, message: `请输入业务规则`, trigger: ['blur', 'change'] }],
  responsibleDepartment: [{ required: true, message: `请输入责任部门`, trigger: ['blur', 'change'] }],
  versionInfo: [{ required: true, message: `请输入版本信息`, trigger: ['blur', 'change'] }],
  lifecycleStatus: [{ required: true, message: `请选择生命周期状态`, trigger: ['blur', 'change'] }],
  accessPermissions: [{ required: true, message: `请选中访问权限`, trigger: ['blur', 'change'] }],
})
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('update:drawerVisible', false)
    resetForm()
    done()
  }).catch(() => {
    // 用户取消关闭
  })
}
// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'entity',
    label: '字段名称',
    align: 'center'
  },
  {
    prop: 'entityCode',
    label: '字段描述',
    align: 'center'
  },
  {
    prop: 'fieldCount',
    label: '字段类型',
    align: 'center'
  },
  {
    prop: 'businessDomain',
    label: '数据模型',
    align: 'center'
  },
  {
    prop: 'dataSource',
    label: '单位',
    align: 'center'
  },
  {
    type: 'actions',
    label: '操作',
    align: 'center',
    buttons: [
      {
        name: '删除',
        command: 'detelt',
        type: 'primary'
      }
    ]
  }
])
// 操作命令处理
const onCommand = (command: string, row: LogicalDataModel) => {
  switch (command) {
    case 'detelt':
      handleViewDetelt(row)
      break
  }
}
const handleViewDetelt = (row) => {

}
const dialogVisible = ref(false)
const addItem = () => {
  // 新增数据
  dialogVisible.value = true;

}
const dialogClose = () => {
  dialogVisible.value = false;
}
// 添加数据
const handleConfirm = () => {

}
const resetForm = () => {
  formData.value = {
    businessObject: '',
    dataType: '',
    dateDim: '',
    dataModelIds: '',
    versionInfo: '',
    status: '',
    businessScenarios: '',
    accessPermissions: '',
  }

}
const handleSubmit = async () => {
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessageBox.confirm('确认提交数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const newItem: LogicalDataModel = {
        //   ...formData.value,
        //   attributeNameCount: formData.value.attributeNameCount || '0'
        // }
        const formObj = {
          id: props.itemId,
          businessObject: formData.value.businessObject,
          dataType: formData.value.dataType,
          dateDim: formData.value.dateDim,
          dataModelIds: formData.value.dataModelIds,
          versionInfo: formData.value.versionInfo,
          status: formData.value.status,
          businessScenarios: formData.value.businessScenarios,
          accessPermissions: formData.value.accessPermissions
        }
        saveOrUpdateDataType(formObj).then((res) => {
          console.log(556565656, res);
          if (res.code === 0) {
            emit('submit')
            emit('update:drawerVisible', false)
            resetForm()
            ElMessage.success(res.message || '提交成功')
          }
        })
        return
      }).catch(() => {
        // 用户取消提交
      })
    }
  })

}
defineExpose({
  getDetailValue
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

.el-drawer__body .el-form-item {
  flex-direction: row;
}
</style>