<template>
  <el-drawer
      v-model="dialogVisible"
      :title="title"
      size="80%"
      :show-back-btn="true"
      @close="handleClose"
      :modal="false"
  >
    <div style="background-color: #fff;padding: 20px;height:85vh">
      <iframe
          src="http://10.195.6.251/chatbot/hbZL8aRkykeDnjVz"
          style="width: 100%; height: 100%; "
          frameborder="0"
          allow="microphone">
      </iframe>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
const dialogVisible = ref(true)
const props = defineProps({
  currentModelDetail: {
    type: Object,
    default: () => {}
  }
})
 const emits = defineEmits(['close'])
 const handleClose = ()=> {
   emits('close')
 }
 const title = ref('模型试用')
 onMounted(()=>{
   console.log(props.currentModelDetail,'dededded')
    if(props.currentModelDetail && Object.keys(props.currentModelDetail).length>0){
      title.value = `${props.currentModelDetail.modelName}模型试用`
      console.log(title.value,'ttt')
    }
 })
</script>
<style scoped>

</style>
