<template>
  <el-dialog v-model="dialogVisible" title="选择指标" width="40%" :show-back-btn="true" @close="handleClose">
    <div class="content" v-loading="loading">
      <div class="left-tree">
        <el-input class="filterBox" placeholder="输入指标进行过滤" v-model="filterText">
        </el-input>
        <el-tree ref="treeRef" :data="data" node-key="id" :props="defaultProps" :default-expanded-keys="expandedKeys"
          :filter-node-method="filterNode" :highlight-current="true">
          <template #default="{ node, data }">
            <span>
              <el-checkbox v-if="!node.childNodes || node.childNodes.length === 0" v-model="node.checked"
                @change="handleCheckChange(data, $event)" />
              {{ node.label }}
            </span>
          </template>
        </el-tree>
      </div>
      <div class="right-tags">
        <el-tag v-for="tag in tags" :key="tag.id" closable class="tag-item" @close="handleCloseTag(tag)">
          {{ tag.label }}
        </el-tag>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTableAndColumnTreeData } from '@/api/backStageManage'
import { ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
const props = defineProps<{
  targsListChecked: any[],
  treeParams: {
    tableSchema: string,
    tableNames: string[]
  }
}>()
interface Tree {
  id: number
  tableName: string
  columnName: string
  tableSchema: string
  columnComment: string
  childrenList?: Tree[]
}
const loading = ref(false)
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}
// 修正过滤方法的名称以匹配属性
const filterNode = (value: string, data: Tree) => {
  // console.log(value, data, 'filterNode===')
  if (!value) return true;
  // 不区分大小写的过滤
  return data.columnName.toLowerCase().includes(value.toLowerCase());
  // return data.label.indexOf(value) !== -1
};

watch(filterText, (val) => {
  // 确保treeRef已初始化
  if (treeRef.value) {
    treeRef.value.filter(val)
  }
});

const setCheckedNodes = () => {
  treeRef.value!.setCheckedNodes(
    [] as Node[],
    false
  )
}

const defaultProps = {
  children: 'childrenList',
  label: 'columnName',
}
const data = ref([] as Tree[])
data.value = []
const tags = ref([])
const dialogVisible = ref(true)
const emit = defineEmits(['close', 'success'])
const handleClose = (done: () => void) => {
  emit('close')
}
const submit = () => {
  if (tags.value.length == 0) {
    ElMessage.warning('请选择指标')
    return
  }
  emit('success', tags.value)
}
const handleCheckChange = (data, checked: boolean) => {
  console.log(data, checked, 'data===')
  const index = tags.value.findIndex(tag => tag.id === data.id)
  if (checked) {
    // 如果选中且不存在于tags中，则添加
    if (index === -1) {
      tags.value.push({
        id: data.id,
        label: data.columnName,
        item: data
      })
    }
  } else {
    // 如果取消选中且存在于tags中，则移除
    if (index !== -1) {
      tags.value.splice(index, 1)
    }
  }
}
const handleCloseTag = (tag) => {
  // console.log(tag, 'val===')
  const index = tags.value.findIndex(t => t.id === tag.id);
  if (index !== -1) {
    tags.value.splice(index, 1);
  }

  // 2. 在树中取消勾选对应的节点
  treeRef.value?.setChecked(tag.id, false);

  // 3. 可选：如果需要，可以手动更新节点的checked状态
  const node = treeRef.value?.getNode(tag.id);
  if (node) {
    node.checked = false;
  }
}

// 获取分类管理，新增-详情,指标树数据
const getTableAndColumnTreeDataFunc = () => {
  loading.value = true
  // let params = {
  //   tableSchema: "sed-tenant-weihai", //库名
  //   tableNames: [
  //     "act_app_appdef"
  //   ]
  // }
  getTableAndColumnTreeData(props.treeParams).then((res) => {
    console.log(res);
    if (res.success) {
      data.value = res.data
      data.value = res.data
      if (data.value.length > 0) {
        // 获取第一个节点的ID
        data.value.forEach((item, index) => {
          item.columnName = item.tableName
          item.id = index + 1 // 生成唯一ID
          item.childrenList && item.childrenList.forEach((child, childIndex) => {
            child.id = Number(`${index + 1}${childIndex}`) // 生成唯一ID
          })
        })
        const firstNodeId = data.value[0].id
        expandedKeys.value = [firstNodeId]
      }
      // 如果有传入已选中的指标，则设置为选中状态
      if (props.targsListChecked && props.targsListChecked.length > 0) {
        // 不能那直接改props.targsListChecked,只能赋值一个中间值，操作中间值midelTargsListChecked
        let midelTargsListChecked = props.targsListChecked
        // 编辑回显时，如果targsListChecked的id为空，则在data.value中根据columnName匹配id
        midelTargsListChecked.forEach(tag => {
          const matchedItem = data.value.flatMap(item => item.childrenList || []).find(child => child.columnName === tag.label)
          console.log(matchedItem, 'matchedItem===67676776')
          if (matchedItem) {
            tag.id = matchedItem.id
          }
        })
        // tags.value = props.targsListChecked
        tags.value = midelTargsListChecked
        console.log(tags.value, 'tags===888888', data.value)
        const idsToCheck = midelTargsListChecked.map(item => item.id)
        treeRef.value?.setCheckedKeys(idsToCheck, true)
      } else {
        tags.value = []
        treeRef.value?.setCheckedKeys([], false)
      }
    }
  }).finally(() => {
    loading.value = false
  })
}
const expandedKeys = ref<number[]>([])
onMounted(() => {
  getTableAndColumnTreeDataFunc()

})
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  padding: 20px;
  display: flex;
}

.left-tree {
  width: 40%;
  max-height: 40vh;
  overflow: scroll;
  border-right: 1px solid #ccdde9;
}

.right-tags {
  // display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding-left: 20px;

  .tag-item {
    margin: 5px;
  }
}

.filterBox {
  margin-bottom: 10px;
  width: 100%;
}
</style>