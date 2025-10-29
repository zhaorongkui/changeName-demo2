<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="handleClose" :close-on-click-modal="false">
    <div class="version-container">
      <div class="main-content">
        <div class="search-section">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset">
            <template #updateTime>
              <el-date-picker
                v-model="queryData.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </template>
          </AdvancedSearch>
        </div>
        <div class="content-main">
          <div class="table-operate"></div>

          <!-- 表格数据展示 -->
          <div class="data-table-container">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="version" label="数据集版本" align="center" width="150"></el-table-column>
              <el-table-column prop="updateContent" label="更新内容" align="center"></el-table-column>
              <el-table-column prop="updateTime" label="更新时间" align="center" width="200"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'

export default defineComponent({
  name: 'VersionModal',
  props: {
    dialogTitle: {
      type: String,
      default: '查看版本记录'
    }
  },
  components: {
    AdvancedSearch
  },
  emits: ['close'],
  setup(props, { emit }) {
    const queryData = ref({
      updateContent: '',
      timeRange: []
    })
    const formItemList = ref([
      {
        type: 'input',
        label: '更新内容',
        paramKey: 'updateContent',
        placeholder: '请输入更新内容',
        modelValue: queryData.value.updateContent
      },
      {
        label: '更新时间',
        paramKey: 'updateTime',
        type: 'dateRange',
        placeholder: ['开始日期', '结束日期'],
        multiple: 2,
        isSlot: true,
        modelValue: queryData.value.updateTime
      }
    ])

    const handleFilterSearch = (data: any) => {
      loadTableData()
    }
    const handleFilterReset = () => {
      queryData.value = { updateContent: '', timeRange: [] }
      loadTableData()
    }
    const tableData = ref([])
    const loadTableData = () => {
      // 模拟加载数据
      // 实际应用中可以调用API获取数据
      console.log('加载表格数据', queryData.value)
      tableData.value = [
        {
          version: 'V3版',
          updateContent: '更新应用字段 name02, 原名 “table_field_name02”',
          updateTime: '2024-01-01 00:00:00'
        },
        {
          version: 'V2版',
          updateContent:
            '移除应用字段 table_field_name02; 新增应用字段 table_field_name10,table_field_name01,table_field_name03',
          updateTime: '2024-01-01 00:00:00'
        },
        {
          version: 'V1版',
          updateContent: '初次创建, 应用字段 table_field_name01,table_field_name02,table_field_name03',
          updateTime: '2024-01-01 00:00:00'
        }
      ]
    }

    const rules = ref({})

    const dialogVisible = ref(true)
    // 关闭对话框
    const handleClose = () => {
      dialogVisible.value = false
      emit('close')
    }
    onMounted(() => {
      // 初始化加载表格数据
      loadTableData()
    })

    return {
      dialogVisible,
      formItemList,
      queryData,
      handleFilterReset,
      handleFilterSearch,
      loadTableData,
      tableData,
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.version-container {
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>
