<template>
  <el-drawer
      v-model="drawer"
      title="基本信息"
      size="29%"
      @close="cancelClick"
      :modal="false"
  >
    <el-descriptions title="" border :column="1" column-max-width="100px">
      <el-descriptions-item label="主键ID">{{detailInfo.id}}</el-descriptions-item>
      <el-descriptions-item label="名称">{{detailInfo.name}}</el-descriptions-item>
      <el-descriptions-item label="编码">{{detailInfo.code}}</el-descriptions-item>
      <el-descriptions-item label="创建组织编码">{{detailInfo.createOrgCode}}</el-descriptions-item>
      <el-descriptions-item label="分类">{{detailInfo.category}}</el-descriptions-item>
      <el-descriptions-item label="指标分类">{{detailInfo.metricCategory}}</el-descriptions-item>
      <el-descriptions-item label="数据来源">{{detailInfo.dataSource}}</el-descriptions-item>
      <el-descriptions-item label="时间维度">{{detailInfo.timeDimension}}</el-descriptions-item>
      <el-descriptions-item label="业务维度">{{detailInfo.businessDimension}}</el-descriptions-item>
      <el-descriptions-item label="数据类型">{{detailInfo.dataType}}</el-descriptions-item>
      <el-descriptions-item label="小数位">{{detailInfo.decimalPlaces}}</el-descriptions-item>
      <el-descriptions-item label="单位">{{detailInfo.unit}}</el-descriptions-item>
      <el-descriptions-item label="标准维度">{{detailInfo.standardDimension}}</el-descriptions-item>
      <el-descriptions-item label="计算公式">{{detailInfo.calculationFormula}}</el-descriptions-item>
      <el-descriptions-item label="关联业务库类型">{{detailInfo.relatedDbType}}</el-descriptions-item>
      <el-descriptions-item label="关联业务对应库">{{detailInfo.relatedDbName}}</el-descriptions-item>
      <el-descriptions-item label="关联业务对应表">{{detailInfo.relatedTableName}}</el-descriptions-item>
      <el-descriptions-item label="关联业务对应表字段">{{detailInfo.relatedTableField}}</el-descriptions-item>
      <el-descriptions-item label="关联doris对应库">{{detailInfo.dorisDbName}}</el-descriptions-item>
      <el-descriptions-item label="关联doris对应表字段">{{detailInfo.dorisTableColumn}}</el-descriptions-item>
      <el-descriptions-item label="查询SQL">{{detailInfo.selectSql}}</el-descriptions-item>
      <el-descriptions-item label="关联业务实体">{{detailInfo.businessEntities}}</el-descriptions-item>
      <el-descriptions-item label="创建人">{{detailInfo.createBy}}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{detailInfo.createTime}}</el-descriptions-item>

    </el-descriptions>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref ,onMounted} from 'vue'
import { getMetaDetail } from '@/api/backStageManage'
import { ElMessageBox } from 'element-plus'
const props = defineProps({
  currentMeta:{
    type: Object,
    default: {}
  }
})
const detailInfo = ref({
  id: '',
  name: '',
  code: '',
  createOrgCode: '',
  category: '',
  metricCategory: '',
  dataSource: '',
  timeDimension: '',
  businessDimension: '',
  dataType: '',
  decimalPlaces: '',
  unit: '',
  standardDimension: '',
  calculationFormula: '',
  relatedDbType: '',
  relatedDbName: '',
  relatedTableName: '',
  relatedTableField: '',
  dorisDbName: '',
  dorisTableColumn: '',
  selectSql: '',
  businessEntities: '',
  createBy: '',
  createTime: '',
  title: ''
})
const emits =defineEmits(['close'])
const drawer = ref(true)
const cancelClick = ()=>{
  emits('close')
}
onMounted(()=>{
  console.log(props.currentMeta,'ccc')
  getMetaDetail(props.currentMeta.id).then(res=>{
    if(res.success){
      detailInfo.value = res.data
    }
  })
})
</script>