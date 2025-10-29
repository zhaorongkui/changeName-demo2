// 文件大小转换
export const bytesToSize = (size: number) => {
  if (!size) return ''
  if (size < pow1024(1)) return size + ' B'
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB'
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB'
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB'
  return (size / pow1024(4)).toFixed(2) + ' TB'
}
const pow1024 = (num: number) => {
  return Math.pow(1024, num)
}

/**
 * 导出后端返回的文件流
 * @param res 后端返回的二进制文件流
 * @param name 自定义的文件名
 */
export const downFile = (res) => {
    const pathList = res.request.responseURL.split('/');
    let filename = pathList[pathList.length -1];
    filename = decodeURIComponent(filename);
    const blob = new Blob([res.data]); // res就是接口返回的文件流了
    const objectUrl = URL.createObjectURL(blob);
    const downloadElement = document.createElement('a')
    downloadElement.href = objectUrl
    downloadElement.setAttribute('download', filename); 
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(objectUrl)
}
