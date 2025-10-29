<template>
  <div class="content-main" style="height: 100%">

    <div class="content-title-field">
      <h3>变量列表</h3>
    </div>
    <div  class="table-operate">
      <div class="search-form">
        <el-input class="search-input" placeholder="搜索字段名称、字段描述" v-model="searchContent" clearable @clear="handleClear">
          <template #suffix>
            <el-icon class="pointer" @click="handleSearch"><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button  @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="data-table-container">

      <el-table
          :data="tableData"
          class="table-content"
          border
          ref="tableRef"
          v-loading="isLoading"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          row-key="id"
          @selection-change="handleSelectionChange"
          max-height="400"
      >
        <el-table-column
            type="selection"
            width="55"
            align="center"
            reserve-selection
        />

        <el-table-column label="字段名称" min-width="100">
          <template #default="{ row }">
              {{ row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="100" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.description }}
          </template>
        </el-table-column>
        <el-table-column label="业务实体" min-width="100" prop="businessObject">
        </el-table-column>
        <el-table-column label="数据分类" min-width="100" prop="businessDataType">
        </el-table-column>


        <el-table-column label="字段类型" min-width="100">
          <template #default="{ row }">
              {{ row.dataType }}
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="100">
          <template #default="{ row }">
              {{ row.unit }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="inline-block justify-end mt-1"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, watch, PropType, computed, onMounted, nextTick} from 'vue'
import { ElMessage, FormRules, TabPaneName, TabsPaneContext } from 'element-plus'
import {Close, Search} from '@element-plus/icons-vue'
import { getBusinessDetail, getSelectColumnList} from '@/api/dataset.ts'
import { useDatasetStore } from '@/store/modules/datasetStore'
import {useRouter} from "vue-router";
const datasetStore = useDatasetStore()
// be-table字段信息 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'dataset-detail-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const isLoading = ref(false)
const loading = ref(false)
// 定义组件暴露的事件
const emit = defineEmits(['close', 'success','handleSelectField'])
const props = defineProps({
  currentDataTypeRow:{ //数据目录行数据
    default: null
  },
  selectedTableData:{ //父页面传过来的已经选的变量
    default: [],
  },
  delCount:{  //已选择变量是否执行了删除操作
    type: Number,
    default: 0
  }
})
const tableData = ref([])

// 获取字段信息
const getFieldData = ()=> {
  tableData.value =[]
  isLoading.value = true
  getBusinessDetail({
    pageNum:currentPage.value,
    pageSize:pageSize.value,
    keyWord: searchContent.value,
    dataListId: props.currentDataTypeRow ? props.currentDataTypeRow.id :null
  }).then(res => {
    if(res.success){
      tableData.value = res.data.records
      total.value = res.data.total ? res.data.total : 0
      if(props.selectedTableData && props.selectedTableData.length > 0){
        setDefaultSelection()
      }
    }else{
      ElMessage.error(res.message)
    }
  }).finally(() => {
    isLoading.value = false
  })

}
// 字段信息查询
const handleSearch = () => {
  getFieldData()
}
// 分页
const indexMethod = (index) => {
  return (tableConfig.value.paginationConfig.currentPage - 1) * tableConfig.value.paginationConfig.pageSize + index + 1;
};
// 字段信息重置
const handleReset = ()=> {
  searchContent.value = ''
  getFieldData()
}
const searchContent = ref('')
const handleClear = () => {
  searchContent.value = ''
  getFieldData()

}

const selectData = ref([])
const handleSelectionChange = (currentPageSelection: any[]) => {
  console.log('选中行:', currentPageSelection)
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
  emit('handleSelectField',selectData.value)
}
const tableRef = ref(null)
// 默认选中
const setDefaultSelection = () => {
  nextTick(() => {
    if (tableRef.value && props.selectedTableData?.length > 0) {
      // 先清除所有选中
      tableData.value.forEach(row => {
        tableRef.value.toggleRowSelection(row, false);
      });

      // 设置新的选中状态
      tableData.value.forEach(row => {
        const isSelected = props.selectedTableData.some(item => item.id === row.id );
        if (isSelected) {
          tableRef.value.toggleRowSelection(row, true);
        }
      });
      selectData.value = props.selectedTableData;
    }else if(tableRef.value && props.selectedTableData?.length == 0){
      // 先清除所有选中
      tableData.value.forEach(row => {
        tableRef.value.toggleRowSelection(row, false);
      });
    }
  });
};
watch(()=>props.delCount,val =>{
  setDefaultSelection()
},{
  deep: true,
})
const queryData = ref({
  organization: '',
  tags: 1,
  timeRange: [],
  pageSize: 10
})
const handlePageSizeChange = (value: number) => {
  currentPage.value =1
  pageSize.value = value
  getFieldData()
}
const handlePageChange = (value: number) =>{
  currentPage.value = value
  getFieldData()
}
// 数据集广场-数据集切换业务实体
watch(()=>props.currentDataTypeRow,(val)=>{
    getFieldData()
},{
  deep:true
})
onMounted(()=>{


})
const router = useRouter()

</script>

<style lang="scss" scoped>
.table-operate {
  justify-content: space-between;
  .search-form {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    .search-input {
      width: 240px;
      margin-left: 0.5rem;
    }

    .date-range {
      margin-left: 0.5rem;
    }

    :deep(.el-form-item) {
      margin-right: 16px;
      margin-bottom: 16px;

      .el-form-item__label {
        font-weight: normal;
        color: #606266;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    :deep(.el-form-item__content) {
      .el-button + .el-button {
        margin-left: 10px;
      }
    }
  }
}
.detail-footer {
  display: flex;
  justify-content: flex-end;
}
.content-title-field{
  margin-bottom: 10px ;
  font-size: 18px;
  font-weight: bold;
}
</style>
