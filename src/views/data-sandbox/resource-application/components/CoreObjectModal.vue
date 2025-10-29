<template>
  <div class="modal-container">
    <div class="main-content">
      <div class="apply-modal-form">
        <!-- <div class="panel-title">基础信息（去掉）</div> -->
        <CoreObject :ldmList="currentDataset.ldmList"></CoreObject>
      </div>
      <div class="apply-modal-content">
        <!-- tab列表区域 -->
        <FieldDataResources :currentDatasetDetail="currentDataset" ref="fieldData"></FieldDataResources>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject, } from 'vue'
import { ElMessage } from 'element-plus'
// import fieldSetting from './fieldSettings.vue'
import CoreObject from "~/views/data-sandbox/resource-application/components/CoreObject.vue";
import FieldDataResources from "~/views/data-sandbox/resource-application/components/FieldDataResources.vue";
import { useRoute } from 'vue-router'
import { getDatasetDetail } from '@/api/dataset.ts'
import { useDatasetStore } from '@/store/modules/datasetStore'

const route = useRoute()
// 控制对话框显示/隐藏的 ref
const visible = ref(true)
const emits = defineEmits(['close'])
const props = defineProps({
  cordObjectShow: {
    type: Boolean,
    default: false
  },
  dataChecked: {
    type: Array,
    default: () => []
  }

})
// 暴露一个方法给父组件，用于打开对话框
const openDialog = () => {
  visible.value = true
}
const datasetId = computed(() => {
  return route.query.datasetId as string
})
const isLoading = ref(false)
const currentDataset = ref({
  name: "",
  datasetsId: '',
  orgDimension: '',
  deadline: '',
  createTime: '',
  updateTime: '',
  type: 1,
  creator: '',
  timeRange: '',
  ldmList: []
})
const checkTagList = ref([])
const datasetStore = useDatasetStore()

// 获取数据集详情 这里应该拿到是上一页面数据，前端来处理这个块儿的逻辑，不用再掉接口
const getDetailData = () => {
  isLoading.value = true
  getDatasetDetail({ id: datasetId.value }).then(res => {
    if (res.success) {
      currentDataset.value = res.data
      checkTagList.value = res.data.ldmList
      if (res.data.ldmList.length > 0) {
        datasetStore.clickCoreObject(res.data.ldmList[0].id)
      }
      console.log(currentDataset.value, 'val---')
    } else {
      ElMessage.error(res.message)
      currentDataset.value = {
        name: "",
        datasetsId: '',
        orgDimension: '',
        deadline: '',
        createTime: '',
        updateTime: '',
        type: 1,
        creator: '',
        timeRange: '',
      }
    }
  }).finally(() => {
    isLoading.value = false
  })

}
const checkedList = inject('checked', ref([]));
const fieldData = ref(null)
const getField = () => {
  let id = checkedList.value.length > 0 && checkedList.value[0].id || ''
  datasetStore.clickCoreObject(id)
  fieldData.value.getFieldData()

}
onMounted(() => {
  //   getDetailData()
})

// 表单实例 ref
const formRef = ref(null)
// 上传组件实例 ref
const uploadRef = ref(null)

// 取消按钮点击事件
const handleCancel = () => {
  visible.value = false
}

// 下一步按钮点击事件（示例：先校验表单，再处理上传/下一步逻辑）
const handleNext = async () => {
  console.log('保存按钮');

}

// 关闭弹窗
const handleClose = () => {
  emits('close')
}
// 暴露给父组件的方法
defineExpose({
  openDialog,
  getField,
})
</script>

<style lang="scss" scoped>
.modal-container {
  height: 530px;

  .main-content {
    .apply-modal-form {
      padding: 12px 16px 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #ccc;
    }

    .apply-modal-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px;
      overflow: hidden;

    }
  }
}

.table-operate {
  .check-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-right: 8px;

    .check-tag-item {
      --el-color-info: #909399;
      --el-color-info-light-9: rgb(244, 244, 245);

      .el-check-tag {
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: #e6f4ff;
          color: #409eff;
        }
      }
    }
  }
}

.content-title-extra {
  padding-left: 10px;

  .extra-info {
    display: flex;

  }

  .label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .text-info {
    display: inline-block;
    margin-left: 5px;
  }
}

.panel-title {
  margin-bottom: 10px;

  .el-checkbox {
    margin-left: 50px;
  }
}
</style>