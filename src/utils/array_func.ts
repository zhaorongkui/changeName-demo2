/*
 * @Description: 将数组转成树形结构
 */
import type { Organization, Resource } from '@/types/org';
export const tranListToTreeData = (list: any[], rootValue: string = '0') => {
    // 首先创建所有节点的映射，保留原始children结构
    const nodeMap = new Map<string, any>();
    list.forEach(item => {
        // 保留原有的children结构（如果存在）
        const children = item.children || [];
        nodeMap.set(item.id, { ...item, children });
    });

    // 构建树结构
    const tree: any[] = [];
    const handledIds = new Set<string>();

    // 先处理顶级节点
    list.forEach(item => {
        if (item.parentId === rootValue) {
            tree.push(nodeMap.get(item.id));
            handledIds.add(item.id);
        }
    });

    // 然后处理其他节点（先尝试parentId，再尝试grandfatherId）
    list.forEach(item => {
        if (!handledIds.has(item.id)) {
            let parent = null;

            // 首先尝试通过 parentId 查找父节点
            if (item.parentId) {
                parent = nodeMap.get(item.parentId);
            }

            // 如果 parentId 匹配不到，尝试通过 grandfatherId 查找
            if (!parent && item.grandfatherId) {
                parent = nodeMap.get(item.grandfatherId);
            }

            if (parent) {
                // 确保 parent 有 children 数组
                if (!parent.children) {
                    parent.children = [];
                }

                // 检查是否已经存在于children中（避免重复添加）
                if (!parent.children.some((child: any) => child.id === item.id)) {
                    parent.children.push(nodeMap.get(item.id));
                }
                handledIds.add(item.id);
            }
        }
    });

    // 添加button类型的route到children中
    const buttonRoutes = list.filter(item =>
        item.behavior === 'route' && item.type !== 1
    );

    tree.forEach(rootNode => {
        if (!rootNode.children) {
            rootNode.children = [];
        }
        buttonRoutes.forEach(btn => {
            if (btn.parentId === rootNode.id &&
                !rootNode.children.some((child: any) => child.id === btn.id)) {
                rootNode.children.push(btn);
            }
        });
    });

    return tree;
};

// 递归修改树结构的每一个节点
export const setListAttr = (list, key = 'children') => {
  //判断list是否是数组
  if (!Array.isArray(list)) {
    return null;
  }
  list.forEach((item) => {
    item.leaf = true;
    if (item[key]?.length > 0) {
      item.leaf = false;
      setListAttr(item[key], key);
    }
  });
  return list;
};

// 递归控制树结构是否显示
export const getStatusTree = (data, newTreeData) => {
  data.forEach((item) => {
    if (item.iotStatus === 1) {
      const newItem = {
        factoryNo: item.factoryNo,
        code: item.code,
        thirdCode: item.thirdCode,
        iotStatus: item.iotStatus,
        status: item.status,
        name: item.name,
        orgId: item.orgId,
        children: [],
      };
      if (item?.children?.length > 0 && !item.factoryNo) {
        getStatusTree(item.children, newItem.children);
      }
      if (item.factoryNo) {
        newItem.children = [
          {
            factoryNo: '',
            code: '',
            thirdCode: '',
            name: '',
            orgId: '',
            children: [],
          },
        ];
      }
      newTreeData.push(newItem);
    }
  });
};

// 根据ID查询节点
export const getObjById = (list, id, key = 'orgId') => {
  //判断list是否是数组
  if (!Array.isArray(list)) {
    return null;
  }
  //遍历数组
  for (const i in list) {
    const item = list[i];
    if (item[key] === id) {
      return item;
    } else {
      //查不到继续遍历
      if (item.children) {
        const value = getObjById(item.children, id, key);
        //查询到直接返回
        if (value) {
          return value;
        }
      }
    }
  }
};

// 查找某一节点及其下的所有子节点
export const getTargetChildren = (tree, returnValue: any[] = []) => {
  for (const i of tree) {
    //把元素都存入returnValue
    returnValue.push(i);
    if (i?.children) {
      getTargetChildren(i.children, returnValue);
    }
  }
  return returnValue;
};

// 获取展示路由
export const generateNavs = (obj: PlantRouteRecordRaw, groupName: string) => {
    if (obj.children) {
        obj.children = obj.children?.filter((t) => {
            const is403Route = t.path === '/403';
            return !is403Route ; // 仅排除 403 和 isBack
        });
        obj.children.forEach((t) => {
            generateNavs(t, groupName);
        });
    }
};

// 树形结构转换为数组list
export const treeToArray = (tree: Organization[], returnValue: Organization[] = []) => {
  for (const i of tree) {
    returnValue.push(i);
    if (i.children) {
      treeToArray(i.children, returnValue);
    }
  }
  return returnValue;
};

// 过滤树形结构中 name 不存在的节点（name 为空字符串、null、undefined 均过滤）
export const filterTreeByValidName = (tree)=> {
    // 若传入的不是数组，直接返回空数组（避免异常）
    if (!Array.isArray(tree)) return [];

    // 遍历每个节点，筛选并处理子节点
    return tree.reduce((validNodes, node) => {
        // 1. 判断当前节点的 name 是否有效
        const isNodeValid = node.name !== '' && node.name != null;
        if (!isNodeValid) return validNodes; // 无效节点不保留

        // 2. 递归过滤当前节点的 children（仅保留 children 中的有效节点）
        const validChildren = filterTreeByValidName(node.children || []);

        // 3. 保留当前节点，并更新其 children 为过滤后的结果
        validNodes.push({
            ...node, // 复制原节点的所有属性
            children: validChildren // 替换为过滤后的子节点
        });

        return validNodes;
    }, []);
}
