import { ref } from 'vue';
import { getTaskTodo } from '@/api/thirdparty'; // 导入接口

/**
 * 任务待办公共逻辑Hook
 * @param {Function} getDataPageList 页面自己的列表接口方法
 * @returns {Object} { procInstParams, getTaskTodoAct }
 */
export function useTaskTodo(getDataPageList) {
  // 存储procInstParams的响应式变量
  const procInstParams = ref([]);
  // 获取 localStorage 中的 app 数据
  const appDataStr = localStorage.getItem('app');
  // 初始化 userName 变量
  let userName = '';
  if (appDataStr) {
    try {
      // 解析 JSON 字符串为对象
      const appData = JSON.parse(appDataStr);
      // 逐级获取 userName，注意判断各层级是否存在，避免报错
      if (appData.userInfo && appData.userInfo.username) {
        userName = appData.userInfo.username;
      }
    } catch (error) {
      console.error('解析 localStorage 中的 app 数据失败：', error);
    }
  }
  /**
   * 获取任务待办的方法
   * @param {string} userName 当前登录人信息 在当前自己获取
   * @param {number} currentPage 当前页码
   * @param {number} pageSize 每页条数
   */

  const getTaskTodoAct = (currentPage, pageSize) => {
    getTaskTodo(
      userName,
      currentPage,
      pageSize
    )
      .then((res) => {
        console.log('任务待办接口返回', res);
        if (res.code === 0) {
          if (res.data?.records?.length > 0) {
            // 提取需要的参数
            procInstParams.value = res.data.records.map(item => ({
              procInstId: item.procInstId,
              taskId: item.taskId
            }));
            // 调用页面自己的列表接口
            getDataPageList();
          } else {
            // 处理空数据情况
            procInstParams.value = [];
            getDataPageList(); // 即使没数据也可以调用，让页面处理空状态
          }
        }
      })
      .catch((error) => {
        console.error('任务待办接口调用失败', error);
      });
  };

  // 返回响应式数据和方法
  return {
    procInstParams,
    getTaskTodoAct
  };
}