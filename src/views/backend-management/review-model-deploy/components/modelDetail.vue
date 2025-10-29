<template>
  <!-- 模型详情抽屉 -->
  <el-drawer v-model="drawerVisible" title="模型详情" direction="rtl" size="50%" @close="handleClose" :modal="false">
    <div class="drawer-content">
      <div class="detail-section" v-if="currentModel">
        <h4>基本信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="模型ID">{{ currentModel.modelId }}</el-descriptions-item>
          <el-descriptions-item label="模型名称">{{ currentModel.modelName }}</el-descriptions-item>
          <el-descriptions-item label="运行时间">{{ currentModel.runTime }}</el-descriptions-item>
          <el-descriptions-item label="运行次数">{{ currentModel.runCount }}</el-descriptions-item>
          <el-descriptions-item label="推理延迟(ms)">{{ currentModel.inferenceLatency }}</el-descriptions-item>
          <el-descriptions-item label="内存使用(MB)">{{ currentModel.memoryUsage }}</el-descriptions-item>
          <el-descriptions-item label="准确率（最好）">{{ currentModel.bestAccuracy ? currentModel.bestAccuracy.toFixed(3) : '' }}</el-descriptions-item>
          <el-descriptions-item label="准确率（平均）">{{ currentModel.avgAccuracy ? currentModel.avgAccuracy.toFixed(3) :'' }}</el-descriptions-item>
          <el-descriptions-item label="均方误差（MSE/RMSE）" :span="2">{{
            currentModel.squaredError
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模型试用记录表格 -->
      <div class="detail-section" v-if="currentModel">
        <h4>试用记录</h4>
        <trialRecord :currentModelId="busId" :backendModel="true"></trialRecord>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import trialRecord from '@/views/model-evaluation/model-ontrial/components/trialRecord.vue'
import { modelApprovalDetail } from '@/api/backStageManage'
const drawerVisible = ref(true)
const currentModel = ref({
  "modelName": "A2O外回流比推理模型",
  "modelType": "机器学习",
  "createdAt": "2023-11-15 09:30:00",
  "publicStatus": "未公开模型",
  "owner": "华东业务区污水厂",
  "lastUpdated": "2024-02-10",
  "developLanguage": "Python",
  "applicableScenario": "A2O",
  "algorithm_architecture": "LSTM",
  "trialCount": 720,
  "modelId": "ML001",
  "modelLabel": "回归",
  "modelVersion": "V3",
  "versionAlias": "测试版本",
  "published_version": "V3",
  "versionCount": 2,
  "modelCreator": "系统管理员",
  "createOrganization": "集团",
  "inputParameters": "SV30、SVI、FM",
  "formula": "AND(F/M>0.01,SV30>20,SVI>70)",
  "outputParameters": "污泥膨胀状态（“膨胀”/“正常”）",
  "releaseStatus": "已发布",
  "applicationStatus": "审核中",
  "deploymentStatus": "部署成功",
  "deploymentTime": "2025-07-20 08:00",
  "approvalStatus": "审批成功",
  "applicationTime": "2024-01-01 00:00:00",
  "runTime": "2025-07-20 08:00",
  "runCount": 1520,
  "inferenceLatency": 120,
  "memoryUsage": 1024,
  "bestAccuracy": 0.938,
  "avgAccuracy": 0.925,
  "squaredError": "0.045 (RMSE)",
  "evaluationMetrics": "节能率 15%±2%",
  "applicationDescription": "XX申请描述",
  "applicationInstructions": "XX申请说明",
  "updateUser": "系统管理员",
  "taskName": "训练任务_test1",
  "taskType": "回归",
  "framework": "Paddle2.3.0",
  "taskStatus": "运行完成",
  "taskDuration": "10分16秒",
  "taskCreateTime": "2024-01-01 00:00:00",

  "notes": "用于预测A2O工艺中各池溶解氧浓度变化趋势"
})
const emits = defineEmits(['close'])
const handleClose = (done: () => void) => {
  emits('close')
}
const props = defineProps({
  itemModelId: {
    type: String,
    default: ''
  },
  busId: {
    type: String,
    default: ''
  }
})
// const detailData = ref({})
const getModelDetail = () => {
  modelApprovalDetail(props.itemModelId).then(res => {
    if(res.code === 0){
      currentModel.value = res.data;
    }else{
      ElMessage.error(res.message)
    }
  }).finally(() => {
  })
}
onMounted(() => {
  getModelDetail()
})

</script>


<style scoped lang="postcss">
.drawer-content {
  padding: 20px;
}

.custom-form {
  :deep(.el-form-item__label) {
    text-align: left;
    justify-content: flex-start;
    padding-right: 12px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input,
  .el-select,
  .el-textarea {
    width: 100%;
  }

  .el-textarea {
    :deep(.el-textarea__inner) {
      min-height: 80px;
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color-light);
}
</style>



<style scoped>
.drawer-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin-bottom: 15px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}

.table-search {
  width: 100%;
  display: flex;
  justify-content: end;
}

.table-search-item {
  display: flex;
}
</style>