/*
 * @Author: linyongcai
 * @Date: 2024-11-04 13:31:14
 * @FilePath: \sed-saas-frontend\src\directives\resize.ts
 * @Description: 页面描述
 */
type ExtendHTML = HTMLElement & {
  _onResize?: {
    handler: () => void;
    options: AddEventListenerOptions;
  };
};
export const Resize = {
  mounted(el: ExtendHTML, binding: any) {
    const handler = binding.value;
    const options = {
      passive: !binding.modifiers?.active,
    };

    window.addEventListener('resize', handler, options);

    el._onResize = {
      handler,
      options,
    };

    if (!binding.modifiers?.quiet) {
      handler();
    }
  },

  unmounted(el: ExtendHTML) {
    if (!el._onResize) return;

    const { handler, options } = el._onResize;
    window.removeEventListener('resize', handler, options);
    delete el._onResize;
  },
};

export default Resize;
