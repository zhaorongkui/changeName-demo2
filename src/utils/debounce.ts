// 防抖函数
export const useDebounce = (fn, delay = 1000) => {
  let timer = null;
  return (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
          fn.apply(this, args)
      }, delay)
  }
};
  