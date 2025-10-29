<template>
  <!--  数据规则模型试用-右侧变量树-->
  <div class="tree-container">
    <el-input v-model="searchText" placeholder="搜索变量" clearable class="search-input"  @input="onQueryChanged"/>
    <div class="tree-wrapper"  v-loading="loading">
      <el-tree-v2
          ref="treeWrapper"
          :data="treeData"
          :default-expand-all="true"
          :props="defaultProps"
          :default-expanded-keys="expandedKeys"
          :height="treeHeight"
          highlight-current
          @node-click="handleNodeClick"
          :filter-method="filterMethod"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getObjectField } from '@/api/modelManage'
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'
const emits =defineEmits(['nodeClick'])
const expandedKeys = ref([])
const treeHeight = ref(300); // 或动态计算
// 树形控件的属性配置
const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
}
const treeWrapper = ref()
const searchText = ref('')
const treeData = ref([])
const pageNum = ref(1)
const loading = ref(false)
const getTreeData = ()=> {
  loading.value = true
  getObjectField({
    // pageNum:pageNum.value,
    // pageSize: 20
  }).then(res => {
    if(res.success){
      expandedKeys.value =[]
      treeData.value = res.data.records
      if(treeData.value.length > 0){
        expandedKeys.value = getFullPath(treeData.value)
        console.log(expandedKeys.value,'value====')
      }
    }else{
      ElMessage.error(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
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
  console.log(query,'query',node,'node===')
  return node.name!.includes(query)
}
const handleNodeClick = (data)=> {
  emits('nodeClick',data)
}
const updateHeight = () => {
  const inputHeight = 40; // 输入框高度
  treeHeight.value = window.innerHeight - inputHeight - 260; // 额外边距
};
onMounted(async () => {
  await getTreeData();
  updateHeight();
  window.addEventListener('resize', updateHeight);

  // // 确保树组件更新
  // await nextTick();
  // treeWrapper.value?.updateHeight();
});
</script>

<style scoped lang="scss">
.tree-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  min-height: 0;
}
.tree-wrapper {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>

