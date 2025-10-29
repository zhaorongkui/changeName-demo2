<template>
  <div class="my-application detail-config">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>元数据列表</h3>
      </div>
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" :rowItemMaxNumber="5" @on-search="handleFilterSearch"
                        @on-reset="handleFilterReset" @onClear="handleFilterClear">
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <div class="data-table-container" v-loading="isLoading">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
                     @command="onCommand">
          </be-table>
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
                  v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
                  :list="tableData" :page-sizes="[10, 20, 30, 50]" @callback="handlePageChange" />
      </div>
    </div>
    <detail v-if="isShowDetail" @close="handleClose" :currentMeta="currentMeta"></detail>

  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { DatasetType } from '@/types/dataSandbox'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { arrayToMap, getInitialValue } from "@/utils/index.ts";
import detail from './components/detail.vue'
import {getMetaList,getMetaDataSource,getBusinessList} from "~/api/backStageManage";
const router = useRouter()
const { t } = useI18n()
const isShowDetail = ref(false)
// 表格数据和分页
const tableData = ref<DatasetType[]>([])
const dataSourceOptions = ref([])
const currentModel = ref<DatasetType>()
// be-table columns 配置
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: t('INDEX'),
    align: 'center',
    width: 60
  },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'category', label: '分类', minWidth: 100 },
  {
    prop: 'businessDimension',
    label: '业务维度',
    minWidth: 100,
  },
  { prop: 'dataSource', label: '数据来源', minWidth: 100 },
  { prop: 'timeDimension', label: '时间维度', minWidth: 140 },
  { prop: 'unit', label: '单位', minWidth: 140 },

  {
    type: 'actions',
    label: t('OPERATION'),
    minWidth: 80,
    buttons: [
      {
        name: '查看',
        command: 'detail',
        type: 'primary'
      },
    ]
  }
]

// be-table 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'resource-application-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})


const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //版本管理
      handleDetail(row)
      break

  }
}


/**
 *
 */
const queryData = ref({
  name: '',
  category: '',
  dataSource: '',
  businessDimension:''
})
const handleCheckedNodes = (nodes) => {
  queryData.value.orgId = nodes; // 同步到queryData,临时处理
};
const statusOptions = ref([])
const formItemList = ref([
  {
    type: 'input',
    label: '名称',
    paramKey: 'name',
    placeholder: '请输入名称',
    modelValue: queryData.value.name
  },
  {
    type: 'select',
    label: '分类',
    paramKey: 'category',
    placeholder: '请选择分类',
    modelValue: queryData.value.category,
    selectOptions: [
      {
        label:"基础数据",
        value: "基础数据"
      },
      {
        label:"原始数据",
        value: "原始数据"
      },
    ]
  },
  {
    type: 'select',
    label: '业务维度',
    paramKey: 'businessDimension',
    placeholder: '请选择',
    modelValue: queryData.value.businessDimension,
    // isSlot: true
  },
  {
    type: 'select',
    label: '数据来源',
    paramKey: 'dataSource',
    placeholder: '请选择',
    modelValue: queryData.value.dataSource,
    selectOptions: dataSourceOptions.value
  },
])

const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    if (key !== 'orgId') {
      queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    }
  })
  loadTableData()
}
const handleFilterReset = () => {
  queryData.value = {
    name: '',
    businessDimension: '',
    category: '',
    dataSource: '',
  }
  loadTableData()
}



const handlePageChange = () => {
  loadTableData()
}


const isLoading = ref(false)
// 获取数据集的列表
const loadTableData = (id: string | number) => {
  isLoading.value = true
  getMetaList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    name: queryData.value.name,
    category: queryData.value.category,
    dataSource: queryData.value.dataSource,
    businessDimension: queryData.value.businessDimension
  })
      .then((res) => {
        if (res.success) {
          tableData.value = res.data.records
          tableConfig.value.paginationConfig.total = res.data.total
        }

      })
      .finally(() => {
        isLoading.value = false
      })
}
// 获取数据来源
const getDataSource =  () => {
  getMetaDataSource().then(res => {
    if(res.success) {
      if(res.data.length > 0) {
        formItemList.value[3].selectOptions = res.data.map(item => {
          return {
            label: item,
            value: item,
          }
        })

      }
    }
  })
}
// 获取业务维度
const getBusinessListData =  () => {
  getBusinessList().then(res => {
    if(res.success) {
      if(res.data.length > 0) {
        formItemList.value[2].selectOptions = res.data.map(item => {
          return {
            ...item,
            label: item.dictName,
            value: item.dictName,
          }
        })

      }
    }
  })
}
const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}

const currentMeta = ref({})

const handleDetail = (row: DatasetType) => {
  isShowDetail.value = true
  currentMeta.value = row
}
const handleClose = ()=> {
  isShowDetail.value = false

}




onMounted(() => {
  loadTableData() // 初始加载表格数据
  getDataSource()
  getBusinessListData()
})
</script>

<style lang="postcss">
.my-application {
  @apply flex flex-col h-full;
}

.table-operate {
  display: flex;
  justify-content: start;

}
</style>
