<template>
  <div class="business-object-list">
    <div class="search-form">
      <el-input class="search-input" placeholder="搜索业务实体" v-model="searchKeyword" clearable @clear="handleClear">
        <template #suffix>
          <el-icon class="pointer" @click="handleSearchInput"><Search /></el-icon>
        </template>
      </el-input>
      <el-button  @click="handleClear">重置</el-button>
    </div>
    <!-- 业务对象列表：用 el-scrollbar 包裹实现滚动（可选） -->
    <el-scrollbar max-height="65%">
      <div
          v-for="item in filteredList"
          :key="item.id"
          class="business-item"
          :class="{'active': item.id === currentObjectId}"
          @click="handleItemClick(item)"
      >
        <div class="item-header">{{ item.businessObject }}</div>
        <div class="item-meta">
          <span>{{ item.propertyCount}} 个字段 | {{ item.dataVolume }} 条记录</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed ,watch,nextTick} from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useDatasetStore } from '@/store/modules/datasetStore'
const datasetStore = useDatasetStore()
const props =defineProps({
  ldmList:{
    type: Array,
    default: () => []
  }
})
const currentObjectId = ref(1)
// 模拟的业务对象数据（实际可从接口获取）
const businessObjectList = ref([
  // { id: 1, businessObject: '销售订单', propertyCount: 12, dataVolume: 15342 },
  // { id: 2, businessObject: '客户信息', propertyCount: 8, dataVolume: 2451 },
  // { id: 3, businessObject: '产品目录', propertyCount: 6, dataVolume: 128 },
  // { id: 4, businessObject: '销售代表', propertyCount: 5, dataVolume: 45 },

])

// 搜索关键词
const searchKeyword = ref('')

// 根据搜索关键词过滤列表
const filteredList = computed(() => {
  if (!searchKeyword.value) return businessObjectList.value
  const keyword = searchKeyword.value.toLowerCase()
  return businessObjectList.value.filter(item =>
      item.businessObject.toLowerCase().includes(keyword)
  )
})

// 搜索业务对象
const handleSearchInput = () => {

}
// 重置
const handleClear = ()=>{
  searchKeyword.value = ''
}
// 列表项点击事件（示例：打印点击的对象信息，实际可跳转路由等）
const handleItemClick = (item) => {
  currentObjectId.value = item.id
  datasetStore.clickCoreObject(item.id)
}
watch(()=>props.ldmList, (val) => {
  nextTick(()=>{
    if(val && val.length>0){
      businessObjectList.value.push(...val)
      currentObjectId.value = val[0].id
    }
  })
},{
  deep:true,
  immediate:true
})
</script>

<style scoped lang="postcss">
.business-object-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  .search-form{
    display: flex;
    .search-input {
      margin-bottom: 16px;
      margin-right: 10px;
    }
  }

  .el-scrollbar {
    .active{
      background: #e8f1ff;
      border-radius: 4px;
    }
    .business-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-bottom: 5px;
      .item-header {
        font-size: 16px;
        margin-bottom: 4px;
        font-weight: bold;
      }
      .item-meta {
        font-size: 14px;
        color: #666;
      }
    }
    .business-item:hover {
      background-color: #e8f1ff;
    }
  }
}








</style>