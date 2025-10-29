/*
 * @Author: lihuihui
 * @Date: 2025-03-28 17:31:07
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-31 09:19:28
 * @Description: 请填写简介
 */
import { ref } from 'vue'
export type ThemeMode = 'default' | 'green' | 'red' | 'orange' | 'darkblue' | 'purple';
export const themeColorList = [
    { value: 'default', label: '商务蓝' },
    { value: 'green', label: '环保绿' },
    { value: 'red', label: '政务红' },
    { value: 'orange', label: '金融橙' },
    { value: 'darkblue', label: '工业蓝' },
    { value: 'purple', label: '娱乐紫' },
];
const modeClassName = {
    default: '',
    red: 'red-mode',
    green: 'green-mode',
    orange: 'orange-mode',
    darkblue: 'darkblue-mode',
    purple: 'purple-mode',
};
const theme = ref<ThemeMode>('default');
const themeColorValue = ref('#003894');

const setColorMode = (mode: ThemeMode) => {
    localStorage.setItem('EJ_TAG_COLOR_MODE', mode);
    theme.value = mode;
    switch (mode) {
        case 'default':
            themeColorValue.value = '#003894';
            break;
        case 'green':
            themeColorValue.value = '#00800B';
            break;
        case 'red':
            themeColorValue.value = '#C7000B';
            break;
        case 'orange':
            themeColorValue.value = '#E38700';
            break;
        case 'darkblue':
            themeColorValue.value = '#00558F';
            break;
        case 'purple':
            themeColorValue.value = '#52008F';
            break;
    }
};

const getColorMode = (): ThemeMode => {
    return (localStorage.getItem('EJ_TAG_COLOR_MODE') as ThemeMode) ?? 'default';
};

// 清除所有主题类名
const clearClassName = () => {
    Object.values(modeClassName).forEach((className) => {
        if (className) {
            document.querySelector('html')?.classList?.remove(className);
        }
    });
    theme.value = getColorMode();
};

export default function useTheme() {
    const switchTheme = (mode: ThemeMode) => {
        clearClassName();
        // body 设置类名
        if (modeClassName[mode]) {
            document.querySelector('html')?.classList?.add(modeClassName[mode]);
        }
        setColorMode(mode);
    };

    // 获取当前主题模式
    const fetchThemeMode = () => {
        return getColorMode();
    };

    const init = () => {
        // 初始应用时，动态加载主题色
        const mode = fetchThemeMode();
        switchTheme(mode);
    };

    return {
        theme,
        themeColorValue,
        init,
        switchTheme,
        fetchThemeMode,
    };
}
