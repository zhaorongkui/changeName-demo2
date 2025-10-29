import http from "./axios";
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL
// 标签类型相关
// 分页
export const tagTypePage = (data) => {
  return http.request({
    url: baseUrl + "/tagType/page",
    method: "post",
    data,
  });
};
// 列表
export const tagTypeList = (data) => {
  return http.request({
    url: baseUrl + "/tagType/list",
    method: "post",
    data,
  });
};
// 详情
export const tagTypeInfo = (params) => {
  return http.request({
    url: baseUrl + "/tagType/info",
    method: "get",
    params,
  });
};
// 删除
export const tagTypeDelete = (params) => {
  return http.request({
    url: baseUrl + "/tagType/delete",
    method: "get",
    params,
  });
};
// 新增和修改
export const tagTypeSaveOrUpdate = (data) => {
  return http.request({
    url: baseUrl + "/tagType/saveOrUpdate",
    method: "post",
    data,
  });
};


