import http from "./axios";
import { getBaseUrl} from '@/utils/constant'
let baseUrl = getBaseUrl()
// 赛事类型相关
// 分页
export const listBrief = (params) => {
  return http.request({
    url: "/third/listBrief",
    method: "get",
    params,
  });
};
export const getRaceDetail = (params) => {
  return http.request({
    url: "/third/getRaceDetail",
    method: "get",
    params,
  });
};
export const queryInformation = (params) => {
  return http.request({
    url: "/third/queryInformation",
    method: "get",
    params,
  });
};


