<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-14 11:17:56
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-27 15:24:35
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\components\BusinessInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="business-info">
    <el-form label-width="120px" class="business-info-content">
      <el-form-item label="业务实体:" class="business-info-item">
        <span>{{ baseInfoObj.businessObject }}</span>
      </el-form-item>
      <el-form-item label="所属系统/单元:" class="business-info-item">
        <span>{{ baseInfoObj.businessObjectType }}</span>
      </el-form-item>
      <el-form-item label="对象层级:" class="business-info-item">
        <span>{{ baseInfoObj.objectHierarchy }}</span>
      </el-form-item>
      <el-form-item label="数据分类:" class="business-info-item">
        <span>{{ baseInfoObj.dataType }}</span>
      </el-form-item>
      <el-form-item label="数据更新频率:" class="business-info-item">
        <span>{{ baseInfoObj.dateDim }}</span>
      </el-form-item>
      <el-form-item label="业务应用场景:" class="business-info-item">
        <span>{{ baseInfoObj.businessScenarios }}</span>
      </el-form-item>
      <div v-if="$route.name === 'data-classification-detail'">
        <el-form-item label="逻辑数据模型:" class="business-info-item">
          <span  class="truncate-text" :title="getLabel(baseInfoObj.dataModelIds)" >{{getLabel(baseInfoObj.dataModelIds)  }}</span>
        </el-form-item>
        <el-form-item label="版本信息:" class="business-info-item">
          <span>{{ baseInfoObj.versionInfo }}</span>
        </el-form-item>
        <el-form-item label="状态:" class="business-info-item">
          <span>{{ baseInfoObj.status == 1 ? '启用' : '停用' }}</span>
        </el-form-item>
        <el-form-item label="访问权限" class="business-info-item">
          <span>{{ baseInfoObj.accessPermissions== 1 ? '受限' : '公开'}}</span>
        </el-form-item>
      </div>
      <el-form-item label="最近更新时间:" class="business-info-item">
        <span>{{ baseInfoObj.updateTime }}</span>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import type { BusinessObjectType } from '@/types/dataSandbox'
import { useDatasetStore } from '@/store/modules/datasetStore'
import { useRoute } from 'vue-router'
import { selectAilabLogicalDataModel } from '@/api/backStageManage'
const route = useRoute()
const datasetStore = useDatasetStore()

// 业务对象基本信息
const baseInfoObj = ref<BusinessObjectType>({} as BusinessObjectType)
const props = defineProps({
  currentDataset: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  businessId: {
    type: String,
    default: ''
  },
  pageType: {
    type: String,
    default: ''
  },
  currentDataCatalog: {
    type: Object,
    default: {}
  }
})
watch(() => props.currentDataset, (val) => {
  if (!props.pageType) {
    baseInfoObj.value = val.ldmList && val.ldmList.length > 0 ? val.ldmList[0] : {}
  }
}, {
  deep: true,
})
// 监听数据集详情当前业务实体变化
watch(() => datasetStore.currentCoreObjectID, (val) => {
  if (val || val == 0) {
    baseInfoObj.value = props.currentDataset.ldmList.find(item => item.id == val)
  }
})
const dataModelIdsList = ref([])
// 获取逻辑数据模型
const getselectAilabLogicalDataModel = () => {
  selectAilabLogicalDataModel().then(res => {
    if (res.success) {
      dataModelIdsList.value = res.data
    }
  })
}
const getLabel = (idString) => {
  if (!idString) return ''; // 处理空值情况

  // 将逗号分隔的字符串转为数组
  const ids = idString.split(',');

  // 过滤有效ID并获取对应的entity
  const entities = ids.map(id => {
    const foundItem = dataModelIdsList.value.find(item => item.id == id.trim());
    return foundItem?.entity || '';
  }).filter(entity => entity); // 过滤掉空值

  // 用逗号连接非空的entity
  return entities.join(', ');
};
onMounted(() => {
  getselectAilabLogicalDataModel()
  nextTick(() => {
    if (props.currentDataCatalog && Object.keys(props.currentDataCatalog).length > 0) {
      baseInfoObj.value = props.currentDataCatalog
      console.log(baseInfoObj.value, 'valueee')
    }
  })

  // initInfo(props.businessId)
})
</script>
<style lang="scss" scoped>
.business-info-content {
  :deep(.el-descriptions__label) {
    text-align: right;
  }

  .business-info-item {
    margin-bottom: 4px;
  }
}
.truncate-text{
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
