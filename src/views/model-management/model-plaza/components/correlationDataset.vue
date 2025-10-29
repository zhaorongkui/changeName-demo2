<template>
  <div style="width: 100%">
    <h2  class="mb-6">关联数据集（{{currentDetail?.dataSetList?.length || 0}}）</h2>
    <div class="p-0 data-set-container">
      <div class="info-box " v-for="(item, index) in currentDetail.dataSetList" :key="index">
        <h3>{{ item.name }}</h3>
        <div class="item-info">
          <span class="inline-flex">
<!--            {{item.orgDimension}} <span v-if="item.orgDimension && item.creator">/</span>-->
            {{ item.creator  }}</span>
          <span class="inline-flex">{{ item.timeRange}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {formatDate} from "~/utils/date";
import {ref} from 'vue'
const dataSetList = ref([
  {
    "id": 130,
    "datasetsId": "dataset-2025-000039",
    "name": "名称超长的数据集名称超长的数据集名称超长的数据集名称超长的数据集名称超长的数据集",
    "updateTime": null,
    "updateUser": null,
    "timeRange": "2025/10/01-2025/10/15",
    "orgId": null,
    "orgDimension": "1202847",
    "dataVolume": null,
    "creator": "杭湖区域公司/张建忠",
    "ldmName": "细格栅-工单数据",
    "dataType": "工单数据"
  },
])
const props = defineProps({
  currentDetail:{
    type: Object,
    default: {}
  },
  pageType:{
    type: String,
    default: ''
  }
})
const list = ref([])
</script>
<style lang="postcss" scoped>
.info-box {
  padding: 20px 24px;
  margin: 10px 0;
  border-radius: 10px;
  width: 96%;
  box-shadow:0 0 6px 0 rgba(0, 0, 0, .38);
  h3{
    @apply mb-2 font-bold;
    color: #191919;
  }
  .item-info {
    @apply text-sm leading-[20px] h-[20px] w-full flex flex-row items-center;
    justify-content: space-between;
  }
}
.data-set-container{
  max-height: 92%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
