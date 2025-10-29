<template>
<!--  模型发布-->
  <div class="model-management  detail-config">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="searchModel.name" placeholder="模型名称：" clearable />
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchModel.version" placeholder="版本：" clearable />
        </el-col>
        <el-col :span="6">
          <el-date-picker
              v-model="searchModel.dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :picker-options="pickerOptions"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchModel.status" placeholder="发布状态" clearable style="width: 100%;">
            <el-option label="全部" value="" />
            <el-option label="审核中" value="审核中" />
            <el-option label="审核通过" value="审核通过" />
            <el-option label="审核未通过" value="审核未通过" />
          </el-select>
        </el-col>
        <el-col :span="2" class="button-group">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="模型名称"  show-overflow-tooltip />
      <el-table-column prop="version" label="版本"  align="center" />
      <el-table-column prop="alias" label="版本别名" align="center" />
      <el-table-column prop="applicant" label="申请人" width="100" align="center" />
      <el-table-column prop="publishTime" label="发布时间" width="180" align="center">
        <template #default="{ row }">
          {{ formatDate(row.publishTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发布状态" width="120" align="center">
        <template #default="{ row }">
            {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" text size="small" @click="handleView(row)">查看</el-button>
          <el-button
              v-if="row.status === '审核中'"
              text
              size="small"
              style="color: #f56c6c;"
              @click="handleRevoke(row)"
          >
            撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <be-pager
        v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize"
        :total="tableConfig.paginationConfig.total"
        :list="tableData"
        :page-sizes="TABLE_LIST_PAGE_RANGE"
        @callback="handlePageChange"
    />
<!--    &lt;!&ndash; 分页 &ndash;&gt;-->
<!--    <div class="pagination-container">-->
<!--      <span class="total">总计 {{ total }}</span>-->
<!--      <el-pagination-->
<!--          background-->
<!--          layout="sizes, prev, pager, next"-->
<!--          :page-size="pageSize"-->
<!--          :current-page="currentPage"-->
<!--          :page-sizes="[10, 20, 50, 100]"-->
<!--          :total="total"-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--      />-->
<!--      <span class="page-jump">-->
<!--        <el-input-number-->
<!--            v-model="jumpPage"-->
<!--            :min="1"-->
<!--            :max="Math.ceil(total / pageSize)"-->
<!--            controls-position="right"-->
<!--            size="small"-->
<!--            @change="handleJump"-->
<!--        />-->
<!--        <span>/ {{ Math.ceil(total / pageSize) }}</span>-->
<!--      </span>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
const pageKey = 'model-release'
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
// 搜索条件
const searchModel = reactive({
  name: '',
  version: '',
  dateRange: [],
  status: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '通用图像分类模型_Xception71',
    version: 'V3版',
    alias: '高级版',
    applicant: '张三',
    publishTime: '2024-01-01 00:00:00',
    status: '审核中'
  },
  {
    id: 2,
    name: '通用图像分类模型_Xception71',
    version: 'V3版',
    alias: '高级版',
    applicant: '张三',
    publishTime: '2024-01-01 00:00:00',
    status: '审核未通过'
  },
  {
    id: 3,
    name: '通用图像分类模型_Xception71',
    version: 'V2版',
    alias: '升级版',
    applicant: '张三',
    publishTime: '2024-01-01 00:00:00',
    status: '审核通过'
  }
])

// 表格加载状态
const loading = ref(false)

// 分页相关
const total = ref(5)
const currentPage = ref(1)
const pageSize = ref(10)
const jumpPage = ref(1)

// 日期选择器配置
const pickerOptions = reactive({
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
})

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const statusMap = {
    '审核中': 'warning',
    '审核通过': 'success',
    '审核未通过': 'danger'
  }
  return statusMap[status] || ''
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString
}

// 查询
const handleSearch = () => {
  loading.value = true
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
    // 实际项目中这里会调用API获取数据
    console.log('搜索条件:', searchModel)
  }, 500)
}

// 重置
const handleReset = () => {
  searchModel.name = ''
  searchModel.version = ''
  searchModel.dateRange = []
  searchModel.status = ''
  currentPage.value = 1
  jumpPage.value = 1
  handleSearch()
}

// 查看详情
const handleView = (row) => {
  console.log('查看模型:', row)
  // 跳转到详情页或打开弹窗
}

// 撤销
const handleRevoke = (row) => {
  ElMessage({
    message: '确认撤销该模型发布？',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    console.log('撤销模型:', row)
    // 调用撤销API
    ElMessage.success('撤销成功')
  }).catch(() => {
    console.log('取消撤销')
  })
}

// 分页相关处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  jumpPage.value = 1
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  jumpPage.value = val
  handleSearch()
}

const handleJump = () => {
  currentPage.value = jumpPage.value
  handleSearch()
}
//     分页
const handlePageChange = () => {
  // getTableList()
}
// 组件挂载时加载数据
onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.detail-config{
  display: block;
}
.model-management {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  align-items: center;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}

.total {
  margin-right: 15px;
  color: #606266;
}

.page-jump {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.page-jump :deep(.el-input-number) {
  width: 80px;
  margin: 0 5px;
}
</style>