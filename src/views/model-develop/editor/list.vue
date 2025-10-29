<template>
  <div class="detail-config">
    <div class="content-wrapper">
      <div class="content-title">
<!--        模型开发-->
        <!--        <h3>模型列表</h3>-->
      </div>
      <div class="content-main">
        <div class="table-operate">
          <div class="table-search">
            <el-button type="primary" @click="handleAdd">新建模型</el-button>
            <div class="table-search-item">
              <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item>
                  <el-input
                    v-model="formData.keyword"
                    style="width: 240px"
                    placeholder="搜索模型名称、模型ID"
                    clearable
                    :prefix-icon="Search"
                    @change="handleSearch"
                  />
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </div>
        </div>

        <div class="data-table-container">
          <be-table
              :is-lock="false"
              :table-data="tableData"
              :columns="tableColumns"
              :options="tableConfig"
              @command="onCommand"
          >
          </be-table>
        </div>
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
<!--    新建模型-->
    <add-Model v-if="isShowAddModel" @close="handleCloseAddModel" @confirmNext="handleConfirmNext"></add-Model>
<!--    版本管理-->
    <versionDialog v-if="isShowVersionDialog" :currentModel="currentModel" @close="handleCloseVerionDialog" @confirmNext="handleConfirmNext"></versionDialog>
<!--    数据规则编辑器-->
    <RuleModelEditor
      v-if="showRuleModal"
      :isEdit="true"
      :editing-row="currentModel"
      @close="handleCloseDataRuleModel"
      @save="handleSaveDataRuleModel"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from 'vue'
import {  type TableDataItem } from './tableData'
import { Search } from '@element-plus/icons-vue'
import addModel from './components/add-model.vue'
import versionDialog from './components/versionDialog.vue'
import RuleModelEditor from '../../model-management/data-rule-models/components/RuleModelEditor.vue'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from '~/utils/constant'
import type {TableConfig,ModelInfo} from '@/types/modelManagement'
const { t } = useI18n()
// 版本管理弹窗
let isShowVersionDialog = ref(false)
//新建模型
let isShowAddModel = ref(false)
const tableColumns = computed(() => {
  return [
    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },
    { //模型名称
      prop: 'modelName',
      label: t('MODEL_NAME'),
      align: 'center',
      minWidth: 100
    },
    { //模型id
      prop: 'modelId',
      label: t('MODEL_ID'),
      align: 'center',
      minWidth: 100
    },
    { //模型类型
      prop: 'modelType',
      label: t('MODEL_TYPE'),
      align: 'center',
      minWidth: 100
    },
    { //模型描述
      prop: 'notes',
      label: t('NOTES'),
      align: 'center',
      minWidth: 100
    },
    {  //版本数量
      prop: 'versionCount',
      label: t('VERSION_COUNT'),
      align: 'center',
      minWidth: 100
    },
    { //已发布版本
      prop: 'published_version',
      label: t('PIBLISHED_VERSION'),
      align: 'center',
      minWidth: 100
    },
    { //创建人
      prop: 'modelCreator',
      label: t('MODEL_CREATOR'),
      align: 'center',
      minWidth: 100
    },
    { //创建时间
      prop: 'createdAt',
      label: t('CREATE_AT'),
      align: 'center',
      minWidth: 100
    },
    { //操作
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 160,
      buttons: [
        {
          name: '版本管理',
          command: 'version',
          type: 'primary'
        },
        {
          name: '发布',
          command: 'release',
          type: 'primary'
        },
        {
          name: '删除',
          command: 'del',
          type: 'primary'
        }
      ]
    }
  ]
})
const pageKey = 'model-list'
/**
 * 分页参数
 */
const tableConfig = ref<TableConfig>({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  // maxHeight:'150',
  rowKey: `${pageKey}Id`
})
const formData = ref({
  keyword: ''
})

// 表格数据和分页
const tableData = ref<ModelInfo[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadTableData = () => {
   let params = {
      keyword: formData.value.keyword,
      currentPage: tableConfig.value.paginationConfig.currentPage,
      pageSize: tableConfig.value.paginationConfig.pageSize,
   }
  // api(params).then(res => {
  //   if(res.status === 200) {
  //     tableData.value = res.data
  //   }else{
  //     tableData.value = []
  //   }
  // })

  // const filteredData = mockData.filter((item) => {
  //   return true
  // })

  total.value = filteredData.length

  // 计算分页数据
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  tableData.value = filteredData.slice(startIndex, endIndex)
  tableData.value = []
}

// 分页事件处理
const handlePageChange = () => {
  loadTableData()
}

/**
 * 打开新建模型弹窗
 */
const handleAdd = () => {
  isShowAddModel.value = true
}
/**
 * 关闭新建弹窗
 */
const handleCloseAddModel = () => {
  isShowAddModel.value = false
}
/**
 * 查询
 */
const handleSearch = ()=> {
  loadTableData()
}
/**
 * 重置
 */
const handleReset = () => {
  formData.value.keyword = ''
  loadTableData()
}

// 数据规则模型相关
const showRuleModal = ref(false)
// 当前模型
const currentModel = ref({
  id: '',
  ruleName: '',
  description: '',
  metrics: [],
  businessObject: '',
  dataset: ''
})
/**
 * 关闭数据规则编辑器
 */
const handleCloseDataRuleModel = () => {
  showRuleModal.value = false
}
/**
 * 保存数据规则模型
 */
const handleSaveDataRuleModel = () => {
  showRuleModal.value = false
  loadTableData()
}
/**
 * 版本管理-下一步操作
 * @param type
 */
const handleConfirmNext = (type: string) => {
  if (type === 'dataRuleModel') {
    isShowAddModel.value = false
    showRuleModal.value = true
  }
}
/**
 * 关闭版本弹窗
 */
const handleCloseVerionDialog = () => {
  isShowVersionDialog.value = false
}
// 编辑模型编辑器
const handleEdit = (row: TableDataItem) => {}

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: ModelInfo) => {
  // try {
  //   await modelDelete({ id: row.modelId })
  //   ElMessage.success('删除成功')
  //   loadTableData() // 重新加载表格数据
  // } catch (error) {
  //   ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  // }
}
/**
 * 表格操作
 * @param command
 * @param row
 */
const onCommand = (command: string, row: ModelInfo) => {
  switch (command) {
    case 'version': //版本管理
      isShowVersionDialog.value = true
        currentModel.value = row
      break
    case 'del': //删除
      handleDelete(row)
      break
    case 'release': //发布
      handleRelease(row)
      break
  }
}
/**
 * 发布  发布是对模型广场的版本进行更新。V2发布，覆盖V1。
 * @param row
 */
const handleRelease = (row: ModelInfo)=> {

}
onMounted(() => {
  handleSearch()
})
</script>
<style scoped lang="postcss">
.table-search {
  width: 100%;
  @apply flex justify-between;
  .table-search-item {
    @apply flex;
  }
}
</style>
