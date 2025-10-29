<!--
* @description :树形选择内容平铺图
* @fileName treeToList.vue
* @author zhangshufeng
* @date 2024/03/05 10:17:07
* @filePath src\components\treeToList.vue
!-->
<template>
  <div class="treeToList">
    <div class="titleView">
      <div style="padding: 10px;display: flex;justify-content: space-between">{{ titleName }}
        <el-button class="clearBtn" type="primary" text @click="clearData">清空</el-button>

      </div>
      <div class="descriptionView margin-left-right-10">
        <svg-base icon-name="icon-color-tishi-copy" size="20"></svg-base>
        <span style="margin-left: 10px">{{ description }}</span>
      </div>
    </div>
    <el-scrollbar>
      <template v-if="data.length > 0">
        <div v-for="item in data" :key="item.id" class="treeToListItem">
          <template v-if="item.checked">
            <el-icon v-if="!item.disabled" size="20" @click="deleteNode(item)">
              <CircleClose />
            </el-icon>
            <el-icon v-else color="#999" size="20">
              <CircleClose />
            </el-icon>
            <el-tooltip
                popper-class="el-tooltip__popper"
                effect="dark"
                :show-after="TOOLTIP_SHOW_AFTER"
                :content="item.name"
                placement="top"
            >
              <span>{{ item.name }}</span>
            </el-tooltip>
          </template>
        </div>
      </template>
      <el-empty v-else description="暂无授权范围" />
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as buses from '@/utils/bus';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import { CircleClose } from '@element-plus/icons-vue';
import type { Tree } from '@/types/org';

const { description, titleName } = defineProps({
  description: {
    //描述语句
    type: String,
    default: '授权后用户可查看当前授权组织及子组织范围内所有数据',
  },
  titleName: {
    //树形机构的名称
    type: String,
    default: '已授权范围',
  },
});
const data = ref<Tree[]>([]);
const deleteNode = (item: Tree) => {
  buses.bus.emit(buses.AUTHORIZED_DATA_CHANGE, [item]);
};
const clearData = () => {
  buses.bus.emit(buses.AUTHORIZED_DATA_CHANGE, []);
};
defineExpose({
  data,
});
</script>
<style lang="scss" scoped>

.treeToList {
  height: 100%;
  display: flex;
  flex-direction: column;

  .titleView {
    .clearBtn {
      color: $color_primary;
      //position: absolute;
      right: 10px;
      top: 10px;
      width: 45px;
    }
    .clearBtn:hover {
      background: #fff !important;
    }
  }

  .treeToListItem {
    display: flex;
    align-items: center;
    font-size: $fs-14;

    span {
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $mainContentText;
    }
  }

  .el-scrollbar {
    padding: $commonPadding;
    flex: 1;
  }
}
</style>
