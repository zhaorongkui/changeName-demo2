<template>
  <div style="height: 100vh;"
    v-if="['dataset-data-catalog-detail', 'data-classification-detail'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="detail-config" v-if="['data-catalog', 'data-classification'].includes(`${String($route.name)}`)">
    <div class="left-content">
      <div class="content-title">
        <h3>{{ $route.name === 'data-catalog' ? '数据目录' : '数据分类' }}</h3>
        <div class="content-title-extra" v-if="$route.name === 'data-catalog'">
          <el-button :type="switchType === 'business' ? 'primary' : 'text'" @click="handleSwitch('business')" link>
            按目录
          </el-button>
          <el-divider direction="vertical" />
          <el-button :type="switchType === 'topic' ? 'primary' : 'text'" @click="handleSwitch('topic')" link>
            按主题
          </el-button>
        </div>
      </div>
      <div v-if="switchType === 'business'" class="catalog-tree">
        <BusinessTree ref="businessTreeRef" @node-click="handleNodeClick" @getFirst="getFirst" />
      </div>
      <div v-if="switchType === 'topic'" class="catalog-tree">
        <TopicTree ref="TopicTreeRef" @node-click="handleNodeClick" @getFirst="getFirst" />
      </div>
    </div>
    <div class="right-content">
      <div class="content-title">
        <h3>数据列表</h3>
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="$route.name === 'data-catalog' ? formItemList : classificationFormItemList"
          @on-search="handleFilterSearch" @on-reset="handleFilterReset">
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <div class="table-operate">
          <el-button type="primary" @click="showAddDrawer"
            v-if="['data-classification'].includes(`${String($route.name)}`)">
            新增
          </el-button>
        </div>
        <div class="table-operate"></div>
        <!-- 表格数据展示 -->
        <div class="data-table-container" v-loading="isLoading">
          <be-table :is-lock="false" :table-data="tableData"
            :columns="$route.name === 'data-catalog' ? tableColumns : classificationTableColumns" :options="tableConfig"
            @command="onCommand" />
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
      </div>
    </div>
  </div>
  <!-- 新增抽屉组件 -->
  <LogicalDataModelDrawer v-if="drawerVisible" :businessDomainList="businessDomainList" :dataSourceList="dataSourceList"
    :detailObject="detailObject" :itemId='itemId' ref="logicalDataModelDrawerRef" v-model:drawerVisible="drawerVisible"
    @submit="handleAddSubmit" @update:drawerVisible="addDrawerClose" />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus'
import BusinessTree from '../components/BusinessTree.vue'
import TopicTree from '../components/TopicTree.vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { getBusinessDomainList } from '@/api/common.ts'
import LogicalDataModelDrawer from '@/views/backend-management/data-catalog/data-classification/components/LogicalDataModelDrawer.vue'
import { getdataCatalog, getSelector } from '@/api/dataSet.ts'
import { selectAilabLogicalDataModel, deleteDataType, ailabLogicalDataModelDelete, selectBusinessObjectType } from '@/api/backStageManage.ts'
import type { BusinessObjectType } from '@/types/dataSandbox'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
const currentTreeNodeId = ref('')
const pageKey = 'data-catalog'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },

  rowKey: `${pageKey}Id`
})
const { t } = useI18n()
const dataSourceList = ref([])
const detailObject = ref({})
const currentDataCatalog = ref({})
const businessDomainList = ref([])
// ...existing code...
const router = useRouter()
const isLoading = ref(false)
const switchType = ref<'business' | 'topic'>('business')
const handleSwitch = (type: 'business' | 'topic') => {
  switchType.value = type
}

const dataTypeList = ref<any[]>([]) // 数据分类
const dateDimList = ref<any[]>([]) // 频率
const businessTreeRef = ref()
const TopicTreeRef = ref<InstanceType<typeof TopicTree>>()
const currentNode = ref(null)
const searchFormRef = ref<FormInstance>()

const queryData = ref({
  businessObject: '',//业务实体
  businessCategory: '',//所属系统单元
  objectLevel: '',//对象层级
  dataCategory: '',//数据分类
  dataUpdateFrequency: '',//更新频率
  businessScenarios: '',//业务应用场景
  dataModelName: '',//业务应用场景
})
// 查询条件表单项配置
const formItemList = ref([
  {
    type: 'input',
    label: '业务实体',
    paramKey: 'businessObject',
    placeholder: '请输入',
    modelValue: queryData.value.businessObject,
    // selectOptions: topicOptions.value
  },
  {
    type: 'input',
    label: '所属系统/单元',
    paramKey: 'businessCategory',
    placeholder: '请输入',
    modelValue: queryData.value.businessCategory,
    // selectOptions: businessOptions.value
  },
  {
    // type: 'multiselect',
    type: 'select',
    label: '对象层级',
    paramKey: 'objectLevel',
    placeholder: '请选择',
    modelValue: queryData.value.objectLevel,
    selectOptions: []
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataCategory',
    placeholder: '请选择',
    modelValue: queryData.value.dataCategory,
    selectOptions: []
  },
  {
    type: 'select',
    label: '更新频率',
    paramKey: 'dataUpdateFrequency',
    placeholder: '请选择',
    modelValue: queryData.value.dataUpdateFrequency,
    selectOptions: []
  },
  // {
  //   type: 'cascader',
  //   label: '组织维度',
  //   paramKey: 'organization',
  //   placeholder: '请选择组织',
  //   modelValue: queryData.value.organization,
  //   cascaderOptions: organizationOptions.value
  // },
  // {
  //   type: 'dateRange',
  //   multiple: 2,
  //   label: '时间范围',
  //   paramKey: 'timeRange',
  //   modelValue: queryData.value.timeRange,
  //   isSlot: true
  // }
])
const reportTypeOptions = ref([
  {
    value: '水量',
    label: '水量',
  },
  {
    value: '电量',
    label: '电量',
  },
  {
    value: '污泥',
    label: '污泥',
  },
  {
    value: '药剂',
    label: '药剂',
  },
  {
    value: '水质',
    label: '水质',
  },
])
const classificationFormItemList = ref([
  {
    type: 'input',
    label: '业务实体',
    paramKey: 'businessObject',
    placeholder: '请输入',
    modelValue: queryData.value.businessObject,
    // selectOptions: topicOptions.value
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataCategory',
    placeholder: '请选择',
    modelValue: queryData.value.dataCategory,
    selectOptions: []
  },
  {
    type: 'select',
    label: '更新频率',
    paramKey: 'dataUpdateFrequency',
    placeholder: '请选择',
    modelValue: queryData.value.dataUpdateFrequency,
    selectOptions: []
  },
  {
    type: 'select',
    label: '业务应用场景',
    paramKey: 'businessScenarios',
    placeholder: '请选择业务应用场景',
    modelValue: queryData.value.businessScenarios,
    selectOptions: reportTypeOptions.value
  },
  {
    type: 'select',
    label: '逻辑数据模型',
    paramKey: 'dataModelName',
    placeholder: '请选择逻辑数据模型',
    modelValue: queryData.value.dataModelName,
    selectOptions: []
  }
])
const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
  })
  console.log(queryData.value, 'value===')
  getDataPageList(currentTreeNodeId.value)
}
// 重置
const handleFilterReset = () => {
  queryData.value = {
    businessObject: '',//业务实体
    businessCategory: '',//所属系统单元
    objectLevel: '',//对象层级
    dataCategory: '',//数据分类
    dataUpdateFrequency: '',//更新频率
    businessScenarios: '',//业务应用场景
    dataModelName: '',//业务应用场景
  }
  businessTreeRef.value?.clearSelection();
  currentTreeNodeId.value = 1
  getDataPageList(currentTreeNodeId.value)
}
// 获取业务域
const getBusinessDomain = () => {
  getBusinessDomainList('').then((res) => {
    console.log(res);
    if (res.success) {
      businessDomainList.value = res.data
    }
  })
}
// 获取目录树的第一个节点的id
const getFirst = (id: string) => {
  currentTreeNodeId.value = id
  getDataPageList(currentTreeNodeId.value)
}
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      formItemList.value[2].selectOptions = res.data.object_hierarchy.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })

      formItemList.value[3].selectOptions = res.data.data_type.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      classificationFormItemList.value[1].selectOptions = formItemList.value[3].selectOptions;
      dataTypeList.value = classificationFormItemList.value[1].selectOptions// 数据分类
      formItemList.value[4].selectOptions = res.data.date_dim.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      classificationFormItemList.value[2].selectOptions = formItemList.value[4].selectOptions;
      dateDimList.value = formItemList.value[4].selectOptions// 频率

    } else {
      ElMessage.error(res.msg)
    }
  })
}
const tableData = ref<BusinessObjectType[]>([])
// 获取数据目录的列表
const getDataPageList = (id: string | number) => {
  isLoading.value = true
  getdataCatalog({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    directory: switchType.value == 'business' ? id : null,
    topicName: switchType.value == 'topic' ? id : null,
    businessObject: queryData.value.businessObject,
    businessObjectType: queryData.value.businessCategory,
    objectHierarchy: queryData.value.objectLevel,
    dataType: queryData.value.dataCategory,
    dateDim: queryData.value.dataUpdateFrequency,
    businessScenarios: queryData.value.businessScenarios,
    dataModelName: queryData.value.dataModelName,
    type: switchType.value === 'business' ? 1 : 2
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.records
        tableConfig.value.paginationConfig.total = res.data.total
        console.log(tableData.value, 'tableData.value')
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

// 切换分页
const handlePageChange = () => {
  getDataPageList(currentTreeNodeId.value)
}

// 切换树节点
const handleNodeClick = (data: TreeNode) => {
  currentNode.value = data
  currentTreeNodeId.value = switchType.value === 'business' ? data.id : data.name
  console.log(data, 'data====')
  getDataPageList(currentTreeNodeId.value)
}

const tableColumns = computed(() => {
  return [
    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'businessObjectType',
      label: '所属系统/单元',
      align: 'center'
    },
    {
      prop: 'objectHierarchy',
      label: '对象层级',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'dateDim',
      label: '数据更新频率',
      align: 'center'
    },
    {
      prop: 'propertyCount',
      label: '包含指标数',
      align: 'center'
    },
    {
      prop: 'businessScenarios',
      label: '业务应用场景',
      align: 'center'
    },
    {
      type: 'actions',
      label: '操作',
      align: 'center',
      buttons: [
        {
          name: '详情',
          command: 'detail',
          type: 'primary'
        }
      ]
    }
  ]
})
const classificationTableColumns = computed(() => {
  return [
    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'dateDim',
      label: '数据更新频率',
      align: 'center'
    },


    {
      prop: 'propertyCount',
      label: '包含指标数',
      align: 'center'
    },
    {
      prop: 'businessScenarios',
      label: '业务应用场景',
      align: 'center'
    },
    {
      prop: 'versionInfo',
      label: '版本信息',
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      align: 'center',
      format: (row) => {
        return row.status == 1 ? '启用' : '停用'
      }
    },
    {
      prop: 'accessPermissions',
      label: '访问权限',
      align: 'center',
      format: (row) => {
        return row.accessPermissions== 1 ? '公开' : '受限'
      }
    },
    {
      type: 'actions',
      label: '操作',
      align: 'center',
      buttons: [
        {
          name: '编辑',
          command: 'edit',
          type: 'primary'
        },
        {
          name: '详情',
          command: 'detail',
          type: 'primary'
        },
        {
          name: '删除',
          command: 'delet',
          type: 'primary'
        }
      ]
    }
  ]
})
const onCommand = (command, row) => {
  switch (command) {
    case 'detail':
      handleViewDetail(row)
      break
    case 'delet':
      handleViewDetelt(row)
      break
    case 'edit':
      handleViewEdit(row)
      break
  }
}

const checkTagList = computed(() => {
  const tagList = ['基础信息', '数采数据', '填报数据', '工单数据', '计算指标', '基础指标']
  return tagList.map((tag, index) => ({
    tag,
    id: `${index + 1}`
  }))
})

/**
 * 跳转数据分类详情
 * @param row
 */
const handleViewDataTypeDetail = (row: BusinessObjectType) => {
  // 可根据 row.id 或其他参数拼接路由参数
  router.push({
    path: '/backend-management/data-catalog-mg/data-classification/detail',
    query: {
      businessId: row.id,
      // datasetId: row.datasetId ? row.datasetId :'',
      currentDataCatalog: JSON.stringify(row),
    }
  })
}
/**
 * 跳转详情
 * @param row
 */
const handleViewDetail = (row: BusinessObjectType) => {
  // 可根据 row.id 或其他参数拼接路由参数
  router.push({
    path: '/data-sandbox/data-catalog/detail',
    query: {
      businessId: row.id,
      // datasetId: row.datasetId ? row.datasetId :'',
      currentDataCatalog: JSON.stringify(row),
    }
  })
}
const selectBusinessObjectTypeList = ref([])
// 获取业务实体下拉数据
const selectBusinessObject = (name) => {
  selectBusinessObjectType(name).then((res) => {
    console.log(res);
    if (res.success) {
      selectBusinessObjectTypeList.value = res.data.map(item => {
        return { id: item.id, name: item.catalogName }
      })
      // dataSourceList.value = res.data
    }
  })
}
const dataModelIdsList = ref([])
// 获取逻辑数据模型
const getSelectAilabLogicalDataModel = () => {
  selectAilabLogicalDataModel().then((res) => {
    console.log(res);
    if (res.success) {
      classificationFormItemList.value[4].selectOptions = res.data.map(item => {
        return { id: item.id, name: item.entity }
      })
      dataModelIdsList.value = classificationFormItemList.value[4].selectOptions
      // dataSourceList.value = res.data
    }
  })
}
const isShowDetail = ref(false)
const drawerVisible = ref(false)
const handleClose = () => {
  isShowDetail.value = false
}
// 新增抽屉关闭
const addDrawerClose = () => {
  drawerVisible.value = false
}
// 显示新增抽屉
const showAddDrawer = () => {
  itemId.value = ''
  drawerVisible.value = true
}
const handleViewDetelt = (row) => {
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ailabLogicalDataModelDelete(row.id).then(res => {
      if (res.code === 0) {
        ElMessage.success(res.message || '删除成功')
        getDataPageList(currentTreeNodeId.value)
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
    })
    // done()
  }).catch(() => {
    // 用户取消关闭
  })
}
const itemId = ref('');
const logicalDataModelDrawerRef = ref(null)
const handleViewEdit = (row) => {
  showAddDrawer()
  itemId.value = row.id
}
// 提交新增
const handleAddSubmit = () => {
  // 刷新列表
  getDataPageList(currentTreeNodeId.value)
  // 关闭抽屉
  drawerVisible.value = false
  // ElMessage.success('新增成功')
}
onMounted(() => {
  getSelectorData()
  getSelectAilabLogicalDataModel() // 数据模型
  selectBusinessObject('') // 业务实体下拉
})


</script>

<style scoped lang="postcss">
.detail-config {
  .left-content {
    .search-box {
      padding: 12px 0px;
      border-top: 1px solid #e4e7ed;
      background-color: #fff;
    }

    .catalog-tree {
      flex: 1;
      overflow-y: auto;
    }
  }
}

/* 树形组件相关样式 */

/* 查询条件区域样式 */
.search-criteria {
  .form-action {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
