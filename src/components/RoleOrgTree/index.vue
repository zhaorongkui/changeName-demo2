
<template>
  <div class="treeMain">
    <!-- <div v-if="titleName.length>0" class="view_title padding-10">{{ titleName }}</div> -->
    <el-input v-model="filterText" :placeholder="placeholder" clearable @clear="onSearch">
      <template #suffix>
        <el-icon @click="onSearch">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <div ref="soltRef">
      <slot name="header" />
    </div>
    <div class="scrollView" :style="`top:${topViewHeight}px`">
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
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @check-change="handleNodeCheckChange"
          @node-click="handleClickNode"
          @node-drag-end="handleDragEnd"
      >
        <template #default="{ node, data: nodeData }">
          <div
              class="tree-item"
              style="position: relative"
              @mouseenter="handleMouseEnter(nodeData)"
              @mouseleave="handleMouseLeave(nodeData)"
          >
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
            <p v-else class="tree-item">
              {{ node.label }}
            </p>
            <el-dropdown
                v-if="nodeData.isShowIcon"
                style="position: absolute; right: 5px; top: 4px"
                trigger="hover"
                popper-class="dropDownStyleTree"
                :hide-on-click="false"
                @command="handleCommand($event, nodeData)"
                @visible-change="handleDropdownVisibleChange($event, nodeData)"

            >
