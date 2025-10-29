<template>
  <div style="height: 100vh;" v-if="['business-entity-mg-detail'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="detail-config" v-else>
    <div class="left-content">
      <div class="content-title">
        <h3>数据目录</h3>
      </div>
      <!-- 新增业务实体抽屉 -->
      <BusinessEntityDrawer v-if="drawerVisible" :drawerVisible="drawerVisible"
        :objectHierarchyList="objectHierarchyList" @update:drawerVisible="drawerVisible = $event"
        @submit="handleAddSubmit" :rowData="rowData" ref="drawerRef" />
      <div class="catalog-tree">
        <BusinessTree ref="businessTreeRef" @node-click="handleNodeClick" @getFirst="getFirst" />
      </div>
    </div>
    <div class="right-content">
      <div class="content-title">
        <h3>数据列表</h3>
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @onClear="handleFilterClear" @on-search="handleFilterSearch"
          @on-reset="handleFilterReset">
          <template #objectHierarchy>
            <el-select class="search-select" v-model="queryData.objectHierarchy" placeholder="请选择" filterable clearable
              @change="selecteChange">
              <el-option v-for="option in objectHierarchyList" :key="option.id" :label="option.name"
                :value="option.id"></el-option>
            </el-select>
          </template>
          <template #businessObjectType>
            <el-select class="search-select" :disabled="!queryData.objectHierarchy" v-model="queryData.businessObjectType" placeholder="请先选择对象层级" filterable
              clearable>
              <el-option v-for="option in businessObjectTypeList" :key="option.id" :label="option.catalogName"
                :value="option.id"></el-option>
            </el-select>
          </template>
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <div class="table-operate">
          <el-button type="primary" @click="showAddDrawer">新增</el-button>
        </div>
        <!-- 表格数据展示 -->
        <div class="data-table-container" v-loading="isLoading">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
            @command="onCommand" />
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
      </div>
    </div>
  </div>
  <detail v-if="isShowDetail" @close="handleClose" :currentData="currentData"></detail>
  <!-- ...existing code... -->
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus'
import BusinessTree from '../../../data-sandbox/components/BusinessTree.vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import BusinessEntityDrawer from './components/BusinessEntityDrawer.vue'
import { getdataCatalog, getSelector } from '@/api/dataset.ts'
import { selectBusinessObjectType, dataDirectoryDelete, getDataDirectoryList } from '@/api/backStageManage.ts'
import type { BusinessObjectType } from '@/types/dataSandbox'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import detail from './components/detail.vue'
import {  getInitialValue } from '@/utils/index'
const drawerVisible = ref(false)

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
const objectHierarchyList = ref([])

const router = useRouter()
const isLoading = ref(false)


const businessTreeRef = ref()

const currentNode = ref(null)
const queryData = ref({
  businessObject: '',//业务实体
  businessObjectType: '',//所属系统单元
  objectHierarchy: '',//对象层级
  status: '',//状态
})
const businessObjectTypeList = ref([]);
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
    type: 'custom',
    label: '对象层级',
    paramKey: 'objectHierarchy',
    placeholder: '请选择',
    modelValue: queryData.value.objectHierarchy,
    selectOptions: [],
    isSlot: true
  },
  {
    type: 'custom',
    label: '所属系统/单元',
    paramKey: 'businessObjectType',
    placeholder: '请选择',
    modelValue: queryData.value.businessObjectType,
    selectOptions: businessObjectTypeList.value,
    isSlot: true
  },
  {
    type: 'select',
    label: '状态',
    paramKey: 'status',
    placeholder: '请选择状态',
    modelValue: queryData.value.status,
    selectOptions: [
      { name: '全部', id: 'null' },
      { name: '启用', id: '1' },
      { name: '停用', id: '0' }
    ]
  },
])
const selecteChange = (e) => {
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
const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    if (!['objectHierarchy', 'businessObjectType'].includes(key)) {
      queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    }
  })
  console.log(queryData.value, 'value===')
  getDataPageList(currentTreeNodeId.value)
}
// 重置
const handleFilterReset = () => {
  queryData.value = {
    businessObject: '',
    businessObjectType: '',
    objectHierarchy: '',
    status: ''
  }
  getDataPageList(currentTreeNodeId.value)
}
const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}
// 获取目录树的第一个节点的id
const getFirst = (id: string) => {
  currentTreeNodeId.value = id
  getDataPageList(id)
}
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      objectHierarchyList.value = res.data.object_hierarchy.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      // formItemList.value[3].selectOptions = res.data.data_type.map((item, index) => {
      //   return {
      //     name: item,
      //     id: item,
      //   }
      // })
      // formItemList.value[4].selectOptions = res.data.date_dim.map((item, index) => {
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
const tableData = ref<BusinessObjectType[]>([])

// 获取数据目录的列表
const getDataPageList = (id: string | number) => {
  isLoading.value = true
  getDataDirectoryList({
    leftId: id,
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    businessObject: queryData.value.businessObject,
    objectHierarchy: queryData.value.objectHierarchy, // 对象层级
    businessObjectType: queryData.value.businessObjectType, // 所属系统单元
    status: queryData.value.status, // 所属系统单元
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

// 切换分页
const handlePageChange = () => {
  getDataPageList(currentTreeNodeId.value)
}

// 切换树节点
const handleNodeClick = (data) => {
  currentNode.value = data
  currentTreeNodeId.value = data.id
  console.log(data, 'data====')
  getDataPageList(data.id)
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
      prop: 'status',
      label: '状态',
      align: 'center',
      format: (row) => {
        return row.status.toString() === '1' ? '启用' : '停用'
      }
    },
    {
      prop: 'accessPermissions',
      label: '访问权限',
      align: 'center',
      format: (row) => {
        return row.accessPermissions.toString() === '1' ? '公开' : '受限'
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
          command: 'detele',
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
    case 'edit':
      handleViewEdit(row)
      break
    case 'detele':
      handleViewDetelt(row)
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
// 删除
const handleViewDetelt = (row) => {
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    dataDirectoryDelete(row.id).then(res => {
      if (res.code === 0) {
        ElMessage.success(res.message || '删除成功')
        getDataPageList(currentTreeNodeId.value)
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
    })
    done()
  }).catch(() => {
    // 用户取消关闭
  })
}

const rowData = ref({})
// 编辑操作
const drawerRef = ref(null)
const handleViewEdit = (row) => {
  rowData.value = { ...row };

  drawerVisible.value = true

  setTimeout(() => {
    // console.log(777777, rowData.value)
    drawerRef.value.getValue()
  }, 1000)
}

/**
 * 跳转详情
 * @param row
 */
const isShowDetail = ref(false)
const currentData = ref({})
const handleViewDetail = (row: BusinessObjectType) => {
  isShowDetail.value = true
  currentData.value = row
}
const handleClose = () => {
  isShowDetail.value = false


}
onMounted(() => {
  getSelectorData()
})

// 显示新增业务实体抽屉
const showAddDrawer = () => {
  drawerVisible.value = true
}

// 处理新增业务实体提交
const handleAddSubmit = (formData: any) => {
  // 这里添加业务实体提交逻辑
  console.log('提交新增业务实体', formData)
  drawerVisible.value = false
  getDataPageList(currentTreeNodeId.value)
  businessTreeRef.value.initTreeData()
  // TODO: 调用API保存业务实体数据
}


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

/* 标题区域样式 */
.content-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
