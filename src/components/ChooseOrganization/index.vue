<template>
  <div class="choose-org">
    <el-input v-model="searchContent" class="choose-org-search" placeholder="请输入" clearable @clear="handleSearch">
      <template #suffix>
        <el-icon class="pointer" @click="handleSearch"><Search /></el-icon>
      </template>
    </el-input>
    <el-tree
        ref="treeRef"
        style="max-width: 600px"
        node-key="orgId"
        highlight-current
        :data="tableData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandKeys"
        :current-node-key="checkedKeys"
        :filter-node-method="handleFilterNode"
        @node-click="handleCheck"
    >
      <template #default="{ node }">
        <p class="tree-item">
          <el-tooltip
              popper-class="el-tooltip__popper"
              effect="dark"
              :content="node.label"
              placement="top"
              :show-after="TOOLTIP_SHOW_AFTER"
          >
            {{ node.label }}
          </el-tooltip>
        </p>
      </template>
    </el-tree>
  </div>
</template>
<script setup lang="ts">
import { ref,computed,watch,nextTick,onMounted,} from 'vue'
import { Search } from '@element-plus/icons-vue';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import type { Organization } from '@/types/org';
const emit = defineEmits(['filterOrg']);

const defaultProps = {
  children: 'children',
  label: 'name',
};

const treeRef = ref();
const expandKeys = ref<string[]>([]);
const checkedKeys = ref<string>('');

// 初始化组织树
const tableData = ref<Organization[]>([]);
const initData = async () => {
  const data = localStorage.getItem('selectListFactory')
      ? JSON.parse(localStorage.getItem('selectListFactory') as string)
      : [];
  initTree(data);
};

defineExpose({
  initData,
});

// 搜索组织树
const searchContent = ref('');

watch(searchContent, (val) => {
  treeRef.value!.filter(val);
});
const handleSearch = () => {
  treeRef.value!.filter(searchContent.value);
};
const handleFilterNode = (value: string, data: Organization) => {
  if (!value) return true;
  return data.name.includes(value);
};

const initTree = (data: Organization[]) => {
  data.map((item: Organization) => {
    configTreeName(item);
  });
  tableData.value = Object.keys(data)?.length ? data : [];
  expandKeys.value = [tableData.value[0].orgId];
  checkedKeys.value = tableData.value[0].orgId;

  nextTick(() => {
    // handleCheckedChange();
    treeRef.value!.setCurrentKey(checkedKeys.value);
    handleCheck(tableData.value[0]);
  });
};
// 配置显示name
const configTreeName = (node: Organization) => {
  node.name = `${node.name}_${node.orgId}`;
  if (node.children && node.children.length > 0) {
    node.children.map((item: Organization) => {
      configTreeName(item);
    });
  }
};

// 获取选中的树节点
// const handleCheckedChange = _.debounce(() => {
//   const selectOrgs = treeRef.value!.getCheckedKeys();
//   emit('filterOrg', selectOrgs);
// }, 500)

const handleCheck = (data: Organization) => {
  emit('filterOrg', data.orgId);
};
</script>
<style lang="scss" scoped>
@use '@/style/tree';
.choose-org {
  &-search {
    margin: 8px 0;
  }
}
</style>
