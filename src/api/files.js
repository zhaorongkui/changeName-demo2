import http from "./axios";
import { getBaseUrl} from '@/utils/constant'
let baseUrl = getBaseUrl()
// 文件相关
// 文件列表分页
export const filePage = (data) => {
  return http.request({
    url: "/file/page",
    method: "post",
    data,
  });
};
// 文件删除
export const fileDelete = (params) => {
  return http.request({
    url: "/file/delete",
    method: "get",
    params,
  });
};
// 文件添加
export const fileSave = (data) => {
  return http.request({
    url: "/file/save",
    method: "post",
    data,
    params: data,
  });
};
