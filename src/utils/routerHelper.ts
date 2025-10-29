/*
 * @Author: lihuihui
 * @Date: 2025-03-24 13:28:38
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-04-08 13:36:33
 * @Description: 路由相关操作
 */
import type { Resource } from '@/types/org';
const modules = import.meta.glob('/src/views/**/*.vue');

export const compilerRoutes = (routes: Resource[]): PlantRouteRecordRaw[] => {
    const res: PlantRouteRecordRaw[] = [];
    if (!routes.length) {
        return [];
    }
    routes.forEach((route) => {
        let meta = {};
        try {
            meta = JSON.parse(route?.meta || '{}');
        } catch (error) {
            // console.log('error ==', error);
            // console.log('route ==', route);
        }

        const data: PlantRouteRecordRaw = {
            path: route.path as string,
            name: route.name,
            title: route.displayName,
            redirect: route.redirect,
            // meta: typeof route.meta === 'string' ? JSON.parse(route?.meta || '{}') : route.meta,
            meta: route.meta ? JSON.parse(route.meta) : {},
            detail: route.detail
        };
        if (route.component) {
            const comModule = modules[`/src/views/${route.component}`];
            data.component = comModule;
        }
        if (route.children) {
            data.children = compilerRoutes(route.children) as PlantRouteRecordRaw[];
        }
        res.push(data as PlantRouteRecordRaw);
    });

    return res;
};
