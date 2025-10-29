<template>
  <el-dialog v-model="dialogVisible" title="敏感数据" width="70%"  @close="handleClose" class="test999" destroy-on-close  :close-on-click-modal="false">
    <div class="bg-white p-3 px-7">
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @on-search="handleSearch" @on-reset="handleReset"
          @onClear="handleFilterClear">
        </AdvancedSearch>
      </div>
      <div class="data-table-container" v-loading="isLoading">
        <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
          @selection-change="selectionChange" @select-all="selectAll" :selectable="handleSelectable"/>
      </div>
      <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
        :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange"  />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="save()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, PropType, computed, onMounted, } from 'vue'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
import { businessDomainOptions, businessCategoryOptions } from '../components/mockData'
import { TABLE_LIST_PAGE_RANGE } from "~/utils/constant";
import { useRouter } from "vue-router";
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import { getSelector } from '@/api/dataSet.ts'
import { getDataCatalogueList, addDataCatalogue } from '@/api/backStageManage.ts'
import { getInitialValue } from '~/utils';
/**
 * 分页参数
 */
onMounted(() => {
  getSelectorData();
  getTableList()
})
const formData = ref({
  dataType: '',
  businessObject: '',
  objectHierarchy: '',
  fieldName: '',
})
const formItemList = ref([
  {
    type: 'input',
    label: '业务实体',
    paramKey: 'businessObject',
    placeholder: '请输入',
    modelValue: formData.value.businessObject
  },
  {
    type: 'select',
    label: '对象层级',
    paramKey: 'objectHierarchy',
    placeholder: '请选择',
    modelValue: formData.value.objectHierarchy,
    selectOptions: businessDomainOptions.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataType',
    placeholder: '请选择',
    modelValue: formData.value.dataType,
    selectOptions: businessCategoryOptions.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },

  {
    type: 'input',
    label: '字段名称',
    paramKey: 'fieldName',
    placeholder: '请输入',
    modelValue: formData.value.fieldName
  },

])
const handleSelectable = (row: any, index: number) => {
  // 当 desensitizeFlag 1  存在(不可选)； 0 不存在（可选） 时，
  return row.desensitizeFlag === '0';
};
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      formItemList.value[1].selectOptions = res.data.object_hierarchy.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      formItemList.value[2].selectOptions = res.data.data_type.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      // formItemList.value[3].selectOptions = res.data.date_dim.map((item, index) => {
      //   return {
      //     name: item,
      //     id: item,
      //   }
      // })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 模型接口
const tableData = ref([])
const tableColumns = computed(() => {
  return [
    {
      type: 'selection',
      prop: 'index',
      align: 'center',
      width: 60
    },
    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'objectHierarchy',
      label: '对象层级',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'dataType',
      label: '业务分类',
      align: 'center',
      minWidth: 100
    },

    {
      prop: 'businessObjectType',
      label: '逻辑数据模型',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'dataTag',
      label: '数据标签',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'fieldName',
      label: '字段名称',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'description',
      label: '字段描述',
      align: 'center',
      minWidth: 100
    },

  ]
})
// 定义组件暴露的事件
const emit = defineEmits(['close', 'confirmNext'])

const pageKey = 'version-dialog'
// 给 desensitizeFlag === 1 的行添加特殊类名
const handleRowClassName = (row: any) => {
  return row.desensitizeFlag === '1' ? 'row-desensitized' : '';
};
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
    pageSize: 20
  },
  maxHeight: 300,
  rowKey: `${pageKey}Id`,
  rowClassName: handleRowClassName
  
})

const isLoading = ref(false)
// 获取数据集的列表
const getTableList = (id: string | number) => {
  isLoading.value = true
  getDataCatalogueList({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    businessObject: formData.value.businessObject,
    dataType: formData.value.dataType,
    objectHierarchy: formData.value.objectHierarchy,
    fieldName: formData.value.fieldName
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.body
        tableConfig.value.paginationConfig.total = res.data.total
      }

    })
    .finally(() => {
      isLoading.value = false
    })
}
// 对话框可见状态
const dialogVisible = ref(true)
// 监听弹窗显示状态
watch(
  () => dialogVisible.value,
  (newVal) => {
    console.log(newVal)
    // 当弹窗从关闭变为打开时（newVal为true）
    if (newVal) {
      getSelectorData()
      getTableList()
    } else {
      // 弹窗关闭时的清理操作（可选）
    }
  }
);
const handleFilterClear = (key) => {
  formData.value[key] = getInitialValue(key);
}
const handleClose = () => {
  emit('close')
}
const save = () => {
  addDataCatalogue(checkedData.value).then((res) => {
    const {
      code
    } = res
    if (code === 0) {
      ElMessage.success(res.message || `保存成功`)
      dialogVisible.value = false
      emit('close')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  })
}
const handleReset = (key) => {
  formData.value = {
    dataType: '',
    businessObject: '',
    objectHierarchy: '',
    fieldName: '',
  }
  getTableList()
}
// 查询
const handleSearch = (data) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })
  getTableList()
}
const checkedData = ref([]);
// 分页
const handlePageChange = () => {
  getTableList()
}

// 全选
const selectAll = (data) => {
  console.log(data, 'data===')
  checkedData.value = data
}

// 列表选择
const selectionChange = (data) => {
  console.log(data, 'data===')
  checkedData.value = data
}
</script>
<style scoped lang="postcss">
.table-search {
  width: 100%;
  @apply flex justify-between;

  .table-search-item {
    @apply flex;
  }

}

:deep(.data-table-container .el-table) {
  overflow-y: auto;
}
</style>
<style scoped lang="scss">
/* 适配大部分基于 el-checkbox 的表格复选框 */
/* 1. 找到不可选行的复选框容器 */
.row-desensitized .el-table__cell .el-checkbox {
  /* 复选框整体置灰 */
  color: #c0c4cc;
}

/* 2. 复选框边框置灰 */
.row-desensitized .el-table__cell .el-checkbox__inner {
  border-color: #c0c4cc;
  background-color: #f5f7fa; /* 背景灰 */
  cursor: not-allowed;
}

/* 3. 通过伪元素添加灰色打钩（未选中状态下的视觉效果） */
.row-desensitized .el-table__cell .el-checkbox__inner::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 20%;
  width: 6px;
  height: 12px;
  border: solid #909399; /* 灰色钩子 */
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-50%, -60%);
  visibility: visible; /* 强制显示钩子 */
}
</style>
<style>
.el-popper {
  z-index: 6000 !important;
}
</style>



