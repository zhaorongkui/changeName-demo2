<template>
  <div class="tag-target" v-for="(item, index) in tagListData" :key="index">
    <p class="tag-target-header" @click="item.show = !item.show">
      <span>{{ item.name }}</span>
      <ArrowUp v-show="item.show" class="icon" color="#191919;" />
      <ArrowDown v-show="!item.show" class="icon" color="#191919;" />
    </p>
    <div class="tag-target-body" :class="{ 'h-[34px]': !item.show }">
      <TagDetails
        v-for="(newItem, index) in item.data"
        :key="index"
        :background="item.background"
        :color="newItem.id === currentTagOjb.tagId ? '#fff' : item.color"
        :name="newItem.name"
        :img="newItem.img"
        class="cursor-pointer"
        :class="{ isActive: newItem.id === currentTagOjb.tagId }"
        @click="tagHeadle(newItem)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ArrowUp, ArrowDown, Search } from '@element-plus/icons-vue'
import CardInfo from '@/components/CardInfo/index.vue'
import TagDetails from '@/components/TagData/index.vue'
import { useRouter } from 'vue-router'
import { tagList } from '@/api/tag'

import { defineEmits } from 'vue'
const emit = defineEmits(['tag-click'])
// 选中的标签
const currentTagOjb = ref({
  tagTypeId: '',
  tagId: ''
})

// 获取标签列表
const tagListData = ref([])
const getTagList = () => {
  const newArr = []
  const colorList = [
    'rgba(20, 118, 255, 0.6)',
    'rgba(1, 128, 43, 0.6)',
    'rgba(159, 83, 230, 0.6)',
    'rgba(148, 10, 84, 0.6)',
    'rgba(114, 140, 10, 0.6)',
    'rgba(163, 135, 8, 0.6)',
    'rgba(230, 162, 60, 0.6)'
  ]
  tagList().then((res) => {
    const { data } = res
    data?.forEach((item) => {
      const findIndex = newArr.findIndex((newItem) => newItem.id === item.tagTypeId)
      if (findIndex > -1) {
        newArr[findIndex].data.push({
          name: item.tagName,
          id: item.id,
          tagTypeId: item.tagTypeId,
          img: item.imgUrl
        })
      } else {
        const color = colorList[newArr.length % colorList.length]
        newArr.push({
          background: `linear-gradient(${color} 2%, rgb(229, 242, 233) 100%)`,
          color: color,
          name: item.tagTypeName,
          id: item.tagTypeId,
          show: true,
          data: [
            {
              name: item.tagName,
              id: item.id,
              tagTypeId: item.tagTypeId,
              img: item.imgUrl
            }
          ]
        })
      }
    })
    tagListData.value = newArr
  })
}
getTagList()

const tagHeadle = (item) => {
  const tagHeadle = (item) => {
    if (currentTagOjb.value.tagId === item.id) {
      currentTagOjb.value.tagTypeId = ''
      currentTagOjb.value.tagId = ''
    } else {
      currentTagOjb.value.tagTypeId = item.tagTypeId
      currentTagOjb.value.tagId = item.id
    }
  }
  emit('tag-click', currentTagOjb.value)
}
</script>
