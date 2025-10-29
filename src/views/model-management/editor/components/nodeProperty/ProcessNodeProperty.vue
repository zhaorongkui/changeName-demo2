<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-18 10:16:10
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-18 10:16:10
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\components\nodeProperty\ProcessNodeProperty.vue
 * @Description: 处理节点属性组件
-->
<template>
  <div class="process-node-property">
    <el-form :model="nodeProps" label-width="100px" size="small">
      <el-form-item label="处理类型">
        <el-select v-model="nodeProps.processType" placeholder="请选择处理类型" @change="handleChange">
          <el-option label="数据转换" value="transform"></el-option>
          <el-option label="数据清洗" value="clean"></el-option>
          <el-option label="特征工程" value="feature"></el-option>
        </el-select>
      </el-form-item>

      <!-- 数据转换配置 -->
      <template v-if="nodeProps.processType === 'transform'">
        <el-form-item label="转换方式">
          <el-select v-model="nodeProps.transformType" placeholder="请选择转换方式" @change="handleChange">
            <el-option label="类型转换" value="typeConvert"></el-option>
            <el-option label="日期格式化" value="dateFormat"></el-option>
            <el-option label="数据规范化" value="normalize"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转换配置">
          <el-input
            v-model="nodeProps.transformConfig"
            type="textarea"
            rows="3"
            placeholder="请输入转换配置"
            @change="handleChange"
          ></el-input>
        </el-form-item>
      </template>

      <!-- 数据清洗配置 -->
      <template v-if="nodeProps.processType === 'clean'">
        <el-form-item label="清洗方式">
          <el-select v-model="nodeProps.cleanType" placeholder="请选择清洗方式" @change="handleChange" multiple>
            <el-option label="缺失值处理" value="missingValue"></el-option>
            <el-option label="异常值处理" value="outlier"></el-option>
            <el-option label="去重处理" value="duplicate"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理策略">
          <el-input
            v-model="nodeProps.cleanStrategy"
            type="textarea"
            rows="3"
            placeholder="请输入处理策略"
            @change="handleChange"
          ></el-input>
        </el-form-item>
      </template>

      <!-- 特征工程配置 -->
      <template v-if="nodeProps.processType === 'feature'">
        <el-form-item label="特征方法">
          <el-select v-model="nodeProps.featureMethod" placeholder="请选择特征方法" @change="handleChange" multiple>
            <el-option label="特征选择" value="selection"></el-option>
            <el-option label="特征提取" value="extraction"></el-option>
            <el-option label="特征构造" value="construction"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标字段">
          <el-input v-model="nodeProps.targetField" placeholder="请输入目标字段" @change="handleChange"></el-input>
        </el-form-item>
      </template>
    </el-form>
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
  processType: props.data.processType || '',
  transformType: props.data.transformType || '',
  transformConfig: props.data.transformConfig || '',
  cleanType: props.data.cleanType || [],
  cleanStrategy: props.data.cleanStrategy || '',
  featureMethod: props.data.featureMethod || [],
  targetField: props.data.targetField || ''
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
.process-node-property {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
