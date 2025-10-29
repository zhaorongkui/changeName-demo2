<template>
  <div class="model-list-container">
    <!-- 顶部搜索和筛选区域 -->
    <div class="search-filter-container">
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="输入关键词搜索"
          class="input-with-search"
          :prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
      <div class="filter-box">
        <el-select v-model="filterType" placeholder="全部状态" @change="handleFilterChange">
          <el-option label="全部状态" value="" />
          <el-option label="开发中" value="developing" />
          <el-option label="已发布" value="published" />
        </el-select>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="createNewModel">创建模型</el-button>
      </div>
    </div>

    <!-- 标签筛选区域 -->
    <div class="tags-container">
      <div v-if="selectedTags.length > 0" class="selected-tags">
        <el-tag v-for="tag in selectedTags" :key="tag" closable @close="removeTag(tag)">
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 模型列表区域 -->
    <div class="model-cards">
      <el-empty v-if="modelList.length === 0" description="暂无模型" />
      <div v-else class="cards-grid">
        <div v-for="model in modelList" :key="model.id" class="model-card">
          <div class="card-content">
            <div class="content-header">
              <el-tooltip placement="top" :content="model.name">
                <div class="model-title">
                  <span class="model-type">[{{ model.type }}]</span>
                  <span class="model-name">{{ model.name }}</span>
                </div>
              </el-tooltip>
              <div class="model-status">
                <el-tag :type="getStatusType(model.status)" size="small">
                  <span class="status-dot" :class="getStatusDotClass(model.status)"></span>
                  {{ model.statusText }}
                </el-tag>
              </div>
            </div>
            <div class="content-body">
              <div class="model-info">
                <div v-if="model.runningInfo" class="running-info">
                  <div>运行时间: {{ model.runningInfo.time }}</div>
                  <div>{{ model.runningInfo.description }}</div>
                </div>
                <div v-if="model.waitTime" class="wait-time">
                  <div>秒数: {{ model.waitTime.seconds }}</div>
                  <div class="center-info">{{ model.waitTime.centerInfo }}</div>
                </div>
              </div>
              <div class="content-other">
                <div class="tags-area">
                  <template v-if="model.tags && model.tags.length > 0">
                    <el-tag v-for="tag in model.tags" :key="tag" size="small" class="model-tag">{{ tag }}</el-tag>
                  </template>
                  <template v-else>
                    <span class="no-tags">暂无标签</span>
                  </template>
                </div>
                <div class="shared-info" v-if="model.shared">共{{ model.shared }}个</div>
              </div>
            </div>
            <div class="content-footer">
              <div class="create-time">创建: {{ formatDate(model.createTime) }}</div>
              <div class="update-time">修改: {{ formatDate(model.updateTime) }}</div>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" link @click="handleAction(model, 'algorithm')">实时算法编排</el-button>
            <el-button type="primary" link @click="handleAction(model, 'copy')">复制</el-button>
            <el-button type="primary" link @click="handleAction(model, 'export')">导出</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" link>
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleAction(model, 'edit')">编辑</el-dropdown-item>
                  <el-dropdown-item @click="handleAction(model, 'delete')">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="batch-operations">
          <el-button>批量操作</el-button>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/date'

interface ModelItem {
  id: string
  name: string
  type: string
  status: string
  statusText: string
  createTime: string
  updateTime: string
  runningInfo?: {
    time: string
    description: string
  }
  waitTime?: {
    seconds: string
    centerInfo: string
  }
  tags?: string[]
  shared?: number
}

const router = useRouter()
const searchKeyword = ref('')
const filterType = ref('')
const selectedTags = ref<string[]>([])
const modelList = ref<ModelItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// 初始化模拟数据
const initMockData = () => {
  const mockData: ModelItem[] = [
    {
      id: '1',
      name: '预训练模型',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-13 12:24',
      updateTime: '2025-06-13 16:45',
      tags: ['AI', '训练']
    },
    {
      id: '2',
      name: '混凝机二次风速反馈预测',
      type: '正式',
      status: 'published',
      statusText: 'OpenAPI已发布',
      createTime: '2025-06-12 21:09',
      updateTime: '2025-06-13 17:13',
      runningInfo: {
        time: '运行时间: 78分14秒',
        description: '混凝机二次风速反馈预测'
      },
      tags: ['风速', '预测', '混凝'],
      shared: 1
    },
    {
      id: '3',
      name: '模型在线修正',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:27',
      updateTime: '2025-06-12 19:27',
      waitTime: {
        seconds: '300s',
        centerInfo: '[自启资产中心]'
      }
    },
    {
      id: '4',
      name: '时序预测',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:27',
      updateTime: '2025-06-12 19:27',
      waitTime: {
        seconds: '30s',
        centerInfo: '[自启资产中心]'
      }
    },
    {
      id: '5',
      name: '开环室内计算',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:27',
      updateTime: '2025-06-12 19:27',
      waitTime: {
        seconds: '30s',
        centerInfo: '[自启资产中心]'
      }
    },
    {
      id: '6',
      name: '闭环预测',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:27',
      updateTime: '2025-06-12 19:27',
      waitTime: {
        seconds: '20s',
        centerInfo: '[自启资产中心]'
      }
    },
    {
      id: '7',
      name: '优化求解',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:27',
      updateTime: '2025-06-12 19:27',
      waitTime: {
        seconds: '120s',
        centerInfo: '[自启资产中心]'
      }
    },
    {
      id: '8',
      name: '脱硫控制_v2.0',
      type: '正式',
      status: 'running',
      statusText: '开发中',
      createTime: '2025-06-12 19:29',
      updateTime: '2025-06-12 19:29',
      waitTime: {
        seconds: '10s',
        centerInfo: '[自启资产中心]'
      }
    }
  ]

  modelList.value = mockData
  totalItems.value = mockData.length
}

// 获取状态对应的类型
const getStatusType = (status: string) => {
  if (status === 'running') return 'info'
  if (status === 'published') return 'success'
  return 'info'
}

// 获取状态点的样式类
const getStatusDotClass = (status: string) => {
  if (status === 'running') return 'status-running'
  if (status === 'published') return 'status-published'
  return ''
}

// 处理搜索
const handleSearch = () => {
  // 实际开发中这里应该调用API进行搜索
  console.log('搜索关键词:', searchKeyword.value)
  currentPage.value = 1
  // fetchModels();
}

// 处理筛选变化
const handleFilterChange = () => {
  // 实际开发中这里应该调用API进行筛选
  console.log('筛选类型:', filterType.value)
  currentPage.value = 1
  // fetchModels();
}

// 移除标签
const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  // 实际开发中这里应该重新获取数据
  // fetchModels();
}

// 创建新模型
const createNewModel = () => {
  router.push('/model-develop/editor')
}

// 处理操作
const handleAction = (model: ModelItem, action: string) => {
  console.log(`${action} 模型:`, model)

  switch (action) {
    case 'algorithm':
      router.push(`/model-develop/editor?id=${model.id}`)
      break
    case 'edit':
      router.push(`/model-develop/editor?id=${model.id}&mode=edit`)
      break
    case 'delete':
      // 实际开发中应该调用删除API
      // 此处只做模拟
      ElMessageBox.confirm('确定要删除该模型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 实际删除逻辑
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(() => {})
      break
    // 其他操作...
  }
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // fetchModels();
}

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // fetchModels();
}

// 在实际项目中，你应该从API获取模型列表
// const fetchModels = async () => {
//   try {
//     // const { data } = await api.getModelList({
//     //   page: currentPage.value,
//     //   pageSize: pageSize.value,
//     //   keyword: searchKeyword.value,
//     //   status: filterType.value,
//     //   tags: selectedTags.value
//     // });
//     // modelList.value = data.list;
//     // totalItems.value = data.total;
//   } catch (error) {
//     console.error('获取模型列表失败', error);
//   }
// };

// 组件加载时获取数据
onMounted(() => {
  // 初始化模拟数据
  initMockData()
  // fetchModels(); // 实际开发中使用这个
})
</script>

<style scoped>
.model-list-container {
  padding: 20px;
}

.search-filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  width: 300px;
  margin-right: 10px;
}

.filter-box {
  width: 150px;
  margin-right: 10px;
}

.action-buttons {
  margin-left: auto;
}

.tags-container {
  margin-bottom: 20px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.model-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  position: relative;
  background-color: #fff;
  transition: all 0.3s;
}

.model-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.model-type {
  color: #606266;
}

.model-name {
  color: #303133;
}

.model-status {
  display: flex;
  align-items: center;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-running {
  background-color: #409eff;
}

.status-published {
  background-color: #67c23a;
}

.card-content {
  border-bottom: 1px solid #ebeef5;
}

.content-body {
  min-height: 80px;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
}

.model-info {
  color: #606266;
  font-size: 14px;
}

.running-info,
.wait-time {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.center-info {
  color: #909399;
  font-size: 13px;
}

.tags-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  min-height: 32px;
}

.no-tags {
  color: #909399;
  font-size: 13px;
}

/* 移除不需要的 no-progress 类 */

.content-footer {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
  padding: 8px 0;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.batch-operations {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
