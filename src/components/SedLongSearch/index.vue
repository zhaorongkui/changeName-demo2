<!--
* @description:长输入框，单个带icon输入框，回车搜索，点击icon搜索，离焦不搜索；
* @fileName index.vue
* @author zhangshufeng
* @date 2024/06/06 15:32:31
* @filePath src\components\SedLongSearch\index.vue
!-->
<template>
  <div>
    <el-input
        v-model="inputValue"
        class="searchInput"
        :placeholder="placeholder"
        clearable
        @keyup.enter="handleSearch"
        @change="handleSearch"
    >
      <template #suffix>
        <el-icon class="pointer" @click="handleSearch">
          <Search />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import _ from 'lodash';

const { placeholder } = defineProps({
  placeholder: {
    //搜索框的提示语
    type: String,
    default: '请输入',
  },
});
const inputValue = defineModel<string>();
const emit = defineEmits(['OnSearch']);

const handleSearchChange = _.debounce(() => {
  emit('OnSearch');
}, 300);
const handleSearch = () => {
  handleSearchChange();
};
</script>
<style lang="scss" scoped></style>
