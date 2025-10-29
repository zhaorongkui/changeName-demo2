<template>
  <div class="">
    <div class="data-set-container">
      <div class="info-box cursor-pointer" v-for="(item, index) in  currentDetail.dataSetVOS" :key="index">
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
import {ref} from 'vue'
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
    font-size: 12px;
  }
}
.data-set-container{
  max-height: 65%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
