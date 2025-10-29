/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-21 13:21:20
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 16:47:23
 * @FilePath: \model-sandbox-frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import i18n from './i18n/i18n'
import ElementPlus from 'element-plus'
import BewgUiVue3 from 'bewg-ui-vue3'
import './index.css'
import 'element-plus/dist/index.css'
import 'bewg-ui-vue3/dist/style.css'
import './style/elementComUI.scss'
import './style/layout.postcss'
import './assets/iconfont/iconfont.js'
import '@/assets/element-plus/css-vars.css';
import projectEnv from '@/config/runtimeEnv.js'
import directives from './directives';
import store from './store'
// 路由拦截  包括登录
import './permission'

//手动开启mock
// import './api/mockServerData/mock'

const app = createApp(App)
app.provide('$projectEnv', projectEnv)
app.use(router)
app.use(ElementPlus)
app.use(BewgUiVue3)
app.use(directives);
app.use(i18n)
app.use(store)
app.mount('#app')
