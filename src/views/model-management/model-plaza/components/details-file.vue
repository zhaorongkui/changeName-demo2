<template>
    <div class="modelFile">
        <div class="flex flex-row mb-1" v-if="isEdit">
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                :limit="1"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="fileChange"
                :disabled="Boolean(messageRef)"
            >
                <template #trigger>
                    <el-button round :disabled="Boolean(messageRef)">添加文件</el-button>
                </template>
            </el-upload>
        </div>
        <el-table :data="tableData" style="width: 100%" class="flex-1 overflow-y-auto">
            <el-table-column prop="fileName" label="文件名称" />
            <el-table-column prop="size" label="文件大小">
                <template #default="{row}">
                    {{ bytesToSize(row.size) }}
                </template>
            </el-table-column>
            <el-table-column prop="time" label="添加时间" >
                <template #default="{row}">
                    {{ row.updateTime ? formatDate(row.updateTime, 'YYYY-MM-DD HH:mm:ss') : '-' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" v-if="isEdit">
                <template #default="{row}">
                    <el-button link type="danger" :icon="Delete" :disabled="Boolean(messageRef)" @click="deleteFile(row)">删除</el-button>
                    <el-button link type="primary" :icon="Download" :disabled="Boolean(messageRef)" @click="downloadFiles(row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="inline-block justify-center mt-2"
            v-model:current-page="pageData.currentPage"
            v-model:page-size="pageData.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            :total="pageData.total"
            @size-change="getFileList"
            @current-change="getFileList"
        />
        <el-progress v-show="messageRef" class="fileProgress" :text-inside="true" :stroke-width="20" status="exception" :percentage="fileProcessing" :color="colors">
            <span>{{messageRef}}进度{{ fileProcessing }}%</span>
        </el-progress>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from 'axios'
import projectEnv from "@/config/runtimeEnv.js";
import pLimit from 'p-limit'
import { Delete, Download } from '@element-plus/icons-vue'
import { formatDate } from "@/utils/date"
import { bytesToSize } from "@/utils/file"
import TypeInfo from '@/hooks/dataType'
import commonDetailsFn from '@/hooks/modelAndDatas'
import {filePage, fileDelete, fileSave} from '@/api/files'

defineProps({
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
});
// 下载进度条的颜色值
const colors = [
  { color: '#999', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#6f7ad3', percentage: 80 },
  { color: '#1989fa', percentage: 100 },
]
const { dataType } = TypeInfo()
const {detailsData} = commonDetailsFn()
const fileUrl = projectEnv.VITE_APP_FILE_META
const currentDetailsData = computed(() => {
    return detailsData.value
})
const pageData = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
const tableData = ref([])
const getFileList = () => {
    filePage({
        currentPage: pageData.value.currentPage,
        pageSize: pageData.value.pageSize,
        type: dataType.value.key,
        assetId: currentDetailsData.value.id,
    }).then((res) => {
        const {data: {data}} = res;
        tableData.value = data?.body || []
        pageData.value.total = data?.total || 0
    })
}
getFileList()

let messageRef = ref('')
let fileProcessing = ref(0)
const chunkSize = 1 * 1024 * 1024 // 分片的大小
const bugFileSize = 50 * 1024 * 1024 // 文件大于这个就使用分片上传
// 文件分片上传
const fileUploadChunk = (params, logicId: number): Promise<any> => {
  return axios({
      url: fileUrl + '/gfss/api/v1/file/fragmentUpload',
      method: 'post',
      data: {
          logicId: logicId,
          ...params,
      },
      headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
          accept: '*/*',
      },
  })
}
// 大文件的分片上传后，请求服务端是否已已经合并
const apiFragmentUploadProcess = (param): any => {
  return axios({
      url: fileUrl + '/gfss/api/v1/file/fragmentUploadProcess',
      method: 'get',
      params: param,
      headers: {
          Authorization: localStorage.getItem('token'),
      },
  })
}
// 文件分片
const chunkFile = (file, chunksize) => {
  const chunks = Math.ceil(file.size / chunksize)
  const chunksList: any[] = []
  let currentChunk = 0
  while (currentChunk < chunks) {
    const start = currentChunk * chunksize
    const end = Math.min(file.size, start + chunksize)
    const chunk = file.slice(start, end)
    chunksList.push(chunk)
    currentChunk++
  }
  return chunksList
}
// 大文件分片上传
const largeFileUpload = (fileRaw, bigFileId) => {
  return new Promise<any>((resolve, reject) => {
      const limit = pLimit(3)
      const chunksList = chunkFile(fileRaw, chunkSize)
      const promiseList: any[] = []
      chunksList.forEach((item, index) => {
          promiseList.push(
            limit(() => {
                fileProcessing.value = parseInt(index * 100 / chunksList.length + '')
                return fileUploadChunk(
                    {
                        chunk: index,
                        chunks: chunksList.length,
                        fileName: fileRaw.name,
                        file: item,
                        bigFileId: bigFileId,
                    },
                    Number(bigFileId)
                )
            })
          )
          
      })
      Promise.all(promiseList)
          .then(res1 => {
              // console.log('Promise.all', res1)
              // 这里问服务端是否已合并
              let fileIsMerge = setInterval(() => {
                apiFragmentUploadProcess({ bigFileId }).then((res) => {
                    console.log('res', res);
                    if (res.data.data.finish) {
                        clearInterval(fileIsMerge)
                        resolve(res)
                    }
                })
              }, 500);
          })
          .catch(err => {
              console.log(err)
          })
          .finally(() => {

          })
  })
}
// 不用分片文件上传
const fileUpload = (file: any) => {
  const formData = new FormData()
  formData.append('files', file)
  formData.append('logicId', new Date().getTime().toString())
  return axios.post(fileUrl + '/gfss/api/v1/file/uploads', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
          accept: '*/*',
      },
  })
}
// 上传文件
const uploadRef = ref()
const fileChange = (uploadFile) => {
    let iFileListPromiseList: any[] = [];
    const limit = pLimit(1)
    if (uploadFile) {
        messageRef.value = '上传'
        if (uploadFile.size > bugFileSize) {
            const bigFileId = new Date().getTime().toString();
            iFileListPromiseList.push(limit(() => largeFileUpload(uploadFile.raw, bigFileId)))
        } else {
            iFileListPromiseList.push(limit(() => fileUpload(uploadFile.raw)))
        }
        Promise.all(iFileListPromiseList)
        .then(res => {
            fileSave({
                fileId: res[0].data?.data?.[0]?.fileId || res[0].data?.data?.fileId,
                fileName: uploadFile.name,
                fileSize: uploadFile.size,
                type: dataType.value.key,
                assetId: currentDetailsData.value.id,
            }).then((newRes) => {
                const {data: {code}} = newRes;
                if (code === 0) {
                    pageData.value.currentPage = 1;
                    pageData.value.pageSize = 10;
                    ElMessage.success('上传文件成功')
                    getFileList()
                    uploadRef.value.clearFiles()
                }
            })
        })
        .catch(_ => {
            ElMessage.error('上传失败')
        })
        .finally(() => {
            messageRef.value = ''
        })
    }
}
const saveFile = (blobs, fileName) => {
    const blob = new Blob(blobs); // res就是接口返回的文件流了
    const objectUrl = URL.createObjectURL(blob);
    const downloadElement = document.createElement('a')
    downloadElement.href = objectUrl
    downloadElement.setAttribute('download', fileName);
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(objectUrl)
    messageRef.value = ''
}
// 文件整个下载
const downloadCompleteFiles = (data) => {
    axios.get(`${fileUrl}/gfss/api/v1/file/view?fileId=${data.fileId}`, {
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        responseType: 'blob',
    }).then(res => {
        saveFile([res.data], data.fileName)
    })
}
const apiFragmentDown = (param: any, rangeStart: any, rangeEnd: any) => {
    return  axios.get(`${fileUrl}/gfss/api/v1/file/fragmentdown`, {
        headers: {
            Authorization: localStorage.getItem('token'),
            Range: `bytes=${rangeStart}-${rangeEnd}`
        },
        params: param,
        responseType: 'blob',
        requestOptions: { repeatRequestCancel: true, loading: true },
  })
}
// 文件分片下载
const rangeDownload = (fileSize, fileId) => {
    return new Promise<void>(async (resolve, reject) => {
        let chunkNum = Math.ceil(fileSize / chunkSize)
        const blobs = []
        for (let i = 0; i < chunkNum; i++) {
            fileProcessing.value = parseInt(i * 100 / chunkNum + '')
            const rangeStart = i * chunkSize
            const rangeEnd = rangeStart + chunkSize - 1
            let tmp = await apiFragmentDown({ fileId: fileId }, rangeStart, rangeEnd).catch(
                e => e
            )
            blobs.push(tmp.data)
        }
        resolve(blobs)
    })
}
const downloadFiles = async (data) => {
    messageRef.value = '下载'
    if (data.size > bugFileSize) {
        const blobArr = await rangeDownload(data.size, data.fileId)
        saveFile(blobArr, data.fileName)
    } else {
        downloadCompleteFiles(data);
    }
}
// 大文件的分片上传后，请求服务端是否已已经合并
const delServiceFile = (param): any => {
  axios({
      url: fileUrl + '/gfss/api/v1/file/del',
      method: 'get',
      params: param,
      headers: {
          Authorization: localStorage.getItem('token'),
      },
  }).then((res) => {
    console.log('res', res);
  })
}
const deleteFile = (data) => {
    ElMessageBox.confirm("确定删除选中项(不可恢复)?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
        fileDelete({
            id: data.id
        }).then((res) => {
            const {data: {code}} = res;
            if (code === 0) {
                ElMessage.success('删除成功')
                getFileList()
                delServiceFile({fileId: data.fileId})
            }
        })
    });
}

</script>
<style lang="postcss" scoped>
.modelFile {
    @apply rounded-md bg-white overflow-y-auto px-5 py-4 flex flex-col;
    .fileProgress {
        @apply absolute top-3 right-5 w-[200px] h-4 z-50;
    }
}
</style>