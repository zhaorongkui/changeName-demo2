<template>
  <el-drawer :model-value="props.drawerVisible" @update:model-value="" title="I am the title" :with-header="false"
    width="600px" :before-close="handleClose" size="40%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="BaseInfo">
        <div class="drawer-content">
          <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
            <el-form-item label="所属业务实体" required prop="businessObject">
              <el-select v-model="formData.businessObject" filterable placeholder="请选择所属业务实体" style="width: 100%"
                @change="businessObjectChange" :filter-method="handleFilter">
                <!-- businessObject -->
                <el-option v-for="item in filteredBusinessObjectList" :key="item.catalogId" :label="item.catalogName"
                  :value="item.catalogName" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据分类" required prop="dataType">
              <el-select v-model="formData.dataType" placeholder="请选择数据分类" style="width: 100%">
                <el-option v-for="item in dataTypeList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据更新频率" required prop="dateDim">
              <el-select v-model="formData.dateDim" placeholder="请选择数据更新频率" style="width: 100%">
                <el-option v-for="item in dateDimList" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="逻辑数据模型" required prop="dataModelIds">
              <el-select v-model="formData.dataModelIds" multiple placeholder="请选逻辑数据模型" style="width: 100%"
                @change="changeDataMode">
                <!-- businessDomainList -->
                <el-option v-for="item in dataModelIdsList" :key="item.id" :label="item.entity" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务应用场景" required prop="businessScenarios">
              <el-select v-model="formData.businessScenarios" placeholder="请选择业务应用场景" style="width: 100%">
                <el-option v-for="item in dataTagList" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <selectIndicators v-if="dialogVisible" @close="dialogClose" @success="selectIndica" :treeParams="treeParams"
    :targsListChecked="targsList">
  </selectIndicators>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { LogicalDataModel } from '../logicalMockData'
import { saveOrUpdateDataType, selectAilabLogicalDataModel, getSelectBusinessObjectType, selectDetailById, getDataSourceSelect } from '@/api/backStageManage'
import { getSelector } from '@/api/dataSet.ts'
import selectIndicators from './selectIndicators.vue'
interface BusinessDomainItem {
  dictCode: string
  dictName: string
}
const tableConfig = ref({
  settingTable: false,
  tableId: `intable`,
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `id`
})
const props = defineProps<{
  itemId: String,
  drawerVisible: boolean;
  detailObject: {
    businessObject?: string;
    dataType?: string;
    dateDim?: string;
    dataModelIds?: [string];
    businessScenarios?: string;
    versionInfo?: string;
    status?: string;
    accessPermissions?: string;
  }
  businessDomainList: BusinessDomainItem[]
  dataSourceList: any[]
}>()
const tableData = ref([])
const dataTagList = ref([
  {
    label: '水量',
    value: '水量',
  },
  {
    label: '电量',
    value: '电量',
  },
  {
    label: '污泥',
    value: '污泥',
  },
  {
    label: '药剂',
    value: '药剂 ',
  },
  {
    label: '水质',
    value: '水质',
  },
  {
    label: '设备',
    value: '设备',
  },
  {
    label: '设施',
    value: '设施',
  },
  {
    label: '工单',
    value: '工单',
  },
  {
    label: '经营',
    value: '经营',
  },

]) //业务应用场景
const dataModelIdsList = ref([]) //逻辑数据模型
const dateDimList = ref([]) //数据更新频率
const businessObjectList = ref([]) //所属业务实体
const dataTypeList = ref([]) //数据分类
const userName = ref('') // 用户名
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      // formItemList.value[1].selectOptions = res.data.object_hierarchy.map((item, index) => {
      //   return {
      //     name: item,
      //     id: item,
      //   }
      // })
      dataTypeList.value = res.data.data_type.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      dateDimList.value = res.data.date_dim.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 获取所属业务实体下拉数据
