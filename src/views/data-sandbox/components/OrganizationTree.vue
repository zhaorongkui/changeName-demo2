<template>
  <div>

    <div class="tree-wrapper"  v-loading="isLoading">
      <el-input
          v-model="searchKeyword"
          placeholder="请输入关键词搜索"
          clearable
          @input="onQueryChanged"
          style="margin-bottom: 10px"
      />
      <el-tree-v2
          ref="treeWrapper"
          :data="treeData"
          :props="defaultProps"
          :default-expanded-keys="expandedKeys"
          :height="treeHeight"
          highlight-current
          @node-click="onNodeClick"
          :filter-method="filterMethod"
      />
    </div>
<!--    <el-tree-->
<!--      ref="catalogTreeRef"-->
<!--      :data="treeData"-->
<!--      :props="defaultProps"-->
<!--      :highlight-current="true"-->
<!--      :expand-on-click-node="false"-->
<!--      node-key="orgId"-->
<!--      :default-expanded-keys="['1']"-->
<!--      :filter-node-method="filterNode"-->
<!--      @node-click="onNodeClick"-->
<!--    >-->
<!--      <template #default="{ node, data }">-->
<!--        <span class="custom-tree-node">-->
<!--          <span class="node-label">-->
<!--           -->
<!--            {{ data.name }}-->
<!--          </span>-->
<!--        </span>-->
<!--      </template>-->
<!--    </el-tree>-->
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineExpose, onMounted, nextTick} from 'vue'
import { Folder, FolderOpened } from '@element-plus/icons-vue'
import {ElAutoResizer, ElTree} from 'element-plus'
import { OrgTreeMockData, type OrgTreeNode } from '../mockData'
import { getOrgTree, updateIotStatusById } from '@/api/org';
import type {TreeNode} from "element-plus/es/components/tree-v2/src/types";
import type {Organization} from "~/types/org";
import {treeToArray} from "~/utils/array_func";
const treeHeight = ref(300); // 或动态计算
const emit = defineEmits(['node-click'])
const treeWrapper = ref()
const treeData = ref<OrgTreeNode[]>([])
const searchKeyword = ref('')
const catalogTreeRef = ref<InstanceType<typeof ElTree>>()
const expandedKeys = ref([])
const isLoading = ref(false)
// 获取左侧组织树
const initTreeData = async () => {
  treeData.value = [];
  const newTreeData = localStorage.getItem('selectListFactory')
      ? JSON.parse(localStorage.getItem('selectListFactory') as string)
      : [];
  recursionTree(newTreeData, treeData.value);
  if (treeData.value.length > 0) {
    treeWrapper.value.setCurrentKey(treeData.value[0].orgId);
  }
};
const recursionTree = (oldArr, newArr) => {
  oldArr.forEach((item) => {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.children = [];
    if (item.children && item.children.length === 1 && !item.children[0].name) {
      item.children = [];
    }
    if (item.children && Array.isArray(item.children)) {
      recursionTree(item.children, newItem.children);
    }
    newArr.push(newItem);
  });
};
const initTreeDatadd = () => {
  isLoading.value = true
  getOrgTree({
    isLogin: '2',
  })
      .then((res) => {
        if (res.success) {
          expandedKeys.value =[]
          treeData.value = res.data
          const resultList = Object.keys(res.data)?.length ? data : [];
          if (queryData.value.orgStatus) {
            const arr: Organization[] = [];
            treeToArray(resultList, arr);
            treeData.value = arr.filter((item: Organization) => {
              delete item.children;
              if (queryData.value.orgStatus === '1') {
                return item.iotStatus === 1;
              } else {
                return item.iotStatus === 0;
              }
            });
          } else {
            treeData.value = resultList;
          }
          if(treeData.value.length > 0){
            expandedKeys.value = getFullPath(treeData.value)
          }
        }

      })
      .finally(() => {
        isLoading.value = false
      })
}
const defaultProps = {
  value:'orgId',
  children: 'children',
  label: 'name'
}
// 获取第一个默认展开的id
const getFullPath = (data) => {
  if (!data || data.length === 0) return [];

  const result = [];

  // 第一层
  const level1 = data[0];
  result.push(level1.id);

  // 第二层
  if (level1.children && level1.children.length > 0) {
    const level2 = level1.children[0];
    result.push(level2.id);

    // 第三层
    if (level2.children && level2.children.length > 0) {
      const level3 = level2.children[0];
      result.push(level3.id);
    }
  }

  return result;
};
const onQueryChanged = (query: string) => {
  treeWrapper.value!.filter(query)
}
// 筛选
const filterMethod = (query: string, node: TreeNode) => {
  return node.name!.includes(query)
}
const updateHeight = () => {
  const inputHeight = 40; // 输入框高度
  treeHeight.value = window.innerHeight - inputHeight - 260; // 额外边距
};


const onNodeClick = (data: OrgTreeNode) => {
  emit('node-click', data)
}

onMounted(async () => {
  await initTreeData();
  updateHeight();
  window.addEventListener('resize', updateHeight);


});
defineExpose({
  treeData,
  catalogTreeRef,
  initTreeData
})
</script>

<style lang="scss" scoped>
/* 树形组件相关样式 */

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
