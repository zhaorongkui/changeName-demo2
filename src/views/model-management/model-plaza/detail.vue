<template>
  <div class="detail-content" v-loading="loading">
    <div class="top-content detail-config">
      <div class="content-title">
        <h3 class="data-header-title">{{ currentDetailsData.name }}</h3>
        <div>
          <span v-if="['review', 'deploy', 'reviewDetail'].includes(pageType)">
            <span v-if="['review'].includes(pageType)" style="margin-right: 10px">
              <el-button type="primary" @click="approvalFun()">审核通过</el-button>
              <el-button type="primary" @click="rejection()">审核驳回</el-button>
            </span>
            <el-button type="primary" @click="getWorkFlow">工作流</el-button>
          </span>
          <el-button type="primary" v-else @click="handleTrial">{{ '试用' }}</el-button>
          <el-button style="margin-left: 10px" :icon="ArrowLeft"  @click="handleBack">返回</el-button>
        </div>
      </div>
      <modelBaseInfo @getDate="getDate" :modelId="modelId" :isEdit="getEditStatus" :currentDetail="currentDetailsData"
        :pageType="pageType"></modelBaseInfo>
    </div>
    <div class="bottom-content ">
      <div class="left-content detail-config">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="模型介绍" name="modelIntroduction">
            <modelNotes :currentDetail="currentDetailsData"></modelNotes>
          </el-tab-pane>
          <el-tab-pane :label="currentDetailsData.modelType != '3' ? '参数设置' : '数据规则'" name="parameterConfig">
            <modelParamsConfig :currentDetail="currentDetailsData"></modelParamsConfig>
          </el-tab-pane>
          <el-tab-pane label="模型评价" name="modelEvaluation">
            <modelEvaluation :currentDetail="currentDetailsData" :square="route.query.square"
              @close="handleCloseEvaluation"></modelEvaluation>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--      关联数据集-->
      <div class="right-content detail-config">
        <correlationDataset :currentDetail="currentDetailsData"></correlationDataset>
      </div>
    </div>

  </div>
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
  <!-- 工作流弹出框 -->
  <WorkFlow v-if="visible" :workflowId="workflowId" :visible="visible" @update:visible="visible = $event" />
  <!--  试用弹窗-->
  <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail" :currentModelId="modelId"
    pageType="ontrial"></viewModelDetail>
  <!-- 数据规则模型 试用跳数据规则编辑器-->
  <RuleModelEditor v-if="showAddModal"  :isTry="true" :editing-row="currentDetailsData" :paramInList="currentDetailsData.paramInList"
    @close="handleCloseModal" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import modelEvaluation from './components/modelEvaluation.vue'
// 模型详情接口
import { getModelDetail } from '@/api/modelManage'
import modelBaseInfo from './components/modelBaseInfo.vue'
import modelNotes from './components/modelMotes.vue'
import modelParamsConfig from './components/modelParamsConfig.vue'
import correlationDataset from './components/correlationDataset.vue'
import { useCheckReject } from '@/hooks/useCheckReject';
import WorkFlow from '@/components/WorkFlow/index.vue'
import RuleModelEditor from "~/views/model-management/data-rule-models/components/RuleModelEditor.vue";
import { getHistoryProgress } from '@/api/thirdparty';
import { ElMessage } from 'element-plus'
import {useDictValues} from "~/hooks/useDictValues";
import {ArrowLeft} from "@element-plus/icons-vue";
const showAddModal = ref(false)
const versionState = ref<string>('')
const isShowViewModelDetail = ref(false)
const loading = ref(false)
const visible = ref(false)
const route = useRoute()
const modelId = ref<number | string>('')
const taskId = ref<number | string>('')
const pageType = ref<string>('')
const busType = ref<string>('')
const workflowId = ref<string>('')
const pageTypeNum = ref<number>(4)
const activeName = ref('modelIntroduction')
const dialogVisible = ref(false)
const approve = ref(false)
const addDataForm = ref({
  reason: ''
})
const rules = {
  reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
}
/**
 * 模拟接口查询当前id数据
 */
