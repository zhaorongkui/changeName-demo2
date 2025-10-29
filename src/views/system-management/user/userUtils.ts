/*
 * @Description:
 */
/*
 * @Description: 共用方法
 */
// 修改数据结构,适配通用组件
export function configOrgTreeData(treeNode: any) {
  if (treeNode.children) {
    treeNode.children = treeNode.children.map((item: any) => {
      configOrgTreeData(item);
      return {
        ...item,
        id: item.orgId,
      };
    });
  }
  return {
    ...treeNode,
    id: treeNode.orgId,
  };
}
