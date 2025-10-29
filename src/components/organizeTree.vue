<!--
 * @Description: 树形组织树
-->
<template>
  <div class="treeMain">
    <el-input
        v-model="filterText"
        :style="{ 'margin-top': inputTop + 'px' }"
        :placeholder="placeholder"
        clearable
        @clear="onSearch"
    >
      <template #suffix>
        <el-icon @click="onSearch">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <div ref="soltRef">
      <slot name="header" />
    </div>
    <div class="scrollView" :style="`top:${topViewHeight}px;bottom:${scrollViewBottom}px`">
      <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :node-key="nodeKey"
          :show-checkbox="isShowCheckBox"
          :check-strictly="checkStrictly"
          :default-expand-all="isExpandAll"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :expand-on-click-node="isExpandOnClickNode"
          :highlight-current="true"
          :draggable="draggable"
          @check-change="handleNodeCheckChange"
          @node-click="handleClickNode"
      >
        <template #default="{ node }">
          <el-tooltip
              v-if="node.label && node.label.length > 20"
              popper-class="el-tooltip__popper"
              effect="dark"
              :show-after="TOOLTIP_SHOW_AFTER"
              :content="node.label"
              placement="top-start"
          >
            <p class="tree-item" style="margin-right: 30px; width: auto">
              {{ node.label }}
            </p>
          </el-tooltip>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted,ref,reactive,watch,onMounted,nextTick} from 'vue'
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import * as buses from '@/utils/bus';
import { Search } from '@element-plus/icons-vue';
import { ElTree } from 'element-plus';
import { Tree } from '~/types/org';

const emit = defineEmits(['changeNode']);
const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();
const { placeholder, titleName, defaultExpandedKeys, filterNode, inputTop } = defineProps({
  placeholder: {
    //搜索框的提示语
    type: String,
    default: '搜索组织名称',
  },
  titleName: {
    //树形机构的名称
    type: String,
    default: '',
  },
  isShowCheckBox: {
    //是否显示复选框，默认不显示
    type: Boolean,
    default: false,
  },
  checkStrictly: {
    //是否父子不互相关联,默认关联
    type: Boolean,
    default: false,
  },
  isExpandAll: {
    //是否展开全部节点
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  currentNodeKey: {
    type: String || Number,
    default: '',
  },
  // 父组件可给子组件传入方法,在子组件中调用该方法，父组件的该方法就会执行
  getTreeDataApi: {
    type: Function,
    default: () => {},
  },
  nodeKey: {
    type: String,
    default: 'id',
  },
  defaultExpandedKeys: {
    type: Array,
    default: () => [],
  },
  defaultCheckedKeys: {
    type: Array,
    default: () => [],
  },
  isExpandOnClickNode: {
    type: Boolean,
    default: true,
  },
  handlechangeNode: {
    type: Function,
    default: (data: Tree, checked: boolean) => {
      console.log(data, checked);
    },
  },
  // 根据实际数据的属性名，定义树形结构的属性名
  // 默认值为{label: 'label', children: 'children'}
  defaultProps: {
    type: Object,
    default: () => {
      return { label: 'label', children: 'children' };
    },
  },
  data: {
    type: Array,
    default: () => [],
  },
  filterNode: {
    //树形结构的过滤方法，defaultProps中配置属性名，决定了return中data.属性名的书写，需要传入filterNode方法，在外部处理过滤方法
    type: Function,
    default: (value: string, data: Tree) => {
      if (!value) return true;
      return data.label.includes(value);
    },
  },
  inputTop: {
    type: Number,
    default: 16,
  },
  scrollViewBottom: {
    //scrollView 距离底部距离，scrollView top 和bottom均需要动态调整；
    type: Number,
    default: 10,
  },
});

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

function onSearch() {
  filterNode();
}
const soltRef = ref();

const topViewHeight = ref(65);

const setCurrentKey = (newValue: string | number) => {
  nextTick(() => {
    treeRef.value?.setCurrentKey(newValue);
  });
};
onMounted(() => {
  topViewHeight.value = inputTop + 45;
  if (soltRef.value) {
    topViewHeight.value = soltRef.value.offsetHeight + topViewHeight.value;
  }
  buses.bus.on(buses.AUTHORIZED_DATA_CHANGE, (busedata: any) => {
    // data是一个数组，需要循环处理树形结构
    busedata.forEach((item: Tree) => {
      item.checked = false;
      treeRef.value!.setChecked(item.id, false, false);
    });
  });
});
onUnmounted(() => {
  buses.bus.off(buses.AUTHORIZED_DATA_CHANGE);
});

const updateViewLayout = () => {
  nextTick(() => {
    if (soltRef.value) {
      topViewHeight.value = soltRef.value.offsetHeight + 65;
    }
  });
};

// 设置节点勾选状态
const setNodeCheckStatus = (item: Tree, checked: boolean, deep: boolean = true) => {
  treeRef.value!.setChecked(item.id, checked, deep);
};
// 获取选中的节点
const getCheckedNodesFn = (leafOnly: false, includeHalfChecked: false) => {
  return treeRef.value!.getCheckedNodes(leafOnly, includeHalfChecked);
};
// 处理节点check change
function handleNodeCheckChange(data: Tree, checked: boolean): void {
  data.indeterminate = checked;
  emit('changeNode', { data: data, checked: checked });
}
const handleClickNode = (data: Tree) => {
  if (titleName !== '可授权范围') {
    buses.bus.emit(buses.ORGANIZATION_TREE_NODE_CLICK, data);
  }
};
const init = () => {
  filterText.value = '';
};
defineExpose({
  setCurrentKey,
  setNodeCheckStatus,
  init,
  updateViewLayout,
  getCheckedNodesFn,
});
</script>

<style scoped lang="scss">
.treeMain {
  width: 100%;
  height: 100%;
  position: relative;
  .el-input {
    width: calc(100%);
    margin-top: 16px;
  }

  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    text-align: left;
  }
  .scrollView {
    position: absolute;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    scrollbar-width: none;
  }
}
</style>
