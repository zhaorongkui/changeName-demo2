<template>
  <div class="notes-content">
    <div class="notes_title">模型描述</div>
    <div>{{currentDetail.notes}}</div>
  </div>
  <div>
    <div  class="notes_title">使用说明</div>
    <div>{{currentDetail.instructions}}</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  currentDetail:{
    type: Object,
    default: {}
  }
})

</script>
<style lang="scss" scoped>
.notes-content{
  margin-bottom: 20px;
}
.notes_title{
  font-weight: bold;
}
</style>
