<template>

  <el-dialog title="关联数据集" v-model="dialogVisible" width="80%" custom-class="limited-dialog" @close="handleClose" :close-on-click-modal="false">
    <div class=" detail-config " style="width: 100%; display: flex; flex-direction: column;">
      <div class="content-main">
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset" @on-clear="handleClear" />
      </div>

      <div class="data-table-container" v-loading="isLoading">
<!--      <be-table-->
<!--          ref="tableRef"-->
<!--            :is-lock="false"-->
<!--            :table-data="tableData"-->
<!--            :columns="tableColumns"-->
<!--            :options="tableConfig"-->
<!--            @selection-change="selectionChange"-->
<!--            @select-all="selectAll"-->
<!--        />-->
        <el-table
            ref="tableRef"
            :data="tableData"
            style="width: 100%"
            @selection-change="selectionChange"
            max-height="350"
            row-key="id"
        >
          <!-- 复选框列 -->
          <el-table-column
              type="selection"
              width="55"
              align="center"
              reserve-selection
          />

          <!-- 序号列，根据当前页码计算序号 -->
          <el-table-column
              type="index"
              :index="indexMethod"
              label="序号"
              width="80"
              align="center"
          />

          <!-- 动态列 -->
          <el-table-column
              v-for="column in tableColumns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              show-overflow-tooltip
          />
        </el-table>
      </div>

      <!-- 分页组件 -->
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
import {computed, nextTick, onMounted, ref} from 'vue';
import AdvancedSearch from "@/components/AdvancedSearch/index.vue";
import type {FormDataSet,TableConfig,DataTableItem} from '@/types/modelManagement'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import { getDatasetList,getSelector } from '@/api/dataSet.ts'
import { getNamesStringByOrgIdsOptimized } from '@/utils/dataSandbox'
const { t } = useI18n()
const emits = defineEmits(['close','submit'])
const isLoading = ref(false)
const dialogVisible = ref(true);
const props = defineProps({
  selectedTableData:{
    type: Array,
    default: []
  }
})
const formData = ref<FormDataSet>({
  name: '',
  dataType: '',
  ldmName: ''
});
const pageKey = 'link-dataset'
/**
 * 分页参数
 */
const tableConfig = ref<TableConfig>({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height:'350px',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  maxHeight:'350px',
  rowKey: `${pageKey}Id`
})
const tableColumns = computed(() => {
  return [

    {
      prop: 'datasetsId',
      label: '数据集ID',
      align: 'center'
    },
    {
      prop: 'name',
      label: '数据集名称',
      align: 'center'
    },
    {
      prop: 'dataVolume',
      label: '数据规模',
      align: 'center'
    },
    {
      prop: 'ldmName',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'orgDimension',
      label: '组织维度',
      align: 'center'
    },
    {
      prop: 'timeRange',
      label: '时间范围',
      align: 'center'
    },
  ]
})
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'name',
    placeholder:'请输入',
    modelValue: formData.value.name,
  },

  {
    type: 'input',
    label: '业务实体',
    paramKey: 'ldmName',
    placeholder: '请输入',
    modelValue: formData.value.ldmName,
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataType',
    placeholder: '请选择',
    modelValue: formData.value.dataType,
    selectOptions:[]
  },
])
const tableData = ref([]);
const tableRef = ref(null)
const selectData = ref([])
/**
 * 关闭弹窗
 */
const handleClose = ()=> {
  emits('close')
}
/**
 * 确定
 */
const handleSubmit = ()=>{
  console.log(selectData.value,'select====')
  emits('submit',selectData.value)
}

/**
 * 搜索
 * @param data
 */
const handleFilterSearch = (data: any) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })

  console.log(formData.value,'value')
  getDataPageList()
}
// 重置
const handleFilterReset = () => {
  formData.value = {
    name: '',
    dataType: '',
    ldmName: ''
  };
  getDataPageList()
}
// 清空某个搜索项
const handleClear = (parimaryKey: string)=> {
  formData.value[parimaryKey] = ''
}
/**
 * 全选
 * @param data
 */
const selectAll = (data)=> {
  selectData.value = data
}
/**
 * 单挑选择
 * @param currentPageSelection
 */
const selectionChange = (currentPageSelection)=>{
  // 获取当前页的所有行 ID
  const currentPageIds = tableData.value.map(item => item.id);

  // 从全局选中数据中移除当前页的数据（因为我们要用当前页的新选中状态替换）
  selectData.value = selectData.value.filter(
      item => !currentPageIds.includes(item.id)
  );

  // 将当前页新选中的数据加入全局选中数据，并进行去重
  selectData.value = [...selectData.value, ...currentPageSelection].reduce((unique, item) => {
    if (!unique.some(entry => entry.id === item.id)) {
      unique.push(item);
    }
    return unique;
  }, []);
}
// 获取数据集的列表
const getDataPageList = () => {
  isLoading.value = true
  getDatasetList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize:tableConfig.value.paginationConfig.pageSize,
    ldmName: formData.value.ldmName,
    dataType: formData.value.dataType,
    datasetName: formData.value.name,
    directory:1,
    applicationStatus:2
  })
      .then((res) => {
        if(res.success){
          tableData.value = res.data.records
          tableConfig.value.paginationConfig.total= res.data.total
          if(tableData.value.length > 0){
            tableData.value.forEach(item=>{
              item.orgDimension = getNamesStringByOrgIdsOptimized(item.orgDimension)
            })
          }
          if(props.selectedTableData && props.selectedTableData.length > 0){
            setDefaultSelection()
          }

        }
      })
      .finally(() => {
        isLoading.value = false
      })
}

// 获取数据分类下拉框的枚举值
const getSelectorData = () => {
  getSelector({field:["object_hierarchy",
      "data_type",
      "date_dim"]}).then(res=>{
    if(res.success){
      formItemList.value[2].selectOptions = res.data.data_type.map((item,index)=>{
        return {
          name: item,
          id: item,
        }
      })
    }
  })
}
getSelectorData()
/**
 * 分页
 */
const handlePageChange = ()=> {
  getDataPageList()
}
const setDefaultSelection = () => {
  nextTick(() => {
    if (tableRef.value && props.selectedTableData?.length > 0) {
      // 先清除所有选中
      tableData.value.forEach(row => {
        tableRef.value.toggleRowSelection(row, false);
      });

      // 设置新的选中状态
      tableData.value.forEach(row => {
        const isSelected = props.selectedTableData.some(item => item.id === row.id);
        if (isSelected) {
          tableRef.value.toggleRowSelection(row, true);
        }
      });
      selectData.value = props.selectedTableData;
    }
  });
};

onMounted(()=>{
    getDataPageList()
})
const indexMethod = (index) => {
  return (tableConfig.value.paginationConfig.currentPage - 1) * tableConfig.value.paginationConfig.pageSize + index + 1
}
</script>
<style scoped lang="scss">
:deep(.searchView-content .el-form .el-form-item){
  flex-direction: row !important;
}
.form-item{
  flex-direction: row !important;
}
:deep(.el-popper) {
  z-index: 4000 !important;
}
</style>






