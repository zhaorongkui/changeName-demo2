/*
 * @Description:分页接口返回
 */
declare global {
  interface PageResult<T> {
    total: number;
    size: number;
    current: number;
    pages: number;
    records: T[];
  }

  // 选项
  interface OptionItem<T = unknown> {
    value: unknown;
    label: string;
    data?: T;
  }

  interface AnyObj {
    [key: string]: unknown;
  }

  interface DropDownItem {
    command: string; //dropDownItem操作命令
    name: string; //dropDownItem显示字段
    permissionKey?: string; //dropDownItem权限key
  }

  interface treeNode {
    [keys: string]: string | number | any | null;
    label: string;
    handleOptions: DropDownItem[];
  }
  interface TableColumnItem<T = any> {
    type?: string;
    label?: string;
    prop?: string;
    width?: string;
    minWidth?: number;
    slot?: string;
    align?: string; //center | left | right
    sortable?: boolean | 'custom'; //列是否可以排序，如果设置为‘custom’，表示用户希望远程排序，需要监听表格的‘sort-change’事件
    fixed?: boolean | 'left' | 'right';
    format?: string | ((row: T) => string); // 明确函数签名：接收当前行数据，返回字符串 html 片段
    showOverflowTooltip?: boolean; //当内容过长被隐藏时显示 tooltip，默认为 true
    buttons?: (row?: any) => ButtonItem[] | null[];
    children?: TableColumnItem<T>[]; // 配置多级表头的数据集合, 具体用法可参考多级表头使用示例。
    search?: SearchModel;
  }
  interface ButtonItem {
    name: string;
    command: Command;
    code?: string;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | '';
    disabled?: boolean;
    children?: ButtonItem[];
  }
  interface SearchModel {
    type: string;
    label: string;
    paramKey: string;
    placeholder: string;
    modelValue: string;
    selectOptions: any[];
  }

  /**公共定义的属性名称是任意的普通对象**/
  interface AnyObj {
    [key: string]: any;
  }

  interface FileListVo {
    name?: string;
    url: string;
    fileId: number;
  }
}
