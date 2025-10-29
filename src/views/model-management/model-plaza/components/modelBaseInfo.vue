<template>
  <div class="content-title-extra">
    <div class="extra-info" style="margin-bottom: 20px">
      <el-row style="width: 100%">
        <el-col :span="6">
          <div class="field-content">
            <div>模型类型: <span class="text-info">{{ modelType }}</span></div>
            <!--                  <div class="text-info">{{currentDataset.orgDimension}}</div>-->
          </div>
        </el-col>
        <el-col :span="6" v-if="currentDetailsData.modelType == '1'">
          <div class="field-content">
            <div>编程语言:<span class="text-info">{{ currentDetailsData.developLanguage }}</span></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="field-content">
            <div style="display: flex;align-items: center">模型场景:<span class="text-info applic-text" :title="currentDetailsData.applicableScenarioStr ">{{ currentDetailsData.applicableScenarioStr }}</span></div>
            <!--                  <div class="text-info">{{currentDataset.creator }}</div>-->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="field-content">
            <div>版本号:<span class="text-info">{{ currentDetailsData.version }}</span></div>
            <!--                  <div class="text-info">{{currentDataset.createTime}}</div>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="extra-info">
      <el-row style="width: 100%">
        <el-col :span="6">
          <div>
            <div>发布人:<span class="text-info">{{ currentDetailsData.owner }}<span
                  v-if="currentDetailsData.owner && currentDetailsData.creator">/</span> {{ currentDetailsData.creator
                }}</span></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>发布时间:<span class="text-info">{{ ['reviewDetail', 'review'].includes(props.pageType) ? currentDetailsData.publishTime : currentDetailsData.updateTime  }}</span></div>
            <!--<div class="text-info">{{currentDataset.updateTime}}</div>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tag-item">
      <TagDetails v-for="(newItem, index) in currentDetailsData.tagList" :key="index"
        background="linear-gradient(rgba(20, 118, 255, 0.6) 2%, rgb(229, 242, 233) 100%)"
        color="rgba(20, 118, 255, 0.6)" :name="newItem.tagName" :img="newItem.imgUrl" />
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Vditor from 'vditor'
import 'vditor/dist/index.css';
import '@/assets/css/client.css'
import { disabledBeforeOptions } from '@/utils/date'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ElMessage } from "element-plus";
import TagDetails from "~/components/TagData/index.vue";
import {formatDate} from '@/utils/date'
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  pageType: {
    type: String,
    default: ''
  },
  modelId: {
    type: String,
    default: ''
  },
  currentDetail: {
    type: Object,
    default: {}
  },

});
const emit = defineEmits(["updataData", "getDate"]);
const currentDetailsData = ref<any>({})

//模型类型
const modelType = ref('')

const handleDateChange = (e) => {
  // console.log(formatDate(new Date(e), "YYYY-MM-DD HH:mm:ss") )
  let timeStr = formatDate(new Date(e), "YYYY-MM-DD HH:mm:ss");
  emit('getDate', timeStr);
}
/**
 *  模型类型展示
 */
const getModelType = (type: string | number) => {
  switch (type) {
    case '1':
      modelType.value = '机器学习模型'
      break
    case '2':
      modelType.value = '智能体模型'
      break
    case '3':
      modelType.value = '数据规则模型'
      break
  }
}

watch(() => props.currentDetail, (val) => {
  currentDetailsData.value = val
  getModelType(currentDetailsData.value.modelType)
}, {
  deep: true
})

</script>
<style lang="postcss" scoped>
.content-title-extra {
  padding-left: 10px;

  .extra-info {
    display: flex;

  }

  .text-info {
    display: inline-block;
    margin-left: 5px;
  }
  .applic-text{
    display: inline-block;
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

  }
}

.tag-item {
  margin-top: 10px;
}
</style>
