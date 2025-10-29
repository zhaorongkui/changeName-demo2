<template>
  <div class="business-object-list">
    <div class="search-form">
      <el-input class="search-input" placeholder="搜索业务实体、数据分类" v-model="searchKeyword" clearable @clear="handleClear">
        <template #suffix>
          <el-icon class="pointer" @click="handleSearchInput">
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button @click="handleClear">重置</el-button>
    </div>
    <!-- 业务对象列表：用 el-scrollbar 包裹实现滚动（可选） max-height="95%"-->
    <el-scrollbar>
      <div v-for="item in filteredList" :key="item.id" class="business-item flex justify-between items-center space-x-4"
        :class="{ 'active': item.id === currentObjectId }" @click="handleItemClick(item)">
        <div>
          <div class="item-header">{{ item.businessObject }}-{{ item.dataType }}</div>
          <div class="item-meta">
            <span>{{ item.propertyCount }} 个字段 </span>
          </div>
        </div>
        <!-- <div class="checkedStyle" v-if="item.checked">
          已选择
        </div> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, inject } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useDatasetStore } from '@/store/modules/datasetStore'
const datasetStore = useDatasetStore()
const props = defineProps({
  ldmList: {
    type: Array,
    default: () => []
  },
})
defineEmits(['getDetail'])
const currentObjectId = ref(1)
const businessObjectList = inject('leftCoreData', ref([]));
const checkedList = inject('checked', ref([]));
watch(checkedList, (newVal) => {
  currentObjectId.value = newVal[0] && newVal[0].id
});
// 搜索关键词
const searchKeyword = ref('')

const filteredList = computed(() => {
  const originList = checkedList.value;
  const keyword = searchKeyword.value.trim().toLowerCase();

  // 关键词为空时，返回原始数组
  if (!keyword) {
    return originList;
  }

  return originList.filter(item => {
    // 分别检查两个字段是否包含关键词（都转小写避免大小写敏感）
    const matchesBusinessObject = item.businessObject
      ? item.businessObject.toLowerCase().includes(keyword)
      : false;

    const matchesDataType = item.dataType
      ? item.dataType.toLowerCase().includes(keyword)
      : false;

    // 只要有一个字段匹配就保留该条目
    return matchesBusinessObject || matchesDataType;
  });
});

// 搜索业务对象
const handleSearchInput = () => {

}
// 重置
const handleClear = () => {
  searchKeyword.value = ''
}
// 列表项点击事件（示例：打印点击的对象信息，实际可跳转路由等）
const handleItemClick = (item) => {
  currentObjectId.value = item.id
  datasetStore.clickCoreObject(item.id)
}
watch(() => props.ldmList, (val) => {
  nextTick(() => {
    if (val && val.length > 0) {
      businessObjectList.value.push(...val)
      currentObjectId.value = val[0].id
      datasetStore.clickCoreObject(currentObjectId.value)
    }
  })
}, {
  deep: true,
  immediate: true
})
defineExpose({
  currentObjectId
})
</script>

<style scoped lang="scss">
.business-object-list {
  width: 100%;
  display: flex;
  flex-direction: column;

  .search-form {
    display: flex;

    .search-input {
      margin-bottom: 16px;
      margin-right: 10px;
    }
  }

  .el-scrollbar {
    height: 450px;

    .el-scrollbar__wrap {
      height: 95%;
    }

    .active {
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

      .checkedStyle {
        padding: 3px 5px;
        background-color: #409EFF;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        border-radius: 3px;
      }
    }

    .business-item:hover {
      background-color: #e8f1ff;
    }
  }
}
</style>