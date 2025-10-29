import { EnumValue } from '@/utils/enum';
import projectEnv from '@/config/runtimeEnv.js'
// 组织状态 / 任务模版状态
export const ORG_STATUS = [
  { value: '1', label: '启用' },
  { value: '2', label: '停用' },
];
// 组织类型
export const ORG_TYPE = [
  { value: 1, label: '机构' },
  { value: 2, label: '部门' },
];

// 组织层级
export const ORG_LEVEL = [
  { value: '1', label: '集团' },
  { value: '2', label: '大区' },
  { value: '3', label: '区域公司/业务区' },
  { value: '4', label: '水厂' },
];

// 部门性质
export const DEPT_TYPE = [
  { value: '1', label: '管理性' },
  { value: '2', label: '生产性' },
  { value: '3', label: '劳务性' },
  { value: '4', label: '研发性' },
  { value: '5', label: '销售性' },
];

// 组织来源
export const ORG_SOURCE = [
  { value: 1, label: '系统组织' },
  { value: 2, label: '第三方组织' },
];


export const TOOLTIP_SHOW_AFTER = 800;
// 抽屉宽度
export const EL_DRAWER_WIDTH = 400;
export const TABLE_LIST_PAGE_RANGE = [10, 20, 50, 100];

export const  reviewStatus = [
  { id: 'null', name: '全部' },
  { id: '1', name: '审核中' },
  { id: '2', name: '已通过' },
  { id: '3', name: '已驳回' },
  { id: '4', name: '已下架' }
]

export const modelApplicableOptions = [
    {
        "value": "process",
        "label": "污水处理工艺",
        "children": [
            { "value": "a2o", "label": "A2O工艺" },
            { "value": "oxidation_ditch", "label": "氧化沟工艺" },
            { "value": "sbr", "label": "SBR工艺" },
            { "value": "mbr", "label": "MBR膜工艺" }
        ]
    },
    {
        "value": "equipment",
        "label": "污水处理设备",
        "children": [
            { "value": "blower", "label": "曝气风机" },
            { "value": "do_meter", "label": "DO溶解氧仪" },
            { "value": "sludge_pump", "label": "污泥回流泵" },
            { "value": "scraper", "label": "刮泥机" }
        ]
    },
    {
        "value": "facility",
        "label": "污水处理设施",
        "children": [
            { "value": "aeration_tank", "label": "曝气池" },
            { "value": "sedimentation_tank", "label": "沉淀池" },
            { "value": "sludge_thickener", "label": "污泥浓缩池" },
            { "value": "disinfection_pool", "label": "消毒池" }
        ]
    },
    {
        "value": "monitor",
        "label": "监测仪表",
        "children": [
            { "value": "ph_meter", "label": "PH计" },
            { "value": "cod_analyzer", "label": "COD在线分析仪" },
            { "value": "turbidity_meter", "label": "浊度仪" },
            { "value": "ammonia_meter", "label": "氨氮分析仪" }
        ]
    }
]
// 机器学习模型二级分类
export const subcateGoryOptions = [
    {
        value: '1',
        label: '回归',
    },
    {
        value: '2',
        label: '分类',
    },
    {
        value: '3',
        label: '排序',
    },
]
// 智能体模型二级分类
export const agentSubcateGoryOptionso = [
    {
        value: '1',
        label: '工作流',
    },
    {
        value: '2',
        label: 'Chatflow',
    },
    {
        value: '3',
        label: '聊天助手',
    },
    {
        value: '4',
        label: 'Agent',
    },
    {
        value: '5',
        label: '文本生成应用',
    },
]

//获取当前baseUrl /ms
export const getBaseUrl  = () =>{
    return   projectEnv.VITE_USER_NODE_ENV == 'development' ? '/ms' :  '/api/v1/ms'
}