const getSelectBusinessObjectTypeFun = () => {
  getSelectBusinessObjectType().then(res => {
    if (res.success) {
      businessObjectList.value = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 过滤关键词
const filterKeyword = ref('');

// 过滤后的列表
const filteredBusinessObjectList = computed(() => {
  if (!filterKeyword.value) {
    return businessObjectList.value;
  }
  // 自定义过滤逻辑：精确匹配或其他规则
  return businessObjectList.value.filter(item =>
    item.catalogName === filterKeyword.value ||  // 精确匹配
    item.catalogName.includes(filterKeyword.value)  // 模糊匹配
    // 可以添加更多条件，如基于catalogId等字段的过滤
  );
});

// 处理过滤
const handleFilter = (keyword) => {
  filterKeyword.value = keyword;
};
// 获取逻辑数据模型
const getselectAilabLogicalDataModel = () => {
  selectAilabLogicalDataModel().then(res => {
    if (res.success) {
      dataModelIdsList.value = res.data
    } else {
      ElMessage.error(res.msg)
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
  getSelectorData()
  getselectAilabLogicalDataModel() // 获取逻辑数据模型
  getSelectBusinessObjectTypeFun()// 获取所属业务实体下拉数据
  getTableSchema() // 获取数据源库
  if (props.itemId) {
    getDetailValue(props.itemId)
  }
})
const treeParams = ref({
  tableSchema: 'sed-tenant-weihai', //库名
  tableNames: [] as string[]
})
const businessObjectChange = (value) => {
  businessObjectList.value.find(item => {
    if (item.catalogName === value) {
      // treeParams.value.tableSchema = item.catalogName
      // console.log(item, 'item===', value);
      formData.value.catalogId = item.id
      formData.value.objectHierarchy = item.objectHierarchy
      formData.value.businessObjectType = item.businessObjectType
    }
  })
}
const changeDataMode = (value) => {
  treeParams.value.tableNames = [];
  // console.log(value, 'value===');
  dataModelIdsList.value.forEach(item => {
    if (value.includes(item.id)) {
      // console.log(item, 'item===');
      treeParams.value.tableNames.push(item.entityCode)
      console.log(treeParams.value, 'treeParams.value===');
    }
  })
}
const tableSchemaList = ref<any[]>([])
const getTableSchema = () => {
  let params = {
    tenant: userName.value
  }
  getDataSourceSelect(params).then(res => {
    if (res.code === 0) {
      tableSchemaList.value = res.data
      treeParams.value.tableSchema = tableSchemaList.value.length > 0 ? tableSchemaList.value[0].dbName : ''
    } else {
      ElMessage.error(res.message)
    }
  })
}

const formRef = ref(null)
const formData = ref({
  catalogId: '',
  businessObjectType: '',
  objectHierarchy: '',
  businessObject: '',
  dataType: '',
  dateDim: '',
  dataModelIds: [],
  businessScenarios: '',
  versionInfo: '',
  status: '',
  accessPermissions: ''
})
const emit = defineEmits<{
  'update:drawerVisible': [value: boolean]
  'submit': []
}>()
const targsList = ref([])
const getDetailValue = (id) => {
  selectDetailById(id).then(res => {
    if (res.success) {
      const detail = res.data
      formData.value.catalogId = detail.catalogId,
        formData.value.businessObjectType = detail.businessObjectType,
        formData.value.objectHierarchy = detail.objectHierarchy,
        formData.value.businessObject = detail.businessObject,
        formData.value.dataType = detail.dataType,
        formData.value.dateDim = detail.dateDim,
        formData.value.dataModelIds = detail.dataModelIds ? detail.dataModelIds.split(',').map(item => Number(item)) : [],
        formData.value.businessScenarios = detail.businessScenarios,
        formData.value.versionInfo = detail.versionInfo,
        formData.value.status = detail.status.toString(),
        formData.value.accessPermissions = detail.accessPermissions.toString()
      tableData.value = detail.list.map(item => {
        return {
          id: item.id || '',
          columnName: item.fieldName,
          columnComment: item.description,
          columnType: item.dataType,
        }
      })
      targsList.value = detail.list.map(item => {
        return {
          id: item.id || '',
          label: item.fieldName,
          item: {
            id: item.id || '',
            columnName: item.fieldName,
            columnComment: item.description,
            columnType: item.dataType,
          }
        }
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 当前tab
const activeName = ref('BaseInfo')
import type { FormRules } from 'element-plus'
const rules = ref<FormRules>({
  businessObject: [{ required: true, message: `请选择实体/表名`, trigger: ['blur', 'change'] }],
  dataType: [{ required: true, message: `请选择数据分类`, trigger: ['blur', 'change'] }],
  dateDim: [{ required: true, message: `请选择数据更新频率`, trigger: ['blur', 'change'] }],
  dataModelIds: [{ required: true, message: `请选逻辑数据模型`, trigger: ['blur', 'change'] }],
  businessScenarios: [{ required: true, message: `请选择业务应用场景`, trigger: ['blur', 'change'] }],
  versionInfo: [{ required: true, message: `请输入版本信息`, trigger: ['blur', 'change'] }],
  status: [{ required: true, message: `请选择状态`, trigger: ['blur', 'change'] }],
  accessPermissions: [{ required: true, message: `请选择访问权限`, trigger: ['blur', 'change'] }],
})
const handleClose = (done: () => void) => {
  emit('update:drawerVisible', false)
  resetForm()
}
// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'columnName',
    label: '字段名称',
    align: 'center'
  },
  {
    prop: 'columnComment',
    label: '字段描述',
    align: 'center'
  },
  {
    prop: 'columnType',
    label: '字段类型',
    align: 'center'
  },
  // {
  //   prop: 'businessDomain',
  //   label: '数据模型',
  //   align: 'center'
  // },
  // {
  //   prop: 'dataSource',
  //   label: '单位',
  //   align: 'center'
  // },
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
const handleViewDetelt = (row, index) => {
  // console.log(row, index, 'row===index')
  tableData.value.splice(tableData.value.indexOf(row), 1)
  targsList.value.splice(index, 1)
  // console.log(tableData.value, 'row===', targsList.value)
}
const dialogVisible = ref(false)
// 详情新增
const addItem = () => {
  // 新增数据
  dialogVisible.value = true;
}
const dialogClose = () => {
  dialogVisible.value = false;
}

//获取选择的指标
const selectIndica = (data) => {
  targsList.value = data
  // console.log(data, 'data===')
  tableData.value = data.map(item => {
    return item.item
  })
  // console.log(tableData.value, 'tableData===99999')
  dialogClose()
}
const resetForm = () => {
  formData.value = {
    catalogId: '',
    businessObjectType: '',
    objectHierarchy: '',
    businessObject: '',
    dataType: '',
    dateDim: '',
    dataModelIds: [],
    businessScenarios: '',
    versionInfo: '',
    status: '',
    accessPermissions: ''
  }
}
const submitForm = async () => {
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessageBox.confirm('确认提交数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formObj = {
          id: props.itemId,
          catalogId: formData.value.catalogId,
          businessObjectType: formData.value.businessObjectType,
          objectHierarchy: formData.value.objectHierarchy,
          businessObject: formData.value.businessObject,
          dataType: formData.value.dataType,
          dateDim: formData.value.dateDim,
          dataModelIds: formData.value.dataModelIds.join(','),
          businessScenarios: formData.value.businessScenarios,
          versionInfo: formData.value.versionInfo,
          status: formData.value.status,
          accessPermissions: formData.value.accessPermissions,
          list: tableData.value.map(item => {
            return {
              fieldName: item.columnName,
              description: item.columnComment,
              dataType: item.columnType,
            }
          })
        }
        // console.log(formObj, 'formObj===')
        saveOrUpdateDataType(formObj).then((res) => {
          if (res.code === 0) {
            emit('submit')
            emit('update:drawerVisible', false)
            resetForm()
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