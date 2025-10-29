<template>
<!--  模型评价-->
  <div class="container">
    <div class="rating">
      <div>
        <div class="notes_title">评分</div>
        <div class="score_title">{{currentDetail.avgScore}}</div>
        <div class="rater_title">{{currentDetail.evaluateCount}}人评分</div>
      </div>
        <div class="feature_content feature_box" >
          <div v-for="(item,index) in currentDetail.evaluateContents" :key="index" class="feature_item active" >
            {{item}}
          </div>
        </div>
      <div>
        <el-button @click="handleEvaluate" type="primary" v-if="square">评价</el-button>
      </div>
    </div>
    <div style="margin-top: 20px" >
      <div class="notes_title">模型评价（{{currentDetail.evaluateDetailVOList ? currentDetail.evaluateDetailVOList.length : 0}}）</div>
      <el-divider border-style="dashed" />
  <!--    模型评价详细信息-->
      <div class="evaluate-content" v-for="item in currentDetail.evaluateDetailVOList" :key="item.id">
        <div class="item-content">
        <div class="rater_content">
          <div>{{item.creator}}</div>
          <div>{{item.createTime}}</div>
          <div>{{item.version}}</div>
          <div>{{item.score}}</div>
        </div>
        <div style="flex: 1">
          <div class="feature_content feature_main">
            <div v-for="(it,index) in item.flavours" :key="index" class="feature_item active" >
              {{it}}
            </div>
          </div>
        </div>
        </div>
<!--        <div style="margin-bottom: 20px">-->
<!--          {{item.notes}}-->
<!--        </div>-->
        <el-divider border-style="dashed" />

      </div>

    </div>
  </div>
  <scoureDialog v-if="isShowScoure" :currentDetail="currentDetail" @close="handleCloseScoure"></scoureDialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import scoureDialog from './scoreDialog.vue'
const isShowScoure = ref(false)
const emits =defineEmits(['close'])
const props = defineProps({
  currentDetail:{
    type: Object,
    default: {}
  },
  square:{
    type: String,
    default: ''
  }
})

const ratingData = ref([
  {
    id:1,
    operator:'张泉灵1',
    time:'2025-05-09',
    fraction:'8.9',
    notes:'这个模型不错'
  },


])
const handleEvaluate = ()=> {
  isShowScoure.value = true
}
const handleCloseScoure = () =>{
  isShowScoure.value = false
  emits('close')
}
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  overflow: auto;
  padding-right: 10px;
}
.rating{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .score_title{
    font-size: 26px;
    font-weight: bold;
    color:#F49105 ;
  }
  .rater_title{
    font-size: 12px;
    color:#979797 ;
  }
}
.notes_title{
  font-weight: bold;
}
.rater_content{
  display: flex;
  width: 50%;
  justify-content: space-between;
  margin-bottom: 20px;
}
.feature_content{
  display: flex;
  flex-wrap: wrap;
  margin: 0 20px;
  .feature_item{
    background: #f7f7f7;
    padding: 5px 20px;
    border-radius:10px;
    cursor: pointer;
    margin: 10px;
    margin-top: 0 !important;
  }
  .active{
    color: #fff !important;
    background: #2669F7 !important;
  }
}
.evaluate-content{
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  .item-content{
    display: flex;
    .rater_content{
      width: 25%;
    }

    .feature_main{
      width: 100%;
      display: flex !important;
    }
  }
}
.feature_box{
  width: 80%;
}
</style>
