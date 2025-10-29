
// 处理权限数据，将树形结构转为list数组，所有的菜单都转换为同一个基本，只是区分菜单的功能按钮\
import { getMenuAll } from '@/api/menu';
import { getRoleMenusApi } from '@/api/role';
import type { Resource } from '~/types/org';
import type { roleModel } from '@/types/user';

let rolePersissionList: any[] = [];

//获取角色的菜单
export async function getRoleMenus(id: number | string) {
  const result = await getRoleMenusApi(id);
  if (result && result.success) {
    rolePersissionList = result.data;
  }
}

// 获取用户的菜单
export async function getUserAllMenus() {
  let userModulesPC = [];
  const result = await getMenuAll({});
  if (result && result.success) {
    userModulesPC = result.data.PC.map((item: Resource) => {
      const permissionDataListPC = [];
      permissionTreeToList(permissionDataListPC, item.children ? item.children : []);
      return {
        id: item.id,
        name: item.displayName,
        permissionList: permissionDataListPC,
      };
    });
  }
    console.log('userModulesPC-----',userModulesPC)
  return {
    userModulesPC,
  };
}
function permissionTreeToList(permissionDataList, children: Resource[]) {
  children.forEach((item: Resource) => {
    const newObj = {
      id: item.id,
      menuName: item.displayName,
      name: item.name,
      menuChecked: isHasCheckCurrentNode(item.id),
      authChecked: false,
      authList: [],
    };
    if (
      item.code === 'settings:info:factory:list' ||
      item.code === 'config:role:list' ||
      item.code === 'config:org:list'
    ) {
      //单独处理水厂配置，水厂配置i中，编辑和完善水厂信息，type为3，behavior为route,导致编辑和完善水厂信息都作为菜单显示，特殊处理，编辑显示在水厂配置菜单下
      //组织管理 授权用户 和角色管理 授权用户，应该显示在组织管理 角色管理的菜单下，单独处理
      item.children!.forEach((auth: Resource) => {
        if (auth.code !== 'settings:info:factory:create') {
          newObj.authList.push({
            id: auth.id,
            name: auth.displayName,
            checked: isHasCheckCurrentNode(auth.id),
          });
        }
      });
    } else {
      if (item.children) {
        item.children.forEach((auth: Resource) => {
          if (auth.type == 3) {
            newObj.authList.push({
              id: auth.id,
              name: auth.displayName,
              checked: isHasCheckCurrentNode(auth.id),
            });
          }
        });
      }
    }
    if (
      newObj.authList.length === 0 ||
      newObj.authList.filter((auth) => {
        return auth.checked === false;
      }).length > 0
    ) {
      newObj.authChecked = false;
    } else {
      newObj.authChecked = true;
    }
    if (
      item.code !== 'settings:info:factory:update' &&
      item.code !== 'settings:org:grant' &&
      item.code !== 'config:role:grant' &&
        item.type !== 3
    ) {
      permissionDataList.push(newObj);
    }
    if (item.children) {
      permissionTreeToList(permissionDataList, item.children);
    }
  });
}
export function isHasCheckCurrentNode(id: string | number | null) {
  const arr = rolePersissionList.filter((item: any) => {
    return item.id === id;
  });
  if (arr.length > 0) {
    return true;
  } else {
    return false;
  }
}
// 将一个角色放到最前面 ，找到组中最小的排序，置为当前角色的排序号，其他角色的排序+1,实现相对排序即可，无需顺序排序
export function changeRoleOrdering_toTop(roles: roleModel[], currentRole: roleModel) {
  // 如果当前角色的排序是最小值，无需置顶
  roles = roles.map((item: roleModel, index: number) => {
    item.ordering = index;
    return item;
  });
  if (currentRole.ordering === 0) {
    return null;
  } else {
    return roles.map((item: roleModel) => {
      if (currentRole.id === item.id) {
        item.ordering = 0;
      } else {
        item.ordering = item.ordering! + 1;
      }
      return item;
    });
  }
}
// 将一个角色放到最后面，找到组中最大的+1，赋值给当前角色的排序号，其他角色的排序不动
export function changeRoleOrdering_toBottom(roles: roleModel[], currentRole: roleModel) {
  roles = roles.map((item: roleModel, index: number) => {
    item.ordering = index;
    return item;
  });
  // 如果当前角色的排序是最大值，无需置底
  if (currentRole.ordering === roles.length - 1) {
    return null;
  } else {
    return roles.map((item: roleModel) => {
      if (currentRole.id === item.id) {
        item.ordering = roles.length;
      }
      return item;
    });
  }
}
// 上移角色 ： 找到当前角色的排序，如果当前角色的排序为0，则不执行，否则和上一个角色换排序号
export function changeRoleOrdering_toLast(roles: roleModel[], currentRole: roleModel) {
  roles = roles.map((item: roleModel, index: number) => {
    item.ordering = index;
    return item;
  });
  if (currentRole.ordering !== 0) {
    const currentRoleOrdering = currentRole.ordering;
    return roles.map((item: roleModel, index: number) => {
      if (index + 1 === currentRoleOrdering && currentRole.id !== item.id) {
        item.ordering = item.ordering! + 1;
      }
      if (currentRole.id === item.id) {
        item.ordering = item.ordering! - 1;
      }
      return item;
    });
  } else {
    return null;
  }
}
// 下移角色
export function changeRoleOrdering_toNext(roles: roleModel[], currentRole: roleModel) {
  roles = roles.map((item: roleModel, index: number) => {
    item.ordering = index;
    return item;
  });
  const maxOrdering = roles[roles.length - 1].ordering;
  // 如果当前角色，在最后面，无需下移
  const currentRoleOrdering = currentRole.ordering;
  if (currentRole.ordering !== maxOrdering) {
    return roles.map((item: roleModel, index: number) => {
      if (index - 1 === currentRoleOrdering && currentRole.id !== item.id) {
        item.ordering = item.ordering! - 1;
      }
      if (currentRole.id === item.id) {
        item.ordering = item.ordering! + 1;
      }
      return item;
    });
  } else {
    return null;
  }
}
