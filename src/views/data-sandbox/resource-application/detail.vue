
<template>
  <div class="detail-content" v-loading="isLoading">
    <div class="top-content detail-config ">
      <div class="content-title">
        <div class="data-title">
          <h3>{{currentDataset.name}}</h3>
          <div style="margin-left: 10px">数据集ID：{{currentDataset.datasetsId}}</div>
        </div>
        <div class="content-title-extra">
          <div class="extra-info" style="margin-bottom: 20px">
            <el-row style="width: 100%">
              <el-col :span="6">
                <div class="field-content">
                  <div>组织维度: <span class="text-info">{{currentDataset.orgDimension}}</span></div>
<!--                  <div class="text-info">{{currentDataset.orgDimension}}</div>-->
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>时间范围:<span class="text-info">{{currentDataset.timeRange}}</span></div>
<!--                  <div class="text-info">{{currentDataset.timeRange}}</div>-->
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>创建人:<span class="text-info">{{currentDataset.creator}}</span></div>
<!--                  <div class="text-info">{{currentDataset.creator }}</div>-->
                </div>
              </el-col>
              <el-col :span="6">
                <div class="field-content">
                  <div>创建时间:<span class="text-info">{{currentDataset.createTime}}</span></div>
<!--                  <div class="text-info">{{currentDataset.createTime}}</div>-->
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="extra-info">
            <el-row style="width: 100%">
              <el-col :span="6">
                <div>
                  <div>数据集类型:<span class="text-info">{{currentDataset.type ? '公开数据集' :'未公开数据集'}}</span></div>
<!--                  <div class="text-info">{{currentDataset.type ? '公开数据集' :'未公开数据集'}}</div>-->
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <div>最近更新时间:<span class="text-info">{{currentDataset.updateTime}}</span></div>
<!--                  <div class="text-info">{{currentDataset.updateTime}}</div>-->
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <div>到期时间: <span class="text-info">{{currentDataset.deadline}}</span></div>
<!--                  <div class="text-info">{{currentDataset.deadline}}</div>-->
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
       <FieldDataResources :currentDatasetDetail="currentDataset"  :datasetId="datasetId" :pageType="pageType"></FieldDataResources>
    </div>
   </div>
  </div>
  <DataExplorationModal v-if="showDataExplorationModal" @close="showDataExplorationModal = false" />
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import DataExplorationModal from '../components/DataExplorationModal.vue'
import { useDatasetStore } from '@/store/modules/datasetStore'
import {getDatasetDetail} from '@/api/dataset.ts'
import CoreObject from "~/views/data-sandbox/components/CoreObject.vue";
import FieldDataResources from "~/views/data-sandbox/components/FieldDataResources.vue";
const route = useRoute()
const isLoading = ref(false)
const currentDataset = ref({
  name:"",
  datasetsId:'',
  orgDimension:'',
  deadline:'',
  createTime:'',
  updateTime:'',
  type:1,
  creator:'',
  timeRange:'',
})
const datasetId = computed(() => {
  return route.query.datasetId as string
})
const pageType = computed(() => {
  return route.query.pageType as string
})
const datasetStore = useDatasetStore()
const businessId = ref('')
// Todo 通过切换数据集详情获取业务对象ID
const showDataExplorationModal = ref(false)
const handleView = () => {
  showDataExplorationModal.value = true
}

const checkTagList = ref([])
// 获取数据集详情
const getDetailData = ()=>{
  isLoading.value = true
  getDatasetDetail({id:datasetId.value}).then(res => {
    if(res.success){
      currentDataset.value = res.data
      checkTagList.value = res.data.ldmList
      if(res.data.ldmList.length > 0){
        datasetStore.clickCoreObject(res.data.ldmList[0].id)
      }
    }else{
      ElMessage.error(res.message)
      currentDataset.value = {
        name:"",
        datasetsId:'',
        orgDimension:'',
        deadline:'',
        createTime:'',
        updateTime:'',
        type:1,
        creator:'',
        timeRange:'',
      }
    }
  }).finally(()=>{
    isLoading.value = false
  })

}

onMounted(()=>{
  getDetailData()
})
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
.detail-config{
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
      width: 90%;

      .data-title {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
      }

      .content-title-extra {
        padding-left: 10px;
        .extra-info{
          display: flex;

        }
        .text-info {
          display: inline-block;
          margin-left: 5px;
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
</style>
