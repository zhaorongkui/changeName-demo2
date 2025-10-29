<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-18 10:15:10
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-18 10:15:10
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\components\nodeProperty\InputNodeProperty.vue
 * @Description: 输入节点属性组件
-->
<template>
  <div class="input-node-property">
    <el-form :model="nodeProps" label-width="100px" size="small">
      <el-form-item label="数据来源">
        <el-select v-model="nodeProps.dataSource" placeholder="请选择数据来源" @change="handleChange">
          <el-option label="API" value="api"></el-option>
          <el-option label="数据库" value="database"></el-option>
          <el-option label="文件" value="file"></el-option>
        </el-select>
      </el-form-item>

      <!-- API来源配置 -->
      <template v-if="nodeProps.dataSource === 'api'">
        <el-form-item label="API地址">
          <el-input v-model="nodeProps.apiUrl" placeholder="请输入API地址" @change="handleChange"></el-input>
        </el-form-item>
        <el-form-item label="请求方法">
          <el-select v-model="nodeProps.apiMethod" placeholder="请选择请求方法" @change="handleChange">
            <el-option label="GET" value="get"></el-option>
            <el-option label="POST" value="post"></el-option>
            <el-option label="PUT" value="put"></el-option>
            <el-option label="DELETE" value="delete"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <!-- 数据库来源配置 -->
      <template v-if="nodeProps.dataSource === 'database'">
        <el-form-item label="数据库类型">
          <el-select v-model="nodeProps.dbType" placeholder="请选择数据库类型" @change="handleChange">
            <el-option label="MySQL" value="mysql"></el-option>
            <el-option label="PostgreSQL" value="postgresql"></el-option>
            <el-option label="SQL Server" value="sqlserver"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SQL语句">
          <el-input
            v-model="nodeProps.sqlQuery"
            type="textarea"
            rows="3"
            placeholder="请输入SQL语句"
            @change="handleChange"
          ></el-input>
        </el-form-item>
      </template>

      <!-- 文件来源配置 -->
      <template v-if="nodeProps.dataSource === 'file'">
        <el-form-item label="文件类型">
          <el-select v-model="nodeProps.fileType" placeholder="请选择文件类型" @change="handleChange">
            <el-option label="CSV" value="csv"></el-option>
            <el-option label="Excel" value="excel"></el-option>
            <el-option label="JSON" value="json"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径">
          <el-input v-model="nodeProps.filePath" placeholder="请输入文件路径" @change="handleChange"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const nodeProps = reactive({
  dataSource: props.data.dataSource || '',
  apiUrl: props.data.apiUrl || '',
  apiMethod: props.data.apiMethod || 'get',
  dbType: props.data.dbType || '',
  sqlQuery: props.data.sqlQuery || '',
  fileType: props.data.fileType || '',
  filePath: props.data.filePath || ''
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
.input-node-property {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
