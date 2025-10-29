import http from "./axios";
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL
// 标签相关
// 分页
export const tagPage = (data) => {
  return http.request({
    url: baseUrl + "/tag/page",
    method: "post",
    data,
  });
};
// 列表
export const tagList = (data) => {
  return http.request({
    url: baseUrl + "/tag/list",
    method: "post",
    data,
  });
};
// 详情
export const tagInfo = (params) => {
  return http.request({
    url: baseUrl + "/tag/info",
    method: "get",
    params,
  });
};
// 删除
export const tagDelete = (params) => {
  return http.request({
    url: baseUrl + "/tag/delete",
    method: "get",
    params,
  });
};
// 新增和修改
export const tagSaveOrUpdate = (data) => {
  return http.request({
    url: baseUrl + "/tag/saveOrUpdate",
    method: "post",
    data,
  });
};

