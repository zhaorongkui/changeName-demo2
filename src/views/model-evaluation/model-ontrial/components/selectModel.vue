<template>

  <el-dialog title="选择模型" v-model="dialogVisible" width="60%" :close-on-click-modal="false">
    <div class="bg-white p-3 px-7" style="width: 100%;">
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="tableData"
            :columns="tableColumns"
            :options="tableConfig"
            @command="onCommand"
        />
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
    <!--  试用弹窗-->
    <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail"></viewModelDetail>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import AdvancedSearch from "@/components/AdvancedSearch/index.vue";
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emits = defineEmits(['close'])
const pageKey = 'select-model'
const isShowViewModelDetail = ref(false)
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `${pageKey}Id`
})
//表格列
const tableColumns = computed(() => {
  return [
    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center'
    },
    {
      prop: 'versionAlias',
      label: '版本别名',
      align: 'center'
    },

    {
      prop: 'notes',
      label: '模型描述',
      align: 'center'
    },
    {
      prop: 'modelCreator',
      label: '创建人',
      align: 'center'
    },
    {
      prop: 'modelVersion',
      label: '版本',
      align: 'center'
    },
    {
      prop: 'createdAt',
      label: '创建时间',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: [
        {
          name: '试用',
          command: 'trial',
          type: 'primary'
        },
      ]
    }
  ]
})
const dialogVisible = ref<boolean>(true);
const tableData = ref([
  {
    index: 1,          // 序号（可直接用 el-table 的 type="index" 自动生成，这里显式声明方便演示）
    modelName: "通用目标检测模型_YoloV3", // 模型名称
    modelId: "26416",  // 模型ID
    modelDesc: "",     // 模型描述
    version: 'v1',   // 版本数量
    versionAlias: 'v1试用版',
    creator: "王技术员",   // 创建人
    createTime: "2024-01-01 00:00:00", // 创建时间
    action: "试用"     // 操作按钮文字（实际渲染时可用 <el-button> 组件）
  },
  {
    index: 2,
    modelName: "T_SUM函数",
    modelId: "26417",
    modelDesc: "用于获取一个指标在指定时间范围内的所有数据值之和",
    version: 'v1',
    versionAlias: 'v1测试版',
    creator: "张三",
    createTime: "2024-01-01 00:00:00",
    action: "试用"
  },
  {
    index: 3,
    modelName: "通用图像分类模型_Xception71",
    modelId: "26418",
    modelDesc: "",
    version: 'v2',
    creator: "张三",
    versionAlias: 'v2测试版',
    createTime: "2024-01-01 00:00:00",
    action: "试用"
  },
  // 新增的 5 条数据（接序号 4～8）
  {
    index: 4,
    modelName: "通用目标检测模型_YoloV4",
    modelId: "26419",
    modelDesc: "YoloV4 是在 YoloV3 基础上改进的目标检测算法，精度与速度更优",
    version: 'v3',
    versionAlias: 'v3测试版',
    creator: "张三",
    createTime: "2024-01-02 10:00:00",
    action: "试用"
  },
]);
/**
 * 分页
 *
 */
const handlePageChange = () => {
};

/**
 * 关闭弹窗
 */
const handleClose = ()=> {
  emits('close')
}

/**
 * 试用
 * @param row
 */
const handleOnTrial = (row)=> {
  console.log(row,'row===')
  isShowViewModelDetail.value = true
}
/**
 * 表格操作
 * @param command
 * @param row
 */
const onCommand = (command, row) => {
  switch (command) {
    case 'trial':
      handleOnTrial(row)
      break
  }
}
/**
 * 关闭试用弹窗
 */
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
}
</script>
<style scoped>
:deep(.el-drawer__body .el-form-item){
  flex-direction: row !important;
}
.form-item{
  flex-direction: row !important;
}
</style>


