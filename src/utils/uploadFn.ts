/*
 * @Author: zhangbo
 * @Date: 2025-01-15 16:52:31
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-31 13:54:02
 * @Description: upload场景涉及到的公共函数
 * @FilePath: \sed-saas-frontend\src\utils\uploadFn.ts
 */

import pLimit from 'p-limit';
// import { iChunkSize } from '@/views/filestorage/component/fileConfig.ts'; // iFileSize
import { fileUploadChunk, apiFragmentUploadProcess, apiFileView, apiFragmentDown } from '@/service/fileStorage';

export const downloadChunkSize = 1048576; // 1M 分片下载片大小(根据业务规定)

const iChunkSize = 1; // 分块大小,默认设置为1M
/**
 * @description: 分片
 * @param {*} file
 * @param {*} chunksize
 * @return {*}
 * @author: zhangbo
 */
const chunkFile = (file, chunksize) => {
  const chunks = Math.ceil(file.size / chunksize);
  const chunksList: any[] = [];
  let currentChunk = 0;
  while (currentChunk < chunks) {
    const start = currentChunk * chunksize;
    const end = Math.min(file.size, start + chunksize);
    const chunk = file.slice(start, end);
    chunksList.push(chunk);
    currentChunk++;
  }
  return chunksList;
};

/**
 * @description: 大文件上传
 * @param {*} fileRaw
 * @param {*} bigFileId
 * @return {*} Promise
 * @author: zhangbo
 */
export const largeFileUpload = (fileRaw, bigFileId) => {
  return new Promise<any>((resolve, reject) => {
    const limit = pLimit(3);
    const chunksList = chunkFile(fileRaw, iChunkSize * 1024 * 1024);
    const promiseList: any[] = [];

    chunksList.forEach((item, index) => {
      promiseList.push(
        limit(() =>
          fileUploadChunk(
            {
              chunk: index,
              chunks: chunksList.length,
              fileName: fileRaw.name,
              file: item,
              bigFileId: bigFileId,
            },
            Number(bigFileId)
          )
        )
      );
    });

    Promise.all(promiseList)
      .then(() => {
        const len = chunksList.length;
        setTimeout(async () => {
          const res = await apiFragmentUploadProcess({ bigFileId }); // 是否合并
          if (res) {
            resolve({ code: 0, data: [{ fileId: res.data.fileId }], message: '操作成功' });
          }
        }, 1000 * len);
      })
      .catch((err) => {
        reject(new Error(err));
      })
      .finally(() => {});
  });
};

/**
 * @description: 分片下载
 * @param {*} fileSize 文件有多少M
 * @param {*} fileId 文件fileId
 * @param {*} downloadChunkSize
 * @return {*} Promise
 * @author: zhangbo
 */
export const rangeDownload = (fileSize, fileId, downloadChunkSize) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<Blob[]>(async (resolve) => {
    const chunkNum = Math.ceil(fileSize / downloadChunkSize);
    const blobs: Blob[] = [];

    for (let i = 0; i < chunkNum; i++) {
      const rangeStart = i * downloadChunkSize;
      const rangeEnd = rangeStart + downloadChunkSize - 1;
      const tmp = await apiFragmentDown({ fileId: fileId }, { Range: `bytes=${rangeStart}-${rangeEnd}` }).catch(
        (e) => e
      );
      blobs.push(tmp.data as Blob);
    }

    resolve(blobs);
  });
};

/**
 * @description: 根据fileKey拉取全量的文件流，并生成合法的blob地址
 * @param {*} fileKeyStr
 * @return {*}
 * @author: zhangbo
 */
export const getImages = (fileKeyStr) => {
  const imageList = fileKeyStr.split(',');

  return new Promise((resolve, reject) => {
    Promise.all([...imageList.map(async (items: any) => getImgUrl(items))])
      .then((res) => {
        const resData = res.map((item: any) => URL.createObjectURL(item));
        resolve(resData);
      })
      .catch(() => {
        reject(new Error('error'));
      })
      .finally(() => {});
  });
};

const getImgUrl = (fileId: string) => {
  return apiFileView(fileId)
    .then((res) => {
      // console.log('apiFileView = ', res)
      return res.data;
    })
    .catch((e) => {
      // console.log('e = ', e)
      return e.data;
    });
};
