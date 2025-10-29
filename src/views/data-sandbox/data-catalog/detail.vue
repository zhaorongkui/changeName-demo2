
<template>
  <div class="detail-config">
    <div class="left-content">
      <div class="content-title">
        <h3>基本信息</h3>
      </div>
      <BusinessInfo :businessId="businessId" :isEdit="false" :currentDataCatalog="currentDataCatalog" pageType="catalog" />
    </div>
    <div class="right-content">
      <BusinessDetail sourceType="business" :datasetId="datasetId" :businessId="businessId" :currentDataCatalog="currentDataCatalog" pageType="catalog"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BusinessInfo from '../components/BusinessInfo.vue'
import BusinessDetail from '../components/BusinessDetail.vue'
import {computed, onMounted,ref} from 'vue'
import { getBusinessDetail } from '@/api/dataSet.ts'
import { useRoute } from 'vue-router'
import {ElMessage} from "element-plus";

const route = useRoute()
const businessId = computed(() => {
  return route.query.businessId as string
})
const datasetId = computed(() => {
  return route.query.datasetId as string
})
const currentDataCatalog = ref<any>({})

onMounted(()=>{
  if(route.query.currentDataCatalog){
    currentDataCatalog.value = JSON.parse(route.query.currentDataCatalog)
    console.log(currentDataCatalog.value,'currentDataCatalog====')
  }
})
</script>
