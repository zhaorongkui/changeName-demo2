/**
 * 模型广场 类型定义
 */
/**
 * 获取模型广场列表接口参数定义
 */
// 定义查询参数类型
export interface ModelListParams {
    currentPage?: number;
    pageSize?: number;
    name?: string;
    datasetType?: string;
    modelName?: string;
    modelPublic?: string;
    modelType?: string;
    scene?: string;
    id?: string | number;
    sort:number,
    releaseStatus?: number,
    applicableScenario?: string,
    orgId?: number | string,
    tagId?: number | string,
    deployStatus?: number | string,
}
//  模型广场列表单个item定义
export interface ModelInfo {
    id?: string | number;
    modelName?: string;
    modelType?: string;
    createdAt?: string;
    publicAtatus?: string;
    owner?: string;
    last_updated?: string;
    developLanguage?: string;
    applicableScenario?: string;
    algorithmArchitecture?: string;
    trial_count?: number;
    modelId?: string;
    modelVersion?: string;
    versionAlias?: string;
    published_version?: string;
    versionCount?: number;
    modelCreator?: string;
    deploymentStatus?: string;
    approvalStatus?: string;
    applicationTime?: string;
    runTime?: string;
    runCount?: number;
    inferenceLatency?: number;
    memoryUsage?: number;
    bestAccuracy?: number;
    avgAccuracy?: number;
    squaredError?: string;
    taskName?: string;
    taskType?: string;
    framework?: string;
    taskStatus?: string;
    taskDuration?: string;
    taskCreateTime?: string;
    process_type?: string;
    facility_type?: string[];
    equipment_type?: string;
    other_restrictions?: string;
    performance_metrics?: PerformanceMetrics;
    runtime_environment?: RuntimeEnvironment;
    notes?: string;
    tagType: MyObject //标签
    assetsList: AssetItem[] //关联数据集
}
// 关联的数据集
interface AssetItem {
    name: string;
    imgUrl: string;
    updateUser: string;
    updateTime: string;
}
// 关联的标签
interface MyObject {
    tagType: {
        tags: Array<{
            tagName: string;
            imgUrl: string | null;
        }>;
    };
}
// 列表子接口定义
export interface PerformanceMetrics {
    inference_latency?: string;
    accuracy?: string;
    mean_squared_error?: number;
}
// 列表子接口定义
export interface RuntimeEnvironment {
    python_version?: string;
    framework?: string;
    hardware_recommendation?: string;
    dependencies?: {
        tensorflow?: string;
        keras?: string;
        pandas?: string;
    };
}

// 分页信息
export interface TableConfig {
    settingTable: boolean;
    tableId: string;
    height: string;
    paginationConfig: PaginationConfig;
    rowKey: string;
    maxHeight?: string | number;
}
// 定义子接口
export interface PaginationConfig {
    total: number
    currentPage: number
    pageSize: number
}
// 模型广场搜索条件
export interface FormData {
    name: string;   // 模型名称
    publicStatus: string; // 模型公开状态
    modelType: string;   // 模型类型
    applicableScenario: string;       // 场景
}
// 模型广场新增关联数据集搜索条件
export interface FormDataSet {
    businessDimension?: string;   // 业务维度
    dataType?: string; // 分类
    name: string;       // 数据集名称
    ldmName?: string
}
// 模型广场新增模型-新增关联数据集列表
export interface DataTableItem {
    dataSetID: string;           // 数据集ID，如 'DS005'
    dataSetName: string;         // 数据集名称，如 '污水厂出水水质检测数据集202X'
    dataSetScale: string;        // 数据规模，如 '9,800条记录'
    businessObject: string;      // 业务对象，如 '出水处理'
    organizationsDimensions: string; // 组织维度/单位，如 '余杭四期污水处理厂'
    timeRange: string;           // 时间范围，如 '2021/01/01-2023/12/31'
}
// 获取右侧模型广场列表接口参数
export interface ModelPageParams {
    currentPage: number;
    pageSize: number;
    modelName: string;
    modelPublic: string;
    modelType: string;
    scene: string;
    id?: string | number;
}
//
export interface RawTag {
    id: number
    tagName: string
    tagTypeId: number
    tagTypeName: string
    [key: string]: any
}

export interface TreeNode {
    label: string
    id: string | number
    children?: TreeNode[]
    [key: string]: any
}
