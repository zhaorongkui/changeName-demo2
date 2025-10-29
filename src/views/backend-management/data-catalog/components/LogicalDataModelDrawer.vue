<template>
  <el-drawer :model-value="props.drawerVisible" @update:model-value="handleDrawerUpdate" :title="`${titleText}逻辑数据模型`"
    width="600px" :modal="false" :before-close="handleClose">
    <div class="drawer-content">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
        <el-form-item label="数据源" required prop="tableSchema">
          <el-select v-model="formData.tableSchema" placeholder="请选择数据源" style="width: 100%"
            @change="changeTableSchema">
            <el-option v-for="item in tableSchemaList" :key="item.dbName" :label="item.dbName" :value="item.dbName" />
          </el-select>
        </el-form-item>
        <el-form-item label="实体名称" required prop="entity">
          <el-select filterable v-model="formData.entity" placeholder="请选择实体名称" style="width: 100%"
            @change="changeEntity" :disabled="!formData.tableSchema" :filter-method="handleFilter">
            <!-- <el-option v-for="item in entityList" :key="item.tableComment" :label="item.tableComment" :value="item.tableComment" /> -->
            <el-option v-for="item in filteredEntityList" :key="item.tableComment" :label="item.tableComment"
              :value="item.tableComment" />
          </el-select>
        </el-form-item>
        <el-form-item label="实体编码" required prop="entityCode">
          <el-input v-model="formData.entityCode" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="字段数量" required prop="fieldCount">
          <el-input v-model="formData.fieldCount" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="业务域" required prop="businessDomain">
          <el-select v-model="formData.businessDomain" placeholder="请选择业务域" style="width: 100%">
            <!-- businessDomainList -->
            <el-option v-for="item in businessDomainList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源" required prop="dataSource">
          <el-select v-model="formData.dataSource" placeholder="请选择数据来源" style="width: 100%">
            <el-option v-for="item in dataSourceList" :key="item.dictCode" :label="item.dictName"
              :value="item.dictCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务定义" required prop="businessDefinition">
          <el-input v-model="formData.businessDefinition" type="textarea" :rows="3" placeholder="请输入业务定义" />
        </el-form-item>
        <el-form-item label="业务规则" required prop="businessRules">
          <el-input v-model="formData.businessRules" type="textarea" :rows="3" placeholder="请输入业务规则" />
        </el-form-item>
        <el-form-item label="责任部门" required prop="responsibleDepartment">
          <el-input v-model="formData.responsibleDepartment" placeholder="请输入责任部门" />
        </el-form-item>
        <el-form-item label="版本信息" required prop="versionInfo">
          <el-input v-model="formData.versionInfo" placeholder="请输入版本信息" />
        </el-form-item>
        <el-form-item label="生命周期状态" required prop="lifecycleStatus">
          <el-select v-model="formData.lifecycleStatus" placeholder="请选择生命周期状态" style="width: 100%">
            <el-option label="已上线" value="已上线" />
            <el-option label="测试中" value="测试中" />
            <el-option label="设计" value="设计" />
            <el-option label="归档" value="归档" />
            <el-option label="失效" value="失效" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问权限" required prop="accessPermissions">
          <el-select v-model="formData.accessPermissions" placeholder="请选择访问权限" style="width: 100%">
            <el-option label="受权限控制" value="受权限控制" />
            <el-option label="公开访问" value="公开访问" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="() => handleClose(() => { })">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { LogicalDataModel } from '../logicalMockData'
import { ailabLogicalDataModelDetail, getDataSourceTableSelect, getDataSourceSelect, getDataSourceTableColumnSelect } from '@/api/backStageManage.ts'
import { ailabLogicalSaveOrUpdate } from '@/api/backStageManage'

interface BusinessDomainItem {
  id: string
  name: string
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
  detailObject: DetailObjectType
  businessDomainList: BusinessDomainItem[]
  dataSourceList: any[]
}>()

const emit = defineEmits<{
  'update:drawerVisible': [value: boolean]
  'submit': []
}>()
const titleText = ref('新增')
let userName = ref('')
const getDetailValue = (id) => {
  titleText.value = '编辑'
  getDataSourceSelectFun()
  ailabLogicalDataModelDetail(id).then(res => {
    if (res.code === 0) {
      formData.value.tableSchema = res.data.tableSchema,
        formData.value.entityCode = res.data.entityCode,
        formData.value.entity = res.data.entity,
        formData.value.fieldCount = res.data.fieldCount,
        formData.value.businessDomain = res.data.businessDomain,
        formData.value.dataSource = res.data.dataSource,
        formData.value.businessDefinition = res.data.businessDefinition,
        formData.value.businessRules = res.data.businessRules,
        formData.value.responsibleDepartment = res.data.responsibleDepartment,
        formData.value.versionInfo = res.data.versionInfo,
        formData.value.lifecycleStatus = res.data.lifecycleStatus,
        formData.value.accessPermissions = res.data.accessPermissions
      getDataSourceTableColumnSelectFun()
      if (res.data.entity) {
        changeTableSchema(res.data.dataSource);
      }
    } else {
      ElMessage.error(res.message)
    }
  })

}
const tableSchemaList = ref<any[]>([])
const entityList = ref<any[]>([])
const getDataSourceSelectFun = () => {
  let params = {
    tenant: userName.value
  }
  getDataSourceSelect(params).then(res => {
    if (res.code === 0) {
      tableSchemaList.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}
// 切换获取实体名单列表
const changeTableSchema = (value) => {
  console.log(value, 9999999);
  let params = {
    tableSchema: formData.value.tableSchema
  }
  getDataSourceTableSelect(params).then(res => {
    if (res.code === 0) {
      console.log(77777777, res);
      entityList.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}
// 过滤关键词
const filterKeyword = ref('');

// 过滤后的列表
const filteredEntityList = computed(() => {
  if (!filterKeyword.value) {
    return entityList.value;
  }
  // 自定义过滤逻辑：精确匹配或其他规则
  return entityList.value.filter(item =>
    item.tableComment === filterKeyword.value ||  // 精确匹配
    item.tableComment.includes(filterKeyword.value)  // 模糊匹配
    // 可以添加更多条件，如基于catalogId等字段的过滤
  );
});
// 处理过滤
const handleFilter = (keyword) => {
  filterKeyword.value = keyword;
};
// 切换实体名称获取实体编码和字段数量
const changeEntity = (value) => {
  console.log(value, 666666666);
  let selectedItem = entityList.value.find(item => item.tableComment === value)
  if (selectedItem) {
    formData.value.entityCode = selectedItem.tableName
    getDataSourceTableColumnSelectFun()

  } else {
    formData.value.entityCode = ''
  }
}
const getDataSourceTableColumnSelectFun = () => {
  let params = {
    tableSchema: formData.value.tableSchema,
    tableName: formData.value.entityCode
  }
  getDataSourceTableColumnSelect(params).then(res => {
    if (res.code === 0) {
      console.log(77777777, res);
      // entityList.value = res.data
      formData.value.fieldCount = res.data.length.toString()
    } else {
      ElMessage.error(res.message)
    }
  })
}
onMounted(() => {
  // 获取 localStorage 中的 app 数据
  const appDataStr = localStorage.getItem('app');
  // 初始化 userName 变量
  if (appDataStr) {
    try {
      // 解析 JSON 字符串为对象
      const appData = JSON.parse(appDataStr);
      // 逐级获取 userName，注意判断各层级是否存在，避免报错
      if (appData.userInfo && appData.userInfo.username) {
        userName.value = appData.userInfo.username;
      }
    } catch (error) {
      console.error('解析 localStorage 中的 app 数据失败：', error);
    }
  }
  console.log('逻辑数据模型抽屉', props.itemId);
  getDataSourceSelectFun()
  if (props.itemId) {
    getDetailValue(props.itemId)
  }
})

// watch(() => props.itemId, () => {
//   console.log(props.itemId, 88888888);
//   if (props.itemId) {
//     getDetailValue()
//   }
// }, {
//   immediate: true,
//   deep: true,
// })

const formRef = ref()
const formData = ref({
  tableSchema: '',
  entityCode: '',
  entity: '',
  fieldCount: '',
  businessDomain: '',
  dataSource: '',
  businessDefinition: '',
  businessRules: '',
  responsibleDepartment: '',
  versionInfo: '',
  lifecycleStatus: '',
  accessPermissions: ''
})
import type { FormRules } from 'element-plus'
import { get } from 'http'

const rules = ref<FormRules>({
  tableSchema: [{ required: true, message: `请选择数据源`, trigger: ['blur', 'change'] }],
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
const handleClose = () => {
  emit('update:drawerVisible', false)
  resetForm()
  // ElMessageBox.confirm('确认关闭吗？', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // }).then(() => {
  //   emit('update:drawerVisible', false)
  //   resetForm()
  //   done()
  // }).catch(() => {
  //   // 用户取消关闭
  // })
}

const resetForm = () => {
  formData.value = {
    tableSchema: '',
    entityCode: '',
    entity: '',
    fieldCount: '',
    businessDomain: '',
    dataSource: '',
    businessDefinition: '',
    businessRules: '',
    responsibleDepartment: '',
    versionInfo: '',
    lifecycleStatus: '',
    accessPermissions: ''
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
          tableSchema: formData.value.tableSchema,
          entityCode: formData.value.entityCode,
          entity: formData.value.entity,
          fieldCount: formData.value.fieldCount,
          businessDomain: formData.value.businessDomain,
          dataSource: formData.value.dataSource,
          businessDefinition: formData.value.businessDefinition,
          businessRules: formData.value.businessRules,
          responsibleDepartment: formData.value.responsibleDepartment,
          versionInfo: formData.value.versionInfo,
          lifecycleStatus: formData.value.lifecycleStatus,
          accessPermissions: formData.value.accessPermissions
        }
        ailabLogicalSaveOrUpdate(formObj).then((res) => {
          console.log(556565656, res);
          // const { data: { code } } = res;
          if (res.code === 0) {
            emit('submit')
            emit('update:drawerVisible', false)
            resetForm()
            ElMessage.success(res.message || '提交成功')
            // emit("refreshData");
            // ElMessage.success(`创建${props.title}成功`)
            // handleClose()
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