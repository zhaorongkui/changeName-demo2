/*
 * @Author: lihuihui
 * @Date: 2025-03-21 15:06:02
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-28 16:08:23
 * @Description: 公共方法
 */

import { ElMessageBox } from 'element-plus';
// 判断是否有缓存
export const hasLocalStorage = (key: string) => {
  return !['{}', undefined, null, ''].includes(localStorage.getItem(key));
};
// 判断是否是0号租户
export const isBootstrap = () => {
  return window.localStorage.getItem('tenantId') === 'beur';
};
// 判断参数是否存在
export const paramIsNull = (param: any) => {
  return param !== undefined && param !== null && param !== 'undefined';
};
export const dateFormat = (fmt: string, date: any) => {
  let ret: RegExpExecArray | null = null;
  date = new Date(date);
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
};

/**二次确认消息框 */
export const msgConfirm = (
  message: string = '确定要删除吗?',
  confirmText: string = '确定',
  cancelText: string = '取消'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      type: 'warning',
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};
// 判断对象的类型
export const getObjectType = (obj: any) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

export const tryParseJSON = (str: string) => {
  try {
    // 尝试解析 JSON
    const parsed = JSON.parse(str);
    // 如果解析成功，检查解析后的结果是否为数组
    if (Array.isArray(parsed)) {
      return parsed.join('-');
    }
  } catch (e) {
    // 如果解析失败，捕获异常
    console.error('字符串不是有效的 JSON 格式', e);
    return str;
  }
  // 返回原始字符串或 null
  return str;
};
// export const isImage = (type:string)=>{
//   return ['png','jpg','jpeg','pdf','gif'].includes(type.toLocaleLowerCase())
// }

export const isImage = (type: string) => {
  return ['png', 'jpg', 'jpeg', 'pdf', 'gif'].includes(type.toLocaleLowerCase());
};

/**
 * 生成一个唯一的ID
 * @returns {string} 唯一的ID
 */
export function generateId() {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timeStampPart = Date.now().toString(36);
  return `${timeStampPart}-${randomPart}`;
}
/*
 * 判断字符串是否为有效的JSON格式
 */
export function isValidJSON(text: string) {
  if (text === '{}') {
    return true;
  } else {
    try {
      if (Object.prototype.toString.call(JSON.parse(text)) === '[object Object]') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error('字符串不是有效的 JSON 格式', e);
      return false;
    }
  }
}

// 判断变量是否为空，null、undefined、""
export const isEmpty = function (param: any) {
  return [undefined, null, ''].includes(param);
};
// 深度for循环，根据关键字children进行查找子项
export const depthForEach = function (arr: any[], fn: (item: any) => void, { children = 'children' } = {}) {
  const handleStack = [...arr];
  while (handleStack?.length) {
    const curItem = handleStack.shift();
    fn(curItem);
    if (Array.isArray(curItem?.[children])) {
      handleStack.unshift(...curItem[children]);
    }
  }
};
export const getFileType = (file: string, isDot = 0) => {
  if (!file) {
    throw 'file is null';
  }
  const dot = file.lastIndexOf('.');
  if (dot < 0) {
    throw 'file is wrong';
  }
  let end = file.lastIndexOf('?');
  if (end < 0) {
    end = file.length;
  }
  const ext = file.substring(dot + isDot, end).toLowerCase();
  return ext;
};

// 巡检周期cycleTpye映射成中文类别
export const cycleTypeMap = (cycleType: string) => {
  switch (cycleType?.toLowerCase()) {
    case 'hour':
      return '小时';
    case 'day':
      return '天';
    case 'week':
      return '周';
    case 'month':
      return '月';
    case 'halfyear':
      return '半年';
    case 'year':
      return '年';
    default:
      return '';
  }
};

// 将中文数字转换为阿拉伯数字
export function chineseToArabic(chineseStr: string) {
  const numMap = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };
  let result = '';
  for (let i = 0; i < chineseStr.length; i++) {
    const ch = chineseStr.charAt(i);
    if (numMap[ch]) {
      result += numMap[ch];
    }
  }
  return result;
}
// 根据id分组
export function groupedById(arr: any[], idMap: string): any[] {
  const grouped = new Map();
  arr.forEach((item) => {
    const department = item[idMap];
    if (!grouped.has(department)) {
      grouped.set(department, []);
    }
    grouped.get(department).push(item);
  });
  return Object.fromEntries(grouped);
}

// 地址栏参数解析
export const getUrlParams = (url: string = location.href): { [key: string]: string } => {
  const urlParams = decodeURIComponent(url).split('?')[1].split('&'); // 获取查询参数
  const params: { [key: string]: string } = {}; // 初始化参数对象
  // 遍历所有查询参数
  urlParams.forEach((val) => {
    const [name, value] = val.split('=');
    params[name] = value;
  });
  return params;
};
// 递归查找水厂名称
export function findNameById(tree, id: number | string) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i].name;
    }
    if (tree[i].children) {
      const foundName = findNameById(tree[i].children , id);
      if (foundName) {
        return foundName;
      }
    }
  }
  return null;
}
// 获取当前时间
export function formatDate(isWithTime = false) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (isWithTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return `${year}-${month}-${day}`;
}

// 判断是否是uni的环境
export const isUni = () => {
  const ua = navigator.userAgent || '';
  return ua.indexOf('uni-app') !== -1;
};

export const getUrlParamsStrong = (url: string = location.href): { [key: string]: string } => {
  let search = '';
  // 处理 hash 路由
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hash = url.slice(hashIndex + 1);
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      search = hash.slice(queryIndex + 1);
    }
  } else {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      search = url.slice(queryIndex + 1);
    }
  }
  const params: { [key: string]: string } = {};
  if (search) {
    search.split('&').forEach((pair) => {
      const [key, ...rest] = pair.split('=');
      if (!key) return;
      // 只对值做 decodeURIComponent
      params[key] = rest.length > 0 ? decodeURIComponent(rest.join('=')) : '';
    });
  }
  return params;
};
/**
 * 根据组织ID数组获取对应的名称数组
 * @param {Array} options - 组织维度选项数组
 * @param {Array} ids - 选中的ID数组（如["org1", "org1-1", "org1-1-1"]）
 * @returns {Array} 对应的名称数组
 */
export function getOrganizationNames(options, ids) {
  // 存储结果的名称数组
  const names = [];

  // 递归查找函数
  function findName(arr, targetId) {
    for (const item of arr) {
      if (item.orgId === targetId) {
        return item.name;
      }
      // 如果有子节点，递归查找
      if (item.children && item.children.length > 0) {
        const found = findName(item.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // 遍历ID数组，查找每个ID对应的名称
  for (const id of ids) {
    const name = findName(options, id);
    if (name) {
      names.push(name);
    }
  }

  return names;
}
// 使用示例：获取["org1", "org1-1", "org1-1-1"]对应的名称
// const selectedIds = ["org1", "org1-1", "org1-1-1"];
// const selectedNames = getOrganizationNames(organizationOptions, selectedIds);
// console.log(selectedNames); // 输出: ["北控水务集团", "华北区域", "北京公司"]

/**
 * 将包含id和name的数组转换为以id为键、name为值的映射对象
 * @param {Array} array - 包含id和name属性的对象数组
 * @returns {Object} 映射对象 {id: name, ...}
 */
export function arrayToMap(array) {
  // 检查输入是否为有效数组
  if (!Array.isArray(array)) {
    console.warn('输入必须是一个数组');
    return {};
  }

  // 遍历数组，构建映射对象
  return array.reduce((map, item) => {
    // 确保对象包含id和name属性
    if (item && item.id !== undefined && item.name !== undefined) {
      map[item.id] = item.name;
    } else {
      console.warn('数组元素必须包含id和name属性', item);
    }
    return map;
  }, {});
}

// // 使用示例
// const statusArray = [
//   {id: 'null', name: '全部'},
//   {id: '1', name: '审核中'},
//   {id: '2', name: '审核通过'},
//   {id: '3', name: '审核未通过'}
// ];

// // 转换为映射对象
// const statusMap = arrayToMap(statusArray);
// console.log(statusMap);
// // 输出: { "null": "全部", "1": "审核中", "2": "审核通过", "3": "审核未通过" }
/**
 * 根据数据类型返回对应的初始值
 * @param {any} data - 要判断类型的数据
 * @returns {string|Array|object|null|number} 对应类型的初始值
 */
export function getInitialValue(data) {
  // 判断是否为字符串类型
  if (typeof data === 'string') {
    return '';
  }

  // 判断是否为数字类型
  if (typeof data === 'number') {
    return 0;
  }

  // 判断是否为数组
  if (Array.isArray(data)) {
    return [];
  }

  // 判断是否为对象（排除null，因为typeof null === 'object'）
  if (typeof data === 'object' && data !== null) {
    return null;
  }

  // 其他类型可以根据需要扩展，这里返回null作为默认
  return null;
}
export const flattedParse = (str: string) => {
    // 用于恢复循环引用的数组
    const references: any[] = [];
    // 反序列化处理器
    const reviver = (key: any, value: any) => {
        if (typeof value === 'object' && value !== null && '__type' in value) {
            switch (value.__type) {
                case 'function':
                    // 使用Function构造函数恢复函数，注意安全风险
                    try {
                        // 区分箭头函数和普通函数
                        if (value.value.includes('=>')) {
                            const func = new Function(`return (${value.value})`);
                            return func();
                        } else {
                            const func = new Function(`return function ${value.value}`);
                            return func();
                        }
                    } catch (e) {
                        console.error('恢复函数失败:', e);
                        return null;
                    }
                case 'regexp':
                    return new RegExp(value.value.source, value.value.flags);
                case 'date':
                    return new Date(value.value);
                case 'nan':
                    return NaN;
                case 'infinity':
                    return value.value === 'positive' ? Infinity : -Infinity;
                case 'reference':
                    return references[value.value];
                default:
                    return value;
            }
        }
        // 收集引用对象用于处理循环引用
        if (typeof value === 'object' && value !== null) {
            references.push(value);
        }

        return value;
    };

    return JSON.parse(str, reviver);
}