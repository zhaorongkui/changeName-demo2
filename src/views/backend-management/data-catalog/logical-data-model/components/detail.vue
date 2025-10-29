<template>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="29%" @close="cancelClick">

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="BaseInfo">
        <el-descriptions title="" border :column="1" column-max-width="100px">
          <el-descriptions-item label="实体/表名">{{ detailInfo.entity }}</el-descriptions-item>
          <el-descriptions-item label="实体编码">{{ detailInfo.entityCode }}</el-descriptions-item>
          <el-descriptions-item label="字段数量">{{ detailInfo.fieldCount }}</el-descriptions-item>
          <el-descriptions-item label="业务域">{{ detailInfo.businessDomain }}</el-descriptions-item>
          <el-descriptions-item label="数据来源">{{ arrayToMap(dataSourceMapList)[detailInfo.dataSource.toString()]
          }}</el-descriptions-item>
          <el-descriptions-item label="业务定义">{{ detailInfo.businessDefinition }}</el-descriptions-item>
          <el-descriptions-item label="业务规则">{{ detailInfo.businessRules }}</el-descriptions-item>
          <el-descriptions-item label="责任部门">{{ detailInfo.responsibleDepartment }}</el-descriptions-item>
          <el-descriptions-item label="版本信息">{{ detailInfo.versionInfo }}</el-descriptions-item>
          <el-descriptions-item label="生命周期状态">{{ detailInfo.lifecycleStatus }}</el-descriptions-item>
          <el-descriptions-item label="访问权限">{{ detailInfo.accessPermissions }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="分类详情" name="dataSet">
        <!-- <typeDetail ref="modelDataset" :isEdit="isEdit" :currentType="currentTypeInfo"></typeDetail> -->
        <!-- 表格数据展示 -->
        <div class="data-table-container">
          <el-table :data="tableData" class="table-content" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="字段名称" min-width="100" prop="columnName">
            </el-table-column>
            <el-table-column label="字段描述" min-width="100" prop="columnComment">
            </el-table-column>
            <el-table-column label="字段类型" min-width="100" prop="columnType">
            </el-table-column>
            <!-- <el-table-column label="数据模型" min-width="100" prop="dataTags">
            </el-table-column>
            <el-table-column label="单位" min-width="100" prop="unit">
            </el-table-column> -->
          </el-table>
        </div>
      </el-tab-pane>

    </el-tabs>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { arrayToMap } from '@/utils/index'
import { ailabLogicalDataModelDetail, getDataSourceTableColumnSelect } from '@/api/backStageManage'
import { ElMessageBox, ElMessage } from 'element-plus'
const props = defineProps({
  currentData: {
    type: Object,
    default: {}
  },
  dataSourceList: {
    type: Array,
    default: []
  }
})
// 当前tab
const activeName = ref('BaseInfo')
const detailInfo = ref({
  tableSchema: '',
  entity: '',
  entityCode: '',
  fieldCount: 0,
  businessDomain: '',
  dataSource: '',
  businessDefinition: '',
  businessRules: '',
  responsibleDepartment: '',
  versionInfo: '',
  lifecycleStatus: '',
  accessPermissions: '',
  title: ''
})
const emits = defineEmits(['close'])
const drawer = ref(true)
const cancelClick = () => {
  emits('close')
}
const tableData = ref([])
const getDataSourceTableColumnSelectFun = () => {
  let params = {
    tableSchema: detailInfo.value.tableSchema,
    tableName: detailInfo.value.entityCode
  }
  getDataSourceTableColumnSelect(params).then(res => {
    if (res.code === 0) {
      console.log(77777777, res);
      tableData.value = res.data
      // formData.value.fieldCount = res.data.length.toString()
    } else {
      ElMessage.error(res.message)
    }
  })
}
const dataSourceMapList = ref([])
onMounted(() => {
  dataSourceMapList.value = props.dataSourceList.map(item => {
    return {
      name: item.dictName,
      id: item.dictCode
    }
  })
  // console.log(props.currentData, 'ccc', dataSourceMapList.value)
  ailabLogicalDataModelDetail(props.currentData.id).then(res => {
    if (res.success) {
      detailInfo.value = res.data
      getDataSourceTableColumnSelectFun()
    }
  })
})
</script>