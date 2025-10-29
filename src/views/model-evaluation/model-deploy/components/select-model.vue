<template>
  <el-dialog title="模型部署" v-model="dialogVisible" width="60%" @close="handleClose" :close-on-click-modal="false">
    <div class="bg-white p-3 px-7" style="width: 100%">
      <el-form
          ref="formRef"
          :model="formInfo"
          :rules="formRules"

      >
        <!-- 其它表单项 -->

        <!-- “部署范围” 表单项 -->
        <el-form-item label="部署范围" prop="deploymentScope" >
          <el-tree-select
              node-key="orgId"
              v-model="formInfo.deploymentScope"
              :data="treeData"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :props="propsTree"
              show-checkbox
              placeholder="请选择部门"
              style="width: 100%"
          />

        </el-form-item>
      </el-form>
      <div class="content-main">

      <div class="select-title">选择部署模型</div>
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset">

          </AdvancedSearch>
        </div>
        <div v-loading="loading">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        highlight-current-row
        max-height="400"
        height="400"
      >
        <el-table-column prop="name" label="模型名称" show-overflow-tooltip width="250">
          <template #default="{ row }">
            <el-radio
              v-model="selectedResourceName"
              :label="row.modelName"
              @change="handleResourceChange(row)"
              class="resource-radio"
            />
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="aliasName" label="版本别名"></el-table-column>
        <el-table-column prop="modelType" label="模型类型"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      </div>
      <be-pager
        v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize"
        :total="tableConfig.paginationConfig.total"
        :list="tableData"
        :page-sizes="TABLE_LIST_PAGE_RANGE"
        @callback="handlePageChange"
      />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref,watch} from 'vue'
import { TABLE_LIST_PAGE_RANGE } from '~/utils/constant'
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import {
  modelTypeOptions as mockModelTypeOptions,
} from '@/views/model-management/model-plaza/mockData'
import {ElMessage} from "element-plus";
import { getSaveApply,getModelList } from '@/api/modelManage'
const emits = defineEmits(['close'])
const propsTree = ref( {
  label: 'name',
  children: 'children',
  value: 'orgId',
})


const pageKey = 'select-model'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: `${pageKey}Id`
})
const dialogVisible = ref(true)
const value = ref<string[]>([])
const formInfo = ref({
  deploymentScope: []
})

// 表单校验规则
const formRules = {
  deploymentScope: [
    {
      required: true,
      message: '请选择部署范围',
      trigger: 'change' // cascader 通常在选项改变时触发校验
    }
  ]
}
const formData = ref({
  name: '',
  modelType: '',
})
const modelTypeOptions = ref(mockModelTypeOptions)
const formItemList = ref([
  {
    type: 'input',
    label: '模型名称',
    paramKey: 'name',
    placeholder:'请输入',
    modelValue: formData.value.name,
  },
  {
    type: 'select',
    label: '模型类型',
    paramKey: 'modelType',
    placeholder: '请选择',
    modelValue: formData.value.modelType,
    selectOptions: modelTypeOptions.value.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },

])
const tableData = ref([])
const treeData = ref([])
const orgId = ref(null)
const loading = ref(false)
/**
 * 获取可选择模型的列表
 */
const getModelPageList = (id?: string | number) => {
  loading.value = true
  getModelList({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
        name: formData.value.name,
        modelType: formData.value.modelType,
        sort:0,
    releaseStatus: 2,
    deployStatus: 0
      }
  ).then((res) => {
    tableData.value = res.data?.body || []
    tableConfig.value.paginationConfig.total = res.data?.total || 0
  })
      .finally(() => {
        loading.value = false
      })
}
// 获取部署范围
const initTreeData = async () => {
  treeData.value = [];
  const newTreeData = localStorage.getItem('selectListFactory')
      ? JSON.parse(localStorage.getItem('selectListFactory') as string)
      : [];
  recursionTree(newTreeData, treeData.value);
  console.log(treeData.value,'value====')

};
const recursionTree = (oldArr, newArr) => {
  oldArr.forEach((item) => {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.children = [];
    if (item.children && item.children.length === 1 && !item.children[0].name) {
      item.children = [];
    }
    if (item.children && Array.isArray(item.children)) {
      recursionTree(item.children, newItem.children);
    }
    newArr.push(newItem);
  });
};

// 选中的资源名称
const selectedResourceName = ref('')

const currentSelect = ref({})
// 处理资源选择变化
const handleResourceChange = (row) => {
  console.log('选中资源:', row)
  currentSelect.value = row
}

// 处理表格选择变化（备用方案）
const handleSelectionChange = (selection) => {}
const handleClose = () => {
  emits('close')
}
const formRef = ref()

// 确定
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('表单校验通过，提交的数据是：', formData)
      if(Object.keys(currentSelect.value).length == 0){
        ElMessage.warning('请选择要部署的模型')
        return
      }
      getSaveApply({
        modelKey:currentSelect.value.id,
        modelId: currentSelect.value.modelId,
        orgIds: formInfo.value.deploymentScope.join(',')
      }).then(res => {
        if(res.success){
          ElMessage.success(res.message)
          emits('close')

        }else{
          ElMessage.error(res.message)
        }
      })
    } else {
      console.log('表单校验失败，请检查必填项')
    }
  })
}
//     分页
const handlePageChange = () => {
  getModelPageList()
}
// 搜索
const handleFilterSearch = (data: any) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })

  getModelPageList()
}
// 重置
const handleFilterReset = () => {
  formData.value = {
    name: '',
    modelType: '',
  }
  getModelPageList()
}

onMounted(()=>{
  initTreeData()
  getModelPageList()
})
</script>
<style scoped>
:deep(.el-drawer__body .el-form-item) {
  flex-direction: row !important;
}
.form-item {
  flex-direction: row !important;
}
/* 自定义单选按钮样式 */
.resource-radio {
  margin: 0 auto;
}

.resource-radio :deep(.el-radio__inner) {
  width: 16px;
  height: 16px;
}

.resource-radio :deep(.el-radio__inner::after) {
  width: 6px;
  height: 6px;
}
.select-title{
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