<!--              v-if="nodeData.isShowIcon"-->
<!--                <el-icon><MoreFilled /></el-icon>-->
              <svgBase :is-show-hover="true" icon-name="icon-color-gengduo" size="20"></svgBase>
              <template #dropdown>
                <el-dropdown-menu v-if="nodeData.roles">
                  <el-dropdown-item v-permission="`${permissionKey}update`" command="editGroup"
                  >编辑角色组</el-dropdown-item
                  >
                  <el-dropdown-item v-permission="`${permissionKey}delete`" command="deleteGroup"
                  >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
                <el-dropdown-menu v-else>
                  <div v-permission="`${permissionKey}update`">
                    <el-dropdown-item command="edit"> 编辑角色 </el-dropdown-item>
                  </div>
                  <div v-permission="`${permissionKey}create`">
                    <el-dropdown-item command="copy">复制创建角色</el-dropdown-item>
                  </div>
                  <el-dropdown-item
                      v-if="nodeData.status === 1"
                      v-permission="`${permissionKey}disable`"
                      command="disabled"
                  >停用</el-dropdown-item
                  >
                  <el-dropdown-item v-else v-permission="`${permissionKey}enable`" command="enabled"
                  >启用</el-dropdown-item
                  >
                  <div v-permission="`${permissionKey}delete`">
                    <el-dropdown-item command="deleteRole">删除</el-dropdown-item>
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,onUnmounted,nextTick,watch} from 'vue'
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import { ElTree, } from 'element-plus';
import { MoreFilled } from '@element-plus/icons-vue'
import * as buses from '@/utils/bus';
import { isBootstrap } from '@/utils/index';
import { enabledRoleApi, disabledRoleApi, deleteRoleApi } from '@/api/role';
import { ElMessage, ElMessageBox } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import type { AllowDropType } from 'element-plus/es/components/tree/src/tree.type';
import { Search } from '@element-plus/icons-vue';
import type { Tree, roleModel } from '@/types/org';
import svgBase from '@/components/SvgBase/index.vue'
const permissionKey = 'settings:role:';
const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();
const { placeholder, titleName, defaultExpandedKeys, filterNode, data } = defineProps({
  placeholder: {
    //搜索框的提示语
    type: String,
    default: '搜索组织名称',
  },
  titleName: {
    //树形机构的名称
    type: String,
    default: '组织机构',
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
      return {
        label: 'label',
        children: 'children',
      };
    },
  },
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  filterNode: {
    //树形结构的过滤方法，defaultProps中配置属性名，决定了return中data.属性名的书写，需要传入filterNode方法，在外部处理过滤方法
    type: Function,
    default: (value: string, data: Tree) => {
      if (!value) return true;
      return data.label.includes(value);
    },
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
const emit = defineEmits([
  'updateRoleGroup',
  'deleteRoleGroup',
  'editRole',
  'copyCreateRole',
  'updateRoleList',
  'moveRoleGroup',
]);
const setCurrentKey = (newValue: string | number) => {
  nextTick(() => {
    treeRef.value?.setCurrentKey(newValue);
  });
};
onMounted(() => {
  if (soltRef.value) {
    topViewHeight.value = soltRef.value.offsetHeight + 65;
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
// 处理节点check change
function handleNodeCheckChange(data: Tree, checked: boolean): void {
  data.indeterminate = checked;
  // handlechangeNode(data,checked)
  buses.bus.emit(buses.ORGANIZATION_TREE_DATA_CHANGE, {
    data: data,
    checked: checked,
  });
}
const handleClickNode = (data: Tree) => {
  if (titleName !== '可授权范围') {
    buses.bus.emit(buses.ORGANIZATION_TREE_NODE_CLICK, data);
  }
};
const init = () => {
  filterText.value = '';
};
const handleMouseEnter = (data: Tree) => {
  data.isShowIcon = true;
};
const handleMouseLeave = (data: Tree) => {
  if (!data.isShowDrop && data.isShowIcon) {
    data.isShowIcon = false;
  } else {
    data.isShowDrop = false;
  }
};
const handleDropdownVisibleChange = (visible, data) => {
  if (visible) {
    data.isShowDrop = true;
  } else {
    data.isShowDrop = false;
  }
};
const handleCommand = async (command, nodeData) => {
  switch (command) {
    case 'editGroup':
      // 编辑角色组
      emit('updateRoleGroup', nodeData);
      break;
    case 'deleteGroup':
      // 删除角色组
      emit('deleteRoleGroup', nodeData);
      break;
    case 'edit':
      // 编辑角色
      emit('editRole', nodeData);
      break;
    case 'copy':
      //   复制创建角色
      emit('copyCreateRole', nodeData);
      break;
    case 'disabled':
      // 停用
      changeRoleStatus(nodeData);
      break;
    case 'enabled':
      // 启用
      changeRoleStatus(nodeData);
      break;
    case 'deleteRole':
      //  删除角色
      deleteRole(nodeData);
      break;
  }
  // 隐藏下拉菜单 每次操作之后node 数据都需要更新
  nodeData.isShowIcon = false;
};

//停用2  启用 1
async function changeRoleStatus(currentRole: roleModel) {
  if (!isBootstrap() && currentRole!.source === 1) {
    ElMessage.warning('系统内置角色不能进行停用！');
    return;
  }
  if (currentRole.status === 1) {
    // 停用用户角色
    const result = await disabledRoleApi({ roleId: currentRole.id });
    if (result.success) {
      ElMessage.success('停用成功');
      setTimeout(() => {
        currentRole.status = 2;
      }, 100);
    }
  } else {
    // 启用用户角色
    const result = await enabledRoleApi({ roleId: currentRole.id });
    if (result.success) {
      ElMessage.success('启用成功');
      setTimeout(() => {
        currentRole.status = 1;
      }, 100);
    }
  }
}

//删除角色
async function deleteRole(currentRole: roleModel) {
  if (!isBootstrap() && currentRole!.source === 1) {
    ElMessage.warning('系统内置角色不能删除！');
    return;
  }
  ElMessageBox.confirm('是否删除当前角色？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await deleteRoleApi([currentRole.code]);
    if (result.success) {
      ElMessage.success('角色删除成功');
      emit('updateRoleList');
    }
  });
}

// 树拖拽 处理 ：移动调整角色组
// const handleDragStart = (node: Node, ev: DragEvents) => {
//   console.log('drag start', node)
// }
// const handleDragEnter = (
//   draggingNode: Node,
//   dropNode: Node,
//   ev: DragEvents
// ) => {
//   console.log('tree drag enter:', dropNode.label)
// }
// const handleDragLeave = (
//   draggingNode: Node,
//   dropNode: Node,
//   ev: DragEvents
// ) => {
//   console.log('tree drag leave:', dropNode.label)
// }
// const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
//   console.log('tree drag over:', dropNode.label)
// }
// 拖拽完后的处理
const handleDragEnd = (draggingNode: Node, dropNode: Node) => {
  emit('moveRoleGroup', draggingNode.data, dropNode.data);
};
// const handleDrop = (
//   draggingNode: Node,
//   dropNode: Node,
//   dropType: NodeDropType,
//   ev: DragEvents
// ) => {
//   console.log('tree drop:', dropNode.label, dropType)
// }
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (draggingNode.level === dropNode.level) {
    return type === 'prev' || type === 'next';
  } else {
    return false;
  }
};
// 判断哪些节点可以拖拽 ：只有角色组可以拖拽，角色不可
const allowDrag = (draggingNode: Node) => {
  return draggingNode.data.roles;
};
defineExpose({
  setCurrentKey,
  setNodeCheckStatus,
  init,
  updateViewLayout,
});
</script>
<script lang="ts">
export default {
  directives: {
    treeItemMouseLeave: {
      mounted(el, binding) {
        // 通过 MutationObserver 判断 鼠标是否在元素上
        const observer = new MutationObserver(() => {
          if (!el.matches(':hover')) {
            binding.value();
          }
        });
        observer.observe(el, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        el._observer = observer;
      },
      unmounted(el) {
        // 在组件卸载时，断开观察者
        if (el._observer) {
          el._observer.disconnect();
          delete el._observer;
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
@use '@/style/tree' as *;
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
    bottom: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    scrollbar-width: none;
  }
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

</style>
<style>
.dropDownStyleTree .el-dropdown-menu__item{
  text-align: start !important;
  height: 30px !important;
  align-items: start !important;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background: #e6edfa !important;
}
</style>
