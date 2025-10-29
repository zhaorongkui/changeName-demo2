   export interface authorizedRolesModel {
        id: number | string | null;
        code: string;
        name: string;
    }
   export interface UserModel {
        authorizedRoles: authorizedRolesModel[];
        name: string;
        avatar: string;
        createdAt: string;
        createdBy: string;
        email: string;
        employeeNo: string;
        expireAfter: string;
        id: string | number;
        idCard: string;
        mobile: string;
        orgId: string;
        orgs: any;
        password: string;
        remark: string;
        resources: any;
        roles: roleModel[];
        source: number;
        status: string | number;
        tenantId: string;
        title: string;
        updatedAt: string;
        updatedBy: string;
        username: string;
    }
   export interface roleModel {
        authorizedRoles?: authorizedRolesModel[] | null | [[]]; //授权的下级角色ID，创建、更新角色时由客户端传往服务端。
        code?: string | null; //角色唯一CODE代码
        createdAt?: string; //创建人
        createdBy?: string; //创建时间
        groupId: number | null; //分组id
        groupName: string; //分组名。查询返回用；新建或更新时不用填。
        groupOrder?: number; //组排序字段。查询返回用；新建或更新时不用填。
        icon?: string; //图标
        iconStyle?: string; //图标样式
        id?: string | number | null; //角色id
        name: string; //角色名称
        ordering?: number; //排序
        remark: string; //角色介绍
        source: number | string; //角色来源，1内置，2自定义
        status: number; //状态，1：启用，2：停用
        tenantId?: string; //租户ID
        type: number | string; //角色类型，1普通角色，2子管理员，3超级管理员
        updatedAt?: string; //更新人
        updatedBy?: string; //更新时间
    }
   export interface roleGroupModel {
        id?: number;
        name: string | number;
        ordering: number;
        roles: roleModel[];
        source: number | string | null;
        tenantId: string | null;
        isMoveOn?: boolean;
        disabled?: boolean;
    }

   export interface roleGrantedModel {
        desc: string;
        grantedRoles: authorizedRolesModel[];
    }

   export interface userMenuModel {
        id: number | string | null;
        name: string;
        displayName: string;
        path: string;
        type: number; //1：菜单，2：标签页，3：按钮，4：字段
        code: string;
        parentId: number | string | null;
        children?: userMenuModel[];
    }

   export interface userModules {
        id: string | number | null;
        name: string;
        permissionList: permissionListModel[];
    }

   export interface authModel {
        id: string | number | null;
        name: string;
        checked: boolean;
    }
   export interface permissionListModel {
        id: string | number | null;
        menuName: string; //中文名字
        name: string; //英文名字
        menuChecked: boolean;
        authChecked: boolean;
        authList: authModel[];
    }
