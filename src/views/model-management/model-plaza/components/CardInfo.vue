<template>
  <div class="data-card ">
      <div class="card-header">
        <h3 class="card-title">{{ data.modelName }}</h3>
        <div>
          <span style="display: inline-block;margin-right: 5px;font-size: 16px">{{data.modelType}}</span>
          <span  :class="data.deploymentStatus=='部署成功' ? 'tag': 'notTag'">{{data.deploymentStatus}}</span>
        </div>

      </div>
    <div class="card-body">
      <div class="description">{{ data.notes  }}</div>
    </div>

    <div class="card-footer">
      <span class="footer-text">{{data.owner}}/{{data.creator}}</span>
      <!--      <span class="footer-text">{{ data.timeRange || '-' }}</span>-->
      <span class="footer-text">试用次数: {{ data.trialCount || 0 }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType, computed } from "vue";
import { Download } from '@element-plus/icons-vue'
import {formatDate} from '@/utils/date'
import useImg from '@/assets/images/top_view/avatar.png'

interface DataItem {
  modelName: string,
  modelType: string,
  developLanguage: string,
  applicableScenario: string,
  owner: string,
  publicStatus: string,
  trialCount: string,
  imgUrl?:string
  deploymentStatus?:string,
  notes?:string
  creator?:string,
}
const props = defineProps({
  data: {
    type: Object as PropType<DataItem>
  },
});
const imgUrl = computed(() => {
  return props.data?.imgUrl || useImg
})

</script>
<style lang="postcss" scoped>
.data-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 100%;
  cursor: pointer;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag {
      font-size: 12px;
      color: #007bff;
      background-color: #e6f7ff;
      padding: 4px 8px;
      border-radius: 10px;
    }
    .notTag{
      font-size: 12px;
      color: #E8A700;
      background-color: #faf3e3;
      padding: 4px 8px;
      border-radius: 10px;
    }
  }

  .card-body {
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .info-text {
        font-size: 14px;
        color: #595959;
      }

      .icon {
        font-size: 16px;
        color: #007bff;
      }
    }

    .description {
      width: 90%;
      font-size: 14px;
      color: #595959;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5;
    }
    .card-field{
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin: 5px 0;
      .card-field-box{
        width: 25%;
      }
      .card-field-item{
        border-radius: 5px;
        padding: 8px;
        background: #f5f5f5;
        font-size: 14px;
        color: #595959;
        .card-field-time{
          font-size: 10px;

        }
        .card-field-item-value {
          font-size: 14px !important;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    border-top: 1px solid #e6e6e6;
    padding-top: 10px;

    .footer-text {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
}
</style>