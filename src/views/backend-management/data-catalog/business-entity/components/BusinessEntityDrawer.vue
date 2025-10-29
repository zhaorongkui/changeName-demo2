<template>
  <el-drawer :model-value="props.drawerVisible" @update:model-value="handleDrawerUpdate" :title="titleText" direction="rtl"
    size="30%">
    <div class="drawer-content">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px" class="business-entity-form">
        <el-form-item label="业务实体名称" prop="businessObject">
          <el-input v-model="formData.businessObject" placeholder="请输入业务实体" />
        </el-form-item>
        <el-form-item label="编码" prop="">
          <el-input v-model="formData.catalogCode" placeholder="自动生成" :disabled="true" />
        </el-form-item>
        <el-form-item label="对象层级" prop="objectHierarchy">
          <el-select v-model="formData.objectHierarchy" placeholder="请选择对象层级" clearable  @change="selecteChange">
            <el-option v-for="option in props.objectHierarchyList" :key="option.id" :label="option.name"
                :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属系统/单元" prop="parentCatalogId">
          <el-select v-model="formData.parentCatalogId" placeholder="请选择所属系统/单元" clearable>
            <el-option v-for="option in businessObjectTypeList" :key="option.id" :label="option.catalogName"
                :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />

          </el-select>
        </el-form-item>
        <el-form-item label="访问权限" required prop="accessPermissions">
          <el-select v-model="formData.accessPermissions" placeholder="请选择访问权限" style="width: 100%">
            <el-option label="公开访问" value="1" />
            <el-option label="受权限控制" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElDrawer, ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElMessage, ElMessageBox } from 'element-plus'
import { selectBusinessObjectType,} from '@/api/backStageManage.ts'
import { saveOrUpdateUpdate } from '@/api/backStageManage'

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    required: true
  },
  rowData: {
    type: Object,
    default: {}
  },
  objectHierarchyList: {
    type: Array,
  }
})
// const objectHierarchyList = ref([])
const businessObjectTypeList = ref([])
const emit = defineEmits<{
  'update:drawerVisible': [value: boolean]
  'submit': [data: any]
}>()

// 表单数据
const formData = reactive({
  id: '', // 业务实体id
  businessObject: '', // 业务实体名称
  catalogCode: '', // 编码
  objectHierarchy: '', // 对象层级
  parentCatalogId: '', // 所属系统/单元
  status: '', // 状态
  accessPermissions: '', // 访问权限
})

// 表单验证规则
const formRules = reactive({
  businessObject: [
    { required: true, message: '请输入业务实体名称', trigger: 'blur' }
  ],
  parentCatalogId: [
    { required: false, message: '请选择所属系统/单元', trigger: 'change' }
  ],
  objectHierarchy: [
    { required: true, message: '请选择对象层级', trigger: 'change' }
  ],
  // catalogCode: [
  //   { required: false, message: '请选择数据分类', trigger: 'change' }
  // ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  accessPermissions: [
    { required: true, message: '请选择访问权限', trigger: 'change' }
  ],
})
const titleText = ref('新增业务实体')
const selecteChange = (e) => {
  formData.parentCatalogId = '' // 清空所属系统/单元的值
  selectBusinessObjectType(e)
    .then((res) => {
      if (res.success) {
        businessObjectTypeList.value = [];
        businessObjectTypeList.value = res.data;
      }
    })
    .finally(() => {
    })
}
// 表单引用
const formRef = ref()

const handleDrawerUpdate = (value: boolean) => {
  emit('update:drawerVisible', value)
}

const handleCancel = () => {
  // 重置表单
  formRef.value?.resetFields()
  emit('update:drawerVisible', false)
}

const handleConfirm = async () => {
  await formRef.value.validate((valid: boolean) => { 
    // 如果对象层级选了'设施', '设备'，所属系统/单元，必填
    if(['设施', '设备'].includes(formData.objectHierarchy)){
      if(!formData.parentCatalogId){
        ElMessage.error('请选择所属系统/单元选项！')
        return
      }
    }
    if (valid) {
      ElMessageBox.confirm('确认提交数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // emit('submit')
        const formObj = {
          id: formData.id,
          catalogName: formData.businessObject,
          objectHierarchy: formData.objectHierarchy,
          parentCatalogId: formData.parentCatalogId || '0',
          status: formData.status,
          accessPermissions: formData.accessPermissions,
        }
        saveOrUpdateUpdate(formObj).then((res) => {
          if (res.code === 0) {
            emit('submit', formData)
            ElMessage.success(res.message || '提交成功')
          }
        })
        console.log('提交事件')
        return
      }).catch(() => {
        // 用户取消提交
      })
    }
  })

}
// 监听一下drawerVisible，当时false时，处理清空
const getValue = () => {
  // console.log(8888888888888, props.rowData)
  selecteChange(props.rowData.objectHierarchy); //获取当前所属系统、单元下拉数据
  formData.id = props.rowData.id,
  titleText.value = '编辑业务实体'
  formData.businessObject = props.rowData.businessObject
  formData.catalogCode = props.rowData.catalogCode
  formData.objectHierarchy = props.rowData.objectHierarchy
  formData.parentCatalogId = props.rowData.businessObjectType
  formData.status = props.rowData.status.toString()
  formData.accessPermissions = props.rowData.accessPermissions.toString()
}
onMounted(() => {
})
defineExpose({
  getValue
})
</script>

<style scoped lang="postcss">
.drawer-content {
  padding: 20px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-drawer__body .el-form-item {
  flex-direction: row;
}
</style>