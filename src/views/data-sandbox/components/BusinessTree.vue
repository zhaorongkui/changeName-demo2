<template>
  <div v-loading="isLoading" >
    <el-input
      v-model="searchKeyword"
      placeholder="请输入关键词搜索"
      clearable
      @input="handleTreeSearch"
      style="margin-bottom: 10px"
    />
    <div :class="{'tree-scroll-container': pageType}">
      <el-tree
        ref="catalogTreeRef"
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        :expand-on-click-node="false"
        node-key="id"
        :default-expanded-keys="['1']"
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="node-label">
              <!-- <el-icon v-if="!node.isLeaf" class="custom-tree-icon">
                <component :is="node.expanded ? FolderOpened : Folder" />
              </el-icon> -->
              {{ node.label }}
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineExpose, onMounted, nextTick} from 'vue'
import { ElTree } from 'element-plus'
import { BusinessTreeMockData, type BusinessTreeNode } from '../mockData'
import { getContentsTopicList } from '@/api/dataset.ts'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['node-click','getFirst'])
const isLoading = ref(false)
const treeData = ref<BusinessTreeNode[]>([])
const searchKeyword = ref('')
const catalogTreeRef = ref<InstanceType<typeof ElTree>>()
const props =defineProps({
  pageType:{
    type: String,
    default: null
  }
})
const defaultProps = {
  children: 'children',
  label: 'name'
}

const initTreeData = () => {
  isLoading.value = true
  getContentsTopicList({type:1}).then((res) => {
    if(res.success) {
      treeData.value = res.data
      console.log(treeData.value,'tree')
      emit('getFirst',treeData.value[0].id)
    }else{
      ElMessage.error(res.message)
      treeData.value = []
    }

  }).finally(() => {
    isLoading.value = false
  })
  // treeData.value = BusinessTreeMockData
}

const filterNode = (value: string, data: BusinessTreeNode) => {
  console.log(data,'data===')
  if (!value) return true
  return data.name.includes(value)
}

const handleTreeSearch = (val: string) => {
  // 可扩展
}

const onNodeClick = (data: BusinessTreeNode) => {
  emit('node-click', data)
}

watch(searchKeyword, (val) => {
  catalogTreeRef.value?.filter(val)
})
// 清除选中
const clearSelection = () => {
  catalogTreeRef.value?.setCurrentKey(null);
};
onMounted(() => {
  nextTick(()=>{
    initTreeData()
  })
})

defineExpose({
  treeData,
  catalogTreeRef,
  filterNode,
  handleTreeSearch,
  initTreeData,
  clearSelection
})
</script>

<style lang="scss" scoped>
/* 树形组件相关样式 */

.tree-scroll-container {
  overflow: auto;
  width: 100%;
  height: 400px;
  // 让树整体以内容宽度撑开
  :deep(.el-tree) {
    width: max-content;
  }

  // 每一行内容也以内容宽度撑开，且不换行
  :deep(.el-tree-node__content) {
    white-space: nowrap;
    width: max-content;
  }
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: max-content; // 让节点宽度按内容撑开
  padding: 4px 0;
}
.node-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  transition: color 0.3s;
}
.node-label:hover {
  color: #409eff;
}
.custom-tree-icon {
  margin-right: 8px;
  font-size: 16px;
  color: #409eff;
}
.node-count {
  font-size: 12px;
  color: #909399;
  margin-left: 5px;
  background-color: #f2f6fc;
  padding: 2px 6px;
  border-radius: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;

  .node-label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #606266;
    transition: color 0.3s;

    &:hover {
      color: #409eff;
    }

    .custom-tree-icon {
      margin-right: 8px;
      font-size: 16px;
      color: #409eff;
    }
  }

  .node-count {
    font-size: 12px;
    color: #909399;
    margin-left: 5px;
    background-color: #f2f6fc;
    padding: 2px 6px;
    border-radius: 10px;
  }
}

/* Element Plus 深度选择器样式 */
:deep(.el-tree-node__content) {
  // height: 38px;
  border-radius: 4px;
  margin: 2px 0;
  transition: all 0.3s;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #f5f7fa;
  }
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

:deep(.el-tree-node__expand-icon) {
  font-size: 16px;
  color: #606266;
  padding: 6px;
  transition: transform 0.3s ease, color 0.3s;

  &:hover {
    color: #409eff;
  }

  &.expanded {
    transform: rotate(90deg);
    color: #409eff;
  }

  &.is-leaf {
    color: transparent;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;

  &:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }

  &:focus-within {
    box-shadow: 0 0 0 1px #409eff inset;
  }
}
</style>
