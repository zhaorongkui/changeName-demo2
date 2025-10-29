import axios from 'axios';
/**
 * 保存
 * @param  {Blob} blob
 */
export function saveFile(data: Blob,filename ) {

    // let filename = res.headers['content-disposition'];
    // filename = filename.split(';')[1].split('filename=')[1];
    // filename = decodeURIComponent(filename);
    const blob = new Blob([data], { type: 'application/octet-stream' }); // res就是接口返回的文件流了
    const objectUrl = URL.createObjectURL(blob);
    const downloadElement = document.createElement('a');
    downloadElement.href = objectUrl;
    downloadElement.setAttribute('download', filename);
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(objectUrl);
}
const imageCache = new Map<string, Blob>();
export const getImgUrl = (fileId: string) => {
  // 图片缓存
  if (imageCache.has(fileId)) {
    const fileBolb = imageCache.get(fileId);
    return Promise.resolve(URL.createObjectURL(fileBolb!));
  }
  const BASE_API = `${location.protocol}//${location.host}`;
  if (!fileId) {
    return Promise.resolve('');
  }
  return axios
    .get(BASE_API + `/iot/openApi/gfss/api/v1/file/view?fileId=${fileId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      responseType: 'blob',
    })
    .then((response) => {
      imageCache.set(fileId, response.data);
      return URL.createObjectURL(response.data);
    });
};
