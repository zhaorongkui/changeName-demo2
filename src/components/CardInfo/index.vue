<template>
    <div class="data-item ">
        <h3 class="item-title">{{ data.name }}</h3>
        <div class="item-info">
            <img class="inline-flex" :src="imgUrl" alt="">
            <span class="inline-flex">{{ data.updateUser || '-' }}</span>
            <Calendar class="inline-flex ml-[22px] mx-[10px] h-4 w-4"/>
            <span class="inline-flex">{{data.updateTime ? formatDate(new Date(data.updateTime), "YYYY-MM-DD HH:mm:ss") : '-' }}</span>
        </div>
        <div class="item-description truncate mt-5 w-full">{{ data.description || '-' }}</div>
    </div>
</template>
<script setup lang="ts">
import { PropType, computed } from "vue";
import { Calendar } from '@element-plus/icons-vue'
import {formatDate} from '@/utils/date'
import useImg from '@/assets/images/top_view/avatar.png'

interface DataItem {
    name: string,
    imgUrl: string,
    updateUser: string,
    updateTime: string,
    description: string,
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
    .data-item {
        @apply h-[176px] relative bg-white p-8 rounded-2xl inline-block mb-5 overflow-hidden cursor-pointer;
        color: #595959;
        border: 1px solid #f0f0f0;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .08);
        .item-title {
            @apply max-w-[90%] text-xl leading-[32px] font-bold truncate mb-4;
        }
        .item-info {
            @apply text-sm leading-[20px] h-[20px] w-full flex flex-row items-center;
            img {
                @apply w-4 h-4 rounded-[50%] mr-[5px];
            }
        }
        &:hover {
            background-image: linear-gradient(to bottom right, #fdfdfd 40%, #fcfdff 60%, #e1edff 95%);
        }
    }
</style>