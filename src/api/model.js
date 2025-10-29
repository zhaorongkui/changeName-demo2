import http from "./axios";

// 模型相关
// 详情
export const modelDetail = (params) => {
  return http.request({
    url: "/model/detail",
    method: "get",
    params,
  });
};
// 修改基础设置
export const modelBasic = (params) => {
  return http.request({
    url: "/model/basic",
    method: "get",
    params,
  });
};
// 分页
export const modelPage = (data) => {
  return http.request({
    url: "/model/page",
    method: "post",
    data,
  });
};
// 列表
export const modelList = (data) => {
  return http.request({
    url: "/model/list",
    method: "post",
    data,
  });
};
// 删除
export const modelDelete = (params) => {
  return http.request({
    url: "/model/delete",
    method: "get",
    params,
  });
};
// 新增
export const modelSave = (data) => {
  return http.request({
    url: "/model/save",
    method: "post",
    data,
  });
};
// 修改介绍
export const modelUpdate = (data) => {
    return http.request({
      url: "/model/update",
      method: "post",
      data,
    });
};
// 修改基础设置
export const modelUpdateBasic = (data) => {
    return http.request({
      url: "/model/updateBasic",
      method: "post",
      data,
    });
};
// 关联资产保存
export const modelBindAssetSave = (params) => {
    return http.request({
      url: "/model/bindAssetSave",
      method: "get",
      params,
    });
};
// 关联资产回显
export const modelBindAssetInfo = (params) => {
  return http.request({
    url: "/model/bindAssetInfo",
    method: "get",
    params,
  });
};
// 关联资产名称回显
export const modelBindAsset = (params) => {
  return http.request({
    url: "/model/bindAsset",
    method: "get",
    params,
  });
};

