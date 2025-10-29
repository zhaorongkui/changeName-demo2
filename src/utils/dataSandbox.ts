import type { RawTag, TreeNode } from '@/types/dataSandbox'

export function formatTagTree(rawList: RawTag[]): TreeNode[] {
  const typeMap  = {}
  rawList.forEach((tag) => {
    if (!typeMap[tag.tagTypeId]) {
      typeMap[tag.tagTypeId] = {
        label: tag.tagTypeName,
        id: `type-${tag.tagTypeId}`,
        children: []
      }
    }
    typeMap[tag.tagTypeId].children!.push({
      label: tag.tagName,
      id: tag.id,
      ...tag
    })
  })
  return Object.values(typeMap)
}

// 通过orgid 去查对应的name
export function getNamesStringByOrgIdsOptimized( orgIds, separator = ',') {

    let treeData = []
    if(localStorage.getItem('selectListFactory')){
        treeData = JSON.parse(localStorage.getItem('selectListFactory'))
    }
    if (!orgIds || treeData.length === 0) {
        return '';
    }
    orgIds = orgIds.split(',')
    // 统一处理 orgIds，确保是数组形式
    const targetIds = Array.isArray(orgIds) ? orgIds : [orgIds];
    if (targetIds.length === 0) return '';

    // 统一转为字符串进行比较（避免数字和字符串不匹配）
    const idSet = new Set(targetIds.map(id => String(id).trim()));
    const names = [];

    const search = (nodes) => {
        for (const node of nodes) {
            const nodeId = String(node.orgId || '').trim();
            if (nodeId && idSet.has(nodeId)) {
                names.push(node.name);
                if (names.length === targetIds.length) return; // 找到所有目标后提前终止
            }
            if (node.children?.length) {
                search(node.children);
            }
        }
    };

    search(treeData);
    return names.join(separator);
}

// 获取已经启用的组织树
export const initTreeData =  () => {
    let treeData = [];
    const newTreeData = localStorage.getItem('selectListFactory')
        ? JSON.parse(localStorage.getItem('selectListFactory') as string)
        : [];
    recursionTree(newTreeData, treeData);
    return treeData;

};
const recursionTree = (oldArr, newArr) => {
    oldArr.forEach((item) => {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.children = [];
        if (item.children && item.children.length === 1 && !item.children[0].name) {
            item.children = [];
        }
        if (item.children && Array.isArray(item.children)) {
            recursionTree(item.children, newItem.children);
        }
        newArr.push(newItem);
    });
};


