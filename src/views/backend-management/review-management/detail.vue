<template>
  <div class="detail-content" v-loading="isLoading">
    <div class="top-content detail-config ">
      <div class="content-title">
        <div class="data-title">
         <div style="display: flex; justify-content: space-between">
           <h3>{{ currentDataset.name }}</h3>
           <div class="authorize-top-extra">
             <el-button :icon="ArrowLeft" size="small" @click="handleBack">返回</el-button>
           </div>
         </div>
          <div style="margin-left: 10px; " class="flex justify-between">
            <span>数据集ID：{{ currentDataset.datasetsId }}</span>
            <div class="table-operate">
              <el-button type="primary" @click="approvalFun()" v-if="route.query.pageType === 'review'">审核通过</el-button>
              <el-button type="primary" @click="rejection()" v-if="route.query.pageType === 'review'">审核驳回</el-button>
              <el-button type="primary" @click="getWorkFlow">工作流</el-button>
            </div>
          </div>
        </div>
        <!-- <img :src="img" alt="流程图" class="flow-chart"> -->
        <div class="content-title-extra">
          <div class="extra-info" style="margin-bottom: 20px">
            <el-row style="width: 100%">
              <el-col :span="6">
                <div class="field-content">
                  <div>组织维度: <span :title="getNamesStringByOrgIdsOptimized(currentDataset.orgDimension)"
                      class="text-info text-ellipsis">{{ getNamesStringByOrgIdsOptimized(currentDataset.orgDimension)
                      }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>时间范围:<span class="text-info">{{ currentDataset.timeRange }}</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>创建人:<span class="text-info">{{ currentDataset.creator }}</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>创建时间:<span class="text-info">{{ currentDataset.createTime }}</span></div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="extra-info">
            <el-row style="width: 100%">
              <el-col :span="6">
                <div>
                  <div>数据集类型:<span class="text-info">{{ currentDataset.type ? '公开数据集' : '未公开数据集' }}</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <div>最近更新时间:<span class="text-info">{{ currentDataset.updateTime }}</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <div>到期时间:
                    <span class="text-info" v-if="route.query.pageType === 'review'">
                      <el-date-picker v-model="currentDataset.deadline" :disabled-date="disabledBeforeOptions"
                        type="date" placeholder="请选择到期时间" class="w-full endTimeStyle" @change="handleDateChange" />
                    </span>
                    <span class="text-info" v-else>{{ currentDataset.deadline }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <div class="left-content detail-config">
        <CoreObject :ldmList="currentDataset.ldmList"></CoreObject>
      </div>
      <div class="right-content detail-config">
        <FieldDataResources :currentDatasetDetail="currentDataset" :datasetId="datasetId" :routePageType="pageType">
        </FieldDataResources>
      </div>
    </div>
  </div>
  <DataExplorationModal v-if="showDataExplorationModal" @close="showDataExplorationModal = false" />
  <el-dialog v-model="dialogVisible" :title="approve ? '通过' : '驳回'" :before-close="handleClose" destroy-on-close
    :close-on-click-modal="false">
    <div class="modal-container">
      <div class="main-content">
        <div class="open-modal-form">
          <el-form :model="addDataForm" ref="addFormRef" :rules="rules" label-width="100" class="w-full m-auto">
            <el-form-item :label="approve ? '审核意见:' : '驳回原因:'" prop="reason">
              <el-input v-model="addDataForm.reason" type="textarea" :rows="6" placeholder="请输入" clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmFun">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 工作流弹出窗 -->
  <WorkFlow v-if="visible" :workflowId="workflowId" :visible="visible" @update:visible="visible = $event" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getNamesStringByOrgIdsOptimized } from '@/utils/dataSandbox'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataExplorationModal from '@/views/data-sandbox/components/DataExplorationModal.vue'
import { useDatasetStore } from '@/store/modules/datasetStore'
import { getDatasetDetail } from '@/api/dataset.ts'
import { updataDuedate, updataDesensitizeField } from '@/api/backStageManage.ts'
import CoreObject from "~/views/data-sandbox/components/CoreObject.vue";
import FieldDataResources from "~/views/data-sandbox/components/FieldDataResources.vue";
import { disabledBeforeOptions } from '@/utils/date'
import {ArrowLeft, Search} from "@element-plus/icons-vue";
import { useCheckReject } from '@/hooks/useCheckReject';
import WorkFlow from '@/components/WorkFlow/index.vue'
import { formatDate } from '@/utils/date'
// import { reviewBack, reviewApproval, getGeneral, getHistoryProgress } from '@/api/thirdparty';
import { add } from 'lodash-es'
const route = useRoute()
const router = useRouter()
const visible = ref(false)
const isLoading = ref(false)
const dialogVisible = ref(false)
const approve = ref(false)
const addDataForm = ref({
  reason: ''
})
const rules = {
  reason: [{ required: true, message: '请输入原因说明', trigger: 'blur' }],

}
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
})

