<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-15 14:36:33
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-15 14:59:06
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\dataset-management\components\CardInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="data-card">
    <div class="card-header">
      <h3 class="card-title">{{ data.name }}</h3>
      <span  :class="data.type ? 'tag': 'notTag'">{{data.type ? '公开' :'未公开'}}</span>
    </div>
    <div class="card-body">
      <div class="description">{{ data.description  }}</div>
<!--      <div class="description"></div>-->
      <div class="card-field">
        <div class="card-field-item card-field-box">
          <p>数据量</p>
          <p class="card-field-item-value">{{data.dataVolume}}</p>
        </div>
        <div class="card-field-item card-field-box">
          <p>字段数</p>
          <p class="card-field-item-value">{{data.fieldCount }}</p>
        </div>
        <div class="card-field-item">
          <p>时间范围</p>
          <p class="card-field-time">{{data.timeRange}}</p>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <span class="footer-text">{{data.creator}}</span>
<!--      <span class="footer-text">{{ data.timeRange || '-' }}</span>-->
      <span class="footer-text">使用次数: {{ data.downloadCount || 0 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

interface DataItem {
  name: string
  updateUser: string
  updateTime: string
  description: string
  factoryName: string
  timeRange: string
  downloadCount: number
  type: number
  orgDimension: string
  metadata:any
  creator?:string
  dataVolume?:number
  fieldCount?: number
}
const props = defineProps({
  data: {
    type: Object as PropType<DataItem>
  }
})
</script>

<style lang="scss" scoped>
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
