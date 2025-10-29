# be-formula-editor

> ⚠️ 注意：目前仅支持 Vue3, 此分支为定制版本，不可进行前端计算，[通用版本](https://gitlab.bewg-devops.com/dev/bewg-saas/sed-saas/formula-editor/-/tree/formula-v1.0.0)

## 安装依赖

```javascript
npm install --force be-formula-editor@1.1.0 -S --registry https://nexus.bewg.net.cn/repository/npm-group-bewg/
```

## 使用方式

```javascript
import { FormulaEditor } from 'be-formula-editor'
import 'be-formula-editor/dist/index.css'
```

> 主要导出对象

- `FormulaEditor`组件

### FormulaEditor组件 Props 参数说明

| 参数      | 说明     | 类型  | 可选值 | 默认值 |
| --------- | -------- | ----- | ------ | ------ |
| fieldList | 表单字段 | Array | 必填   | -      |

#### fieldList 数据格式

```javascript
;[
  {
    name: '名称',
    enCode: 'name',
    children: '子项',
  },
]
```

### FormulaEditor组件 Methods 方法说明

| 方法名     | 说明             | 参数                                                                              |
| ---------- | ---------------- | --------------------------------------------------------------------------------- |
| getData    | 获取公式编辑配置 | 无                                                                                |
| renderData | 设置数据回显     | `{ text: string; marks: CodemirrorMarksVo[],params:{params1:XXX,params2:"XXX"} }` |
| reset      | 重置公式编辑器   | 无                                                                                |