const busType = computed(() => {
  return route.query.busType
})
const pageTypeNum = computed(() => {
  return route.query.pageTypeNum
})
const pageType = computed(() => {
  return route.query.pageType || 'detail' as string
})
const workflowId = computed(() => {
  return route.query.workflowId
})
const rowId = computed(() => {
  console.log()
  return route.query.rowId
})
const datasetId = computed(() => {
  return route.query.datasetId as string
})
const taskId = computed(() => {
  return route.query.taskId as string
})
const datasetStore = useDatasetStore()
const businessId = ref('')
// Todo 通过切换数据集详情获取业务对象ID
const showDataExplorationModal = ref(false)
const handleView = () => {
  showDataExplorationModal.value = true
}
const handleWorkClose = () => {
  visible.value = true;
}
const handleDateChange = (e) => {
  let timeStr = formatDate(new Date(e), "YYYY-MM-DD");
  let params = {
    datasetId: currentDataset.value.datasetsId,
    dueDate: timeStr
  }
  updataDuedate(params).then(res => {
    if (res.success) {
      // ElMessage.success('到期时间修改成功')
    } else {
      ElMessage.error(res.message)
    }
  })
}
const goBack = () => {
  router.go(-1);
}
// 引入Hook，并传入当前页面的列表方法
const { approval, reject } = useCheckReject(goBack); // 导出
const checkTagList = ref([])
// checkTagList.value = businessObjectMockData
//   .map((tag) => ({
//     id: tag.id,
//     tag: tag.name
//   }))
//   .splice(0, 5)
const approvalFun = () => {
  // taskId, currentDataset.creator, ''
  if (currentDataset.value.deadline === null || currentDataset.value.deadline === '') {
    ElMessage.error('请选择到期时间')
    return
  }
  approve.value = true
  dialogVisible.value = true
  addDataForm.value.reason = ''
}
const rejection = () => {
  if (currentDataset.value.deadline === null || currentDataset.value.deadline === '') {
    ElMessage.error('请选择到期时间')
    return
  }
  approve.value = false
  dialogVisible.value = true
  addDataForm.value.reason = ''
}
// 获取数据集详情
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
const getWorkFlow = () => {
  if (!workflowId.value) {
    ElMessage.warning('当前数据无工作流信息')
    return
  }
  visible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}
const addFormRef = ref(null)
const handleConfirmFun = () => {

  if (approve.value) {
    const formRef = addFormRef.value as any
    if (!formRef) return
    formRef.validate((valid: boolean) => {
      if (valid) {
        const params = {
          pageType: pageTypeNum.value,
          busType: busType.value,
          reason: addDataForm.value.reason
        }
        // 审批通过
        approval(taskId.value, currentDataset.value.creator, JSON.stringify(params), addDataForm.value.reason)
      }
    })
  } else {
    // 驳回
    handleConfirm()
  }
}
const handleConfirm = () => {

  const formRef = addFormRef.value as any
  if (!formRef) return
  formRef.validate((valid: boolean) => {
    if (valid) {
      dialogVisible.value = false
      addDataForm.value.reason
      const params = {
        pageType: pageTypeNum.value,
        dataId: datasetId.value,
        busType: busType.value,
        id: rowId.value,
        reason: addDataForm.value.reason
      }
      // console.log(params)
      // return
      reject(taskId.value, JSON.stringify(params), addDataForm.value.reason)
    }
  })

}
onMounted(() => {
  getDetailData()
})
const handleBack = ()=>{
  router.go(-1)
}
</script>
<style lang="scss" scoped>
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

.detail-config {
  height: auto !important;
  flex: none !important;
}

.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  .top-content {
    margin-bottom: 20px;

    .content-title {
      display: flex;
      flex-direction: column;
      width: 100%;

      .data-title {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
      }

      .content-title-extra {
        padding-left: 10px;

        .extra-info {
          display: flex;

        }

        .text-info {
          display: inline-block;
          margin-left: 5px;
        }

        .text-ellipsis {
          display: inline-block;
          max-width: 60%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: bottom;
          cursor: pointer;
        }
      }
    }
  }

  .bottom-content {
    display: flex;
    height: 100%;

    .left-content {
      width: 20%;
      margin-right: 20px;
      height: 100%;
      overflow: hidden;
    }

    .right-content {
      flex: 1 !important;
      height: 100%;
      overflow: auto;
    }
  }
}

.modal-container {
  .main-content {
    .open-modal-form {
      height: 180px;
      flex: 1;
      margin-top: 50px;
    }
  }
}
</style>
