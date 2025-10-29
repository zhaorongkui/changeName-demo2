import { hasPermission } from '@/utils/hasPermission';

const removeDom = (el) => {
    el._placeholderNode = document.createComment('permission-btn');
    el._parentNode = el.parentNode;
    el.parentNode.replaceChild(el._placeholderNode, el);
};

const addDom = (el) => {
    el._parentNode?.replaceChild(el, el._placeholderNode);
};

const mounted = (el, binding) => {
    const permisList = binding.value;
    if (!permisList) return;
    if (!hasPermission(permisList)) {
        removeDom(el);
    }
};
const updated = (el, binding) => {
    const valDiff = binding.value === binding.oldValue;
    if (valDiff) return;

    const oldPermisStatus = hasPermission(binding.oldValue);
    const newPermisStatus = hasPermission(binding.value);
    if (oldPermisStatus == newPermisStatus) return;

    if (newPermisStatus) {
        addDom(el);
    } else {
        removeDom(el);
    }
};

export const Permission = {
    mounted,
    updated,
};
