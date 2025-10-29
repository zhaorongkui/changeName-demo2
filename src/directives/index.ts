/*
 * @Description:
 */
import { Resize } from './resize';
import { Permission } from './permission';
import { Trim } from './trim';
// 自定义指令集合
const directives = {
    Resize,
    Permission,
    Trim,
};

export default {
    install(app) {
        Object.keys(directives).forEach((key) => {
            app.directive(key, directives[key]);
        });
    },
};