const currentDetailsData = ref({
  name: "",
  owner: '',
  creator: "",
  updateTime: "",
  tagList: []
})
// 当前是否可编辑状态
const getEditStatus = computed(() => {
  return route.path === '/model-detail'
})

const getDate = (time) => {
}
onMounted(() => {
  pageType.value = typeof route.query.pageType === 'string' ? route.query.pageType : 'detail'
  busType.value = route.query.busType
  pageTypeNum.value = route.query.pageTypeNum
  workflowId.value = route.query.workflowId
  modelId.value = route.query.modelId
  taskId.value = route.query.taskId
  versionState.value = route.query.versionState as string
  getDetails(route.query.modelId as string)
})
const approvalFun = () => {
  approve.value = true
  dialogVisible.value = true
  addDataForm.value.reason = ''
}
// 驳回
const rejection = () => {
  approve.value = false
  dialogVisible.value = true
  addDataForm.value.reason = ''
}

const getDetails = (id: string | number) => {
  loading.value = true
  // 获取模型的列表
  getModelDetail(
    id
  ).then((res) => {
    if (res.success) {
      currentDetailsData.value = res.data
    } else {
      currentDetailsData.value = {}
    }
    // setDetailsDataFn(data)
  }).finally(() => {
    loading.value = false
  })
}
// 关闭评价弹窗
const handleCloseEvaluation = () => {
  getDetails(route.query.modelId as string)
}
const router = useRouter()
const goBack = () => {
  router.go(-1);
}
const getWorkFlow = () => {
  if (!workflowId.value) {
    ElMessage.warning('当前数据无工作流信息')
    return
  }
  visible.value = true
}
// 引入Hook，并传入当前页面的列表方法
const { approval, reject, getGeneralData } = useCheckReject(goBack); // 导出
const handleClose = () => {
  dialogVisible.value = false
}
const addFormRef = ref(null)
const handleConfirmFun = () => {
  if (approve.value) {
    const params = {
      pageType: pageTypeNum.value,
      busType: busType.value,
      reason: addDataForm.value.reason
    }
    approval(taskId.value, currentDetailsData.value.creator, JSON.stringify(params), addDataForm.value.reason)
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
        busType: busType.value,
        dataId: route.query.busId,
        id: route.query.modelId,
        reason: addDataForm.value.reason
      }
      // return
      reject(taskId.value, JSON.stringify(params), addDataForm.value.reason)
    }
  })

}
// 试用
const handleTrial = () => {

    if (currentDetailsData.value.modelType == 1) {
      isShowViewModelDetail.value = true
    } else if (currentDetailsData.value.modelType == 2) {
      let url = 'http://10.198.0.137/apps'
      window.open(url)
    } else if (currentDetailsData.value.modelType == 3) {
      showAddModal.value = true
    }

}
// 关闭机器学习模型试用弹窗
const handlCloseViewModelDetail = () => {
  isShowViewModelDetail.value = false
}
// 关闭数据规则模型试用弹窗
const handleCloseModal = () => {
  showAddModal.value = false
}
const updataData = (id) => {
  getDetails(id)
}
const handleWorkClose = () => {
  visible.value = false
}
const handleBack = ()=>{
  router.go(-1)
}
</script>
<style lang="scss" scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  //height: 97%;
  flex: 1;
  overflow: hidden;

  .top-content {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    .content-title {
      display: flex;
      width: 100%;
    }
  }

  .bottom-content {
    display: flex;
    flex: 1;
    overflow: auto;

    .left-content {
      width: 70%;
      height: 100%;
      margin-right: 20px;
    }

    .right-content {
      flex: 1;
      height: 100%;
    }
  }
}

.detail-config {
  height: auto;
  flex: none;
}

:deep(.el-tabs__nav-wrap:after) {
  display: none !important;
}

:deep(.el-tabs__header .el-tabs__item) {
  font-size: 18px;
}

.demo-tabs {
  width: 100%;
}


:deep(.el-tabs__content) {
  overflow: auto;
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
