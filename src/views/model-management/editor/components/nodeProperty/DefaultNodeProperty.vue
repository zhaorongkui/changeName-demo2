<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-18 10:17:10
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-18 10:17:10
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\components\nodeProperty\DefaultNodeProperty.vue
 * @Description: 默认节点属性组件
-->
<template>
  <div class="default-node-property">
    <el-empty description="暂无特定属性配置" :image-size="100"></el-empty>
    <div class="mt-4">
      <el-form :model="nodeProps" label-width="100px" size="small">
        <el-form-item label="备注">
          <el-input
            v-model="nodeProps.remark"
            type="textarea"
            rows="3"
            placeholder="请输入节点备注"
            @change="handleChange"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const nodeProps = reactive({
  remark: props.data.remark || ''
})

// 初始化时将父组件传入的数据同步到本地
watch(
  () => props.data,
  (newVal) => {
    Object.keys(newVal).forEach((key) => {
      if (key in nodeProps) {
        nodeProps[key] = newVal[key]
      }
    })
  },
  { immediate: true, deep: true }
)

// 处理属性变更
const handleChange = () => {
  emit('update', { ...nodeProps })
}
</script>

<style lang="scss" scoped>
.default-node-property {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
