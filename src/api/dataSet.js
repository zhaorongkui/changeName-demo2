import http from "./axios";

// 数据集相关
// 详情
export const datasDetail = (params) => {
  return http.request({
    url: "/datas/detail",
    method: "get",
    params,
  });
};
// 基础设置回显
export const datasBasic = (params) => {
  return http.request({
    url: "/datas/basic",
    method: "get",
    params,
  });
};
// 分页
export const datasPage = (data) => {
  return http.request({
    url: "/datas/page",
    method: "post",
    data,
  });
};
// 列表
export const datasList = (data) => {
  return http.request({
    url: "/datas/list",
    method: "post",
    data,
  });
};
// 删除
export const datasDelete = (params) => {
  return http.request({
    url: "/datas/delete",
    method: "get",
    params,
  });
};
// 新增
export const datasSave = (data) => {
  return http.request({
    url: "/datas/save",
    method: "post",
    data,
  });
};
// 修改介绍
export const datasUpdate = (data) => {
  return http.request({
    url: "/datas/update",
    method: "post",
    data,
  });
};
// 修改基础配置
export const datasUpdateBasic = (data) => {
    return http.request({
      url: "/datas/updateBasic",
      method: "post",
      data,
    });
};
// 关联资产保存
export const datasBindAssetSave = (params) => {
    return http.request({
      url: "/datas/bindAssetSave",
      method: "get",
      params,
    });
};
// 关联资产回显
export const datasBindAssetInfo = (params) => {
  return http.request({
    url: "/datas/bindAssetInfo",
    method: "get",
    params,
  });
};
// 关联资产名称回显
export const datasBindAsset = (params) => {
  return http.request({
    url: "/datas/bindAsset",
    method: "get",
    params,
  });
};


