<template>
  <div class="org-select">
    <el-popover :visible="visible" trigger="click" placement="bottom-start" :width="popoverWidth">
      <div class="tree-container" v-click-outside="hidePopover">
        <!-- <el-input
          v-model="searchVal"
          placeholder="搜索组织"
          clearable
          @focus="handleSearchOrg"
          @keyup.enter="handleSearchOrg"
          @input="handleInputOrg"
          size="small"
        /> -->
        <!-- toDo 查询出现组织列表 -->
        <el-scrollbar style="max-height: 300px">
          <div class="tree-wrapper" v-if="!searchVal">
            <el-tree
              ref="orgTreeRef"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              highlight-current
              :default-expanded-keys="defaultNodeKeys"
              :expand-on-click-node="false"
              @node-click="onSelect"
            />
          </div>

          <template v-else>
            <el-empty v-if="searchList.length === 1" description="无匹配结果" />
            <template v-else>
              <div
                v-for="item in searchList"
                :key="(item.orgId as string)"
                class="page-filter-options-item"
                @click="onSelect(item)"
              >
                <p class="page-filter-options-item-one">
                  <span v-html="highlight(item.name, searchVal)"></span
                  ><el-tag
                    :type="item.orgType == 1 ? 'primary' : item.orgType == 2 ? 'success' : undefined"
                    size="small"
                    >{{ item.orgType == 1 ? '机构' : '部门' }}</el-tag
                  >
                </p>
                <p class="page-filter-options-item-two">{{ item.orgId }} | {{ item.ancestors?.join('-') || '-' }}</p>
              </div>
              <p class="page-filter-options-no">{{ t('NO_MORE_DATA') }}</p>
            </template>
          </template>
        </el-scrollbar>
      </div>
      <template #reference>
        <el-input
          v-model="echoLabel"
          placeholder="请选择组织"
          :disabled="disabled"
          readonly
          :suffix-icon="visible ? ArrowUp : ArrowDown"
          @click.self="showPopover"
          size="default"
        />
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps, defineEmits, onMounted, nextTick } from 'vue'
import type { Organization } from '@/types/common'
import { getOrgTree, getOrgTreeByName } from '@/api/common'
import { useI18n } from 'vue-i18n'
import { ClickOutside as vClickOutside } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
const { t } = useI18n()

// v-model 支持
const props = withDefaults(defineProps<{ modelValue?: string; simple?: boolean; disabled?: boolean }>(), {
  simple: true,
  disabled: false
})
const emit = defineEmits(['update:modelValue'])
// 是否简洁模式 （查询条件引入）
const isSimple = computed(() => props.simple)

const visible = ref(false)
const searchVal = ref('') // 搜索关键词
const echoLabel = ref('') // 回显内容
const selectedKey = ref('') // 选中节点 key
const defaultNodeKeys = ref<string[] | number[]>([]) // 默认展开节点 keys
const orgTreeRef = ref<InstanceType<typeof ElTree> | null>(null)
const treeData = ref<Organization[]>([
  {
    id: '1',
    name: '总公司',
    orgType: 1,
    children: [
      {
        id: '1-1',
        name: '技术部',
        orgType: 2,
        orgId: ''
      },
      {
        id: '1-2',
        name: '市场部',
        orgType: 2,
        children: [
          {
            id: '1-2-1',
            name: '市场一组',
            orgType: 2,
            orgId: ''
          },
          {
            id: '1-2-2',
            name: '市场二组',
            orgType: 2,
            orgId: ''
          }
        ],
        orgId: ''
      }
    ],
    orgId: ''
  }
])

const defaultProps = {
  children: 'children',
  label: 'name'
}

const searchList = ref<Organization[]>([]) // 当前页数据
const searchPageNo = ref(1) // 当前页码

function handleInputOrg() {
  setTimeout(() => {
    handleSearchOrg()
  }, 100)
}

const handleSearchOrg = async () => {
  searchPageNo.value = 1
  const { data } = await getOrgTreeByName({
    name: searchVal.value.trim()
  })
  // console.log(data);
  searchList.value = data
  searchList.value = searchList.value.slice((searchPageNo.value - 1) * 10, searchPageNo.value * 10)
  visible.value = true
}

function onSelect(node: Organization) {
  selectedKey.value = node.id
  echoLabel.value = node.name
  emit('update:modelValue', node.id)
  hidePopover()
}

function highlight(name: string, keyword: string) {
  if (!keyword) return name
  return name.replace(
    new RegExp(keyword, 'gi'),
    (match) => `<span style=\"color:#409EFF;font-weight:bold\">${match}</span>`
  )
}

const showPopover = () => {
  if (props.disabled) return
  visible.value = true
}
const hidePopover = () => {
  visible.value = false
  initSelectedNode(props.modelValue)
}

const initTreeData = async () => {
  const data = await getOrgTree()
  treeData.value = data
}

const initSelectedNode = (newVal) => {
  selectedKey.value = newVal
  const selectNode = orgTreeRef.value?.getNode(newVal)
  if (selectNode) {
    echoLabel.value = selectNode.label
    orgTreeRef.value?.setCurrentKey(newVal)
  } else {
    echoLabel.value = ''
    orgTreeRef.value?.setCurrentKey(undefined)
  }
}

// 监听 modelValue 变化，自动同步回显内容 echoLabel
watch(
  () => props.modelValue,
  async (val) => {
    if (!treeData.value.length) await initTreeData()
    initSelectedNode(val)
  },
  { immediate: true }
)
// 监听 visible 变化，弹出时初始化选中节点
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      // initSelectedNode(props.modelValue)
      //默认展开根节点
      const rootNode = treeData.value && treeData.value.length ? treeData.value[0] : null
      if (rootNode) {
        defaultNodeKeys.value = [rootNode.id]
      }
    }
  }
)

const popoverWidth = ref(0)
onMounted(() => {
  // initTreeData();
  nextTick(() => {
    const orgSelectElement = document.querySelector('.org-select') as HTMLElement | null
    popoverWidth.value = Math.max(orgSelectElement ? orgSelectElement.offsetWidth : 180, 240)
  })
})
</script>

<style lang="scss" scoped>
/* 可根据需要自定义样式 */
.page-filter-options {
  max-height: 60vh;
  overflow-y: auto;
  .page-filter-options-item {
    padding: 10px 0;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .page-filter-options-item-one {
    display: flex;
    align-items: center;
    span.el-tag {
      margin-left: 8px;
    }
    // justify-content: space-between;
  }
  .page-filter-options-item-two {
    margin-top: 4px;
    font-size: 14px;
    color: #999;
  }
  .page-filter-options-no {
    text-align: center;
    padding: 10px 0;
    color: #999;
  }
}
</style>
<style lang="scss" scoped>
.org-select {
  position: relative;
  width: 100%;
}

.tree-container {
  overflow-y: auto;
  .tree-wrapper {
    margin-top: 8px;
    min-height: 180px;
    max-height: 300px;
    overflow-y: auto;
  }
}
/* Element Plus 深度选择器样式 */
// :deep(.el-tree-node__content) {
//   height: 38px;
//   border-radius: 4px;
//   margin: 2px 0;
//   transition: all 0.3s;
//   border-left: 3px solid transparent;

//   &:hover {
//     background-color: #f5f7fa;
//   }
// }

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

.actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
