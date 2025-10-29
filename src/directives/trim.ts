type ExtendHTML = HTMLElement & {
  _onResize?: {
    handler: () => void;
    options: AddEventListenerOptions;
  };
  inputEle;
  _blurHandler;
};
const getInput = (el: HTMLElement) => {
  let inputEle;
  if (el.tagName !== 'INPUT') {
    inputEle = el.querySelector('input');
  } else {
    inputEle = el;
  }
  return inputEle;
};
const dispatchEvent = (el: HTMLElement, type: any) => {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(type, true, true);
  el.dispatchEvent(evt);
};

export const Trim = {
  // 过滤前后空格的指令 v-trim
  mounted(el: ExtendHTML) {
    const inputEle = getInput(el);
    const handler = (event: any) => {
      const newVal = event.target.value.trim();
      if (event.target.value !== newVal) {
        event.target.value = newVal;
        dispatchEvent(inputEle, 'input');
      }
    };
    el.inputEle = inputEle;
    el._blurHandler = handler;
    inputEle.addEventListener('change', handler);
  },
  unmounted(el: ExtendHTML) {
    const { inputEle } = el;
    inputEle.removeEventListener('blur', el._blurHandler);
  },
};

export default Trim;
