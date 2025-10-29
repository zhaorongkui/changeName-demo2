<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 14:11:12
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-12 13:33:18
 * @FilePath: \model-sandbox-frontend\src\views\model-management\base-models\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="run-analysis detail-config">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>运行分析</h3>
      </div>
      <div class="content-main">
        <div class="table-operate">
          <div class="table-search">
            <el-form :inline="true" :model="formData" class="demo-form-inline">
              <el-form-item>
                <el-input
                  v-model="formData.name"
                  style="width: 240px"
                  placeholder="请输入搜索内容"
                  clearable
                  :prefix-icon="Search"
                  @change="onSearch"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="data-table-container">
          <el-table
            :data="tableData"
            class="table-content"
            border
            :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          >
            <el-table-column prop="modelId" label="模型ID" width="100" />
            <el-table-column prop="modelName" label="模型名称" min-width="100" />
            <el-table-column prop="runTime" label="运行时间" min-width="100" />
            <el-table-column prop="runCount" label="运行次数" min-width="100" />
            <el-table-column prop="inferenceLatency" label="推理延迟(ms)" min-width="100" />
            <el-table-column prop="memoryUsage" label="内存使用(MB)" min-width="100" />
            <el-table-column prop="bestAccuracy" label="准确率（最好）" min-width="100">
              <template #default="scope">
                {{ scope.row.bestAccuracy.toFixed(3) }}
              </template>
            </el-table-column>
            <el-table-column prop="avgAccuracy" label="准确率（平均）" min-width="100">
              <template #default="scope">
                {{ scope.row.avgAccuracy.toFixed(3) }}
              </template>
            </el-table-column>
            <el-table-column prop="squaredError" label="均方误差（MSE/RMSE）" min-width="100">
              <template #default="scope">
                {{ scope.row.squaredError }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="inline-block justify-end mt-1"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { mockTableData, type TableDataItem } from './tableData'
import { Search } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'RunAnalysis',
  components: {},
  setup() {
    const formData = ref({
      name: ''
    })
    const onSearch = () => {
      // 处理搜索逻辑
      console.log('搜索内容:', formData.value.name)
      loadTableData() // 重新加载表格数据
    }
    // 表格数据和分页
    const tableData = ref<TableDataItem[]>([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    // 加载表格数据
    const loadTableData = () => {
      // 这里模拟后端分页，实际项目中应该调用API
      // 根据当前选中的节点和搜索条件过滤数据
      const filteredData = mockTableData.filter((item) => {
        return true
      })

      total.value = filteredData.length

      // 计算分页数据
      const startIndex = (currentPage.value - 1) * pageSize.value
      const endIndex = startIndex + pageSize.value
      tableData.value = filteredData.slice(startIndex, endIndex)
    }

    // 分页事件处理
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      loadTableData()
    }

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      loadTableData()
    }

    onMounted(() => {
      loadTableData() // 初始加载表格数据
    })

    return {
      formData,
      Search,
      onSearch,
      tableData,
      currentPage,
      pageSize,
      total,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>
