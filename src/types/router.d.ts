/*
 * @Author: lihuihui
 * @Date: 2025-03-28 17:31:07
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-04-08 13:46:47
 * @Description: 扩展router-type
 */

import { type RouteRecordRaw } from 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    group?: string;
    icon?: string;
    iconStyle?: string;
    activeMenu?: string;
    hideTitle?: boolean;
    isBack?: boolean;
  }
}

declare global {
  declare interface RouteMeta {
    title?: string;
    icon?: string;
    iconStyle?: string;
    activeMenu?: string;
    hideTitle?: boolean;
    isBack?: boolean;
    group?: string;
  }

  // 定义 Recordable 类型
  declare interface Recordable<T = any> {
    [key: string]: T;
  }
  declare interface PlantRouteRecordRaw extends RouteRecordRaw {
    name: string;
    title?: string;
    meta?: RouteMeta;
    component?: Component | string;
    children?: PlantRouteRecordRaw[];
    props?: Recordable;
    fullPath?: string;
    redirect?: string;
    path: string;
  }
  declare interface CustomRouteRecordRaw extends RouteRecordRaw {
    name: string;
    meta: RouteMeta;
    component: string;
    path: string;
    redirect: string;
    children?: CustomRouteRecordRaw[];
  }
  declare interface Result<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
  }
}
