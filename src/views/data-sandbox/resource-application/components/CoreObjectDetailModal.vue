<template>
  <!-- 外层包裹 el-dialog -->
  <el-dialog v-model="visible" title="数据集详情" width="85%" modal-class="dataset-apply-dialog" @close="handleClose" :close-on-click-modal="false">
    <div class="modal-container">
      <div class="main-content">

        <div class="apply-modal-form">
          <div class="content-title">
            <h3>业务实体信息</h3>
          </div>
          <BusinessInfo :businessId="businessId" :isEdit="false" :currentDataCatalog="currentDataCatalog"
            pageType="catalog" />
        </div>
        <div class="apply-modal-content">
          <BusinessDetail sourceType="business" :datasetId="datasetId" :businessId="businessId"
            :currentDataCatalog="currentDataCatalog" ref="filedData" pageType="catalog" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, } from 'vue'
import { ElMessage } from 'element-plus'
// import fieldSetting from './fieldSettings.vue'
import BusinessInfo from './BusinessInfo.vue'
import BusinessDetail from './BusinessDetail.vue'
import { useRoute } from 'vue-router'
const emit = defineEmits(['close'])
const route = useRoute()
const businessId = computed(() => {
  console.log(route.query.businessId, 'id===')
  return route.query.businessId as string
})
const datasetId = computed(() => {
  return route.query.datasetId as string
})
const currentDataCatalog = ref<any>({})

onMounted(() => {
  console.log(route.query, 'quert')
  if (route.query.currentDataCatalog) {
    currentDataCatalog.value = JSON.parse(route.query.currentDataCatalog)
    console.log(currentDataCatalog.value, 'value====')
  }
})
onMounted(() => {
  //   getDetailData()
})
const visible = ref(false)
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
const filedData = ref(null);
const openDialog = (item) => {
  visible.value = true
  currentDataCatalog.value = item
  setTimeout(() => {
    filedData.value.getFieldData()
  })

}
// 关闭弹窗
const handleClose = () => {
  emit('close')
}
// 暴露给父组件的方法
defineExpose({
  openDialog,
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