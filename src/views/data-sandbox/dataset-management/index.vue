<template>
  <div style="height: 100vh;" v-if="$route.name === 'dataset-management-detail'">
    <router-view></router-view>
  </div>
  <div class="detail-config" v-if="$route.name === 'dataset-management'">
    <div class="left-content">
      <div class="content-title">
        <h3>全部数据集</h3>
        <div class="content-title-extra">
          <el-button :type="switchType === 'business' ? 'primary' : 'text'" @click="handleSwitch('business')" link>
            按目录
          </el-button>
          <!-- 分割线 -->
          <el-divider direction="vertical" />

          <el-button :type="switchType === 'topic' ? 'primary' : 'text'" @click="handleSwitch('topic')" link>
            按主题
          </el-button>
          <el-divider direction="vertical" />
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
        <!-- 去掉数据集合广场的 创建和上传操作 -->
        <!-- <div class="title-extra">
          <el-button type="primary" @click="handleAdd">创建数据集</el-button>
          <el-button type="primary" @click="handleUpload">上传数据集</el-button>
        </div> -->
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" maxIt @on-search="handleFilterSearch" @on-reset="handleFilterReset"
          @on-clear="handleClear">
          <template #orgId>
            <el-tree-select
                class="org-tree-select"
                node-key="orgId"
                v-model="queryData.orgId"
                :data="treeData"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :props="propsTree"
                show-checkbox
                placeholder="请选择"
                style="width: 100%"
            />
          </template>
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <!-- 表格数据展示 -->
        <div class="data-table-container">
          <div class="card-wrapper" v-loading="isLoading">

            <CardInfo v-for="(item, index) in dataList" v-if="dataList && dataList.length > 0"
              style="width: calc(33% - 8px)" :data="item" @click="clickItem(item)" />
            <div v-else class="empty-content">
              <el-empty :image-size="150" description="暂无数据" />

            </div>
          </div>
        </div>
        <el-pagination class="inline-block justify-end mt-1" v-model:current-page="currentPage"
          v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next"
          :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
  <!-- ...existing code... -->
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { cardProps, type FormInstance } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import BusinessTree from '../components/BusinessTree.vue'
import TopicTree from '../components/TopicTree.vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import OrgSelect from '@/components/OrgSelect/index.vue'
import CardInfo from './components/CardInfo.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { initTreeData } from '@/utils/dataSandbox'
// 数据集接口
import { getDatasetList } from '@/api/dataSet.ts'
const { t } = useI18n()
const router = useRouter()
const currentTreeNodeId = ref('')
const treeData = ref([])
const propsTree = ref( {
  label: 'name',
  children: 'children',
  value: 'orgId',
})
const switchType = ref<'business' | 'topic'>('business')
const handleSwitch = (type: 'business' | 'topic') => {
  switchType.value = type
}

const businessTreeRef = ref<InstanceType<typeof BusinessTree>>()
const TopicTreeRef = ref<InstanceType<typeof TopicTree>>()
const handleNodeClick = (node) => {
  currentTreeNodeId.value = switchType.value === 'business'? node.id : node.name
  getDataPageList(currentTreeNodeId.value)
}

const queryData = ref({
  keyWord: '',
  orgId: [],
  status: null
})
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'keyWord',
    placeholder: '请输入名称、数据集ID',
    modelValue: queryData.value.keyWord,
  },
  {
    type: 'custom',
    label: '组织名称',
    paramKey: 'orgId',
    placeholder: '请选组织名称',
    modelValue: queryData.value.orgId,
    isSlot: true
  },
  {
    type: 'select',
    label: '公开状态',
    paramKey: 'status',
    placeholder: '请选择数据集类型',
    modelValue: queryData.value.status,
    selectOptions: [
      { name: '全部', id: 'null' },
      { name: '组织内部数据集', id: '0'},
      { name: '公开数据集', id: '1' }
    ]
  }
])
const OrgSelectRef = ref(null);
const handleCheckedNodes = (nodes) => {
  queryData.value.orgId = nodes; // 同步到queryData,临时处理
};
const handleFilterSearch = (data: any) => {
  console.log(data);
  Object.keys(queryData.value).forEach((key) => {
    if (key !== 'orgId') {
      queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    }
  })
  getDataPageList(currentTreeNodeId.value)
}

/**
 * 重置
 */
const handleFilterReset = () => {
  queryData.value = {
    keyWord: '',
    status: '',
    orgId: []
  }
  // OrgSelectRef.value.clearselectedData();
  currentPage.value = 1
  pageSize.value = 20
  getDataPageList(currentTreeNodeId.value)
}
// 清空某个搜索项
const handleClear = (parimaryKey: string) => {
  queryData.value[parimaryKey] = ''
}
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dataList = ref([])

// 获取数据集的列表
const getDataPageList = (id: string | number) => {
  isLoading.value = true
  getDatasetList({
    dataType: '', // 填写合适的默认值或变量
    ldmName: '',  // 填写合适的默认值或变量
    datasetName: '', // 填写合适的默认值或变量
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    directory: switchType.value == 'business' ? id : null,
    topicName: switchType.value == 'topic' ? id : null,
    keyWord: queryData.value.keyWord,
    orgId: queryData.value.orgId,
    applicationStatus: 2,
    status: queryData.value.status,
    type: switchType.value === 'business'? 1 : 2
  })
    .then((res) => {
      if (res.success) {
        dataList.value = res.data.records
        total.value = res.data.total
        console.log(dataList.value, 'value====')
      }

    })
    .finally(() => {
      isLoading.value = false
    })
}

// 获取目录树的第一个节点的id
const getFirst = (id: string) => {
  currentTreeNodeId.value = id
  getDataPageList(currentTreeNodeId.value)
}
// 分页
const handlePageChange = (val: number) => {
  currentPage.value = val
  getDataPageList(currentTreeNodeId.value)
}
// 切换每页条数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getDataPageList(currentTreeNodeId.value)
}
const clickItem = (row) => {
  router.push({
    path: '/data-sandbox/dataset-management/detail',
    query: {
      datasetId: row.id
      // datasetId: row.datasetId
    }
  })
}
// 由于登录后请求组织树接口较慢
const checkData = () => {
  const rawData = localStorage.getItem('selectListFactory');
  if (rawData) {
    return true;
  }
  return false;
};
onMounted(() => {
  if (!checkData()) {
    // 数据未就绪，轮询检查（每 500ms 一次）
    const timer = setInterval(() => {
      if (checkData()) {
        treeData.value = JSON.parse(localStorage.getItem('selectListFactory') as string)
        clearInterval(timer);
      }
    }, 500);
  }else{
    treeData.value = JSON.parse(localStorage.getItem('selectListFactory') as string)
  }
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
</style>
<style lang="scss" scoped>
.table-operate {
  justify-content: flex-end;

  .table-operate-form-inline {
    display: flex;
    align-items: center;

    .el-form-item {
      margin-bottom: 0px;
    }
  }

  // .search-input {
  //   width: 240px;
  //   margin-right: 10px;
  // }
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .empty-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.search-criteria{

}
.org-tree-select {
  // width: 100%;
  :deep(.el-select__tags-text) {
    display: inline-block; /* 或 block，根据布局需要 */
    max-width: 90px;
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 隐藏超出部分 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
  }
}
</style>
