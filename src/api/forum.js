import http from "./axios";
import { getBaseUrl} from '@/utils/constant'
let baseUrl = getBaseUrl()
// 论坛相关
// 论坛列表分页
export const forumPage = (data) => {
    return http.request({
      url: "/forum/page",
      method: "post",
      data,
    });
};
// 论坛添加
export const forumSave = (data) => {
    return http.request({
      url: "/forum/save",
      method: "post",
      data,
    });
};
// 论坛列表
export const forumList = (data) => {
  return http.request({
    url: "/forum/list",
    method: "post",
    data,
  });
};
