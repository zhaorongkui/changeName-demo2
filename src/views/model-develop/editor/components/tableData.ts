// 表格数据接口定义
export interface TableDataItem {
    id: string | number
    dataSetID: string
    dataSetName: string
    organizationsDimensions: string
    timeFrame: string
    dataSetScale?: string,
    businessObject: string,
}
// 表格数据接口定义
export interface TableDataVersionItem {
    id: string | number
    version:string
    versionAlias: string
    versionState: string | number
    versionDescribe: string
    deploymentStatus: string
    createdAt: string
    lastUpdated: string
    modelType: string
    developLanguage: string
}
// 模拟的数据集表格数据
export const mockTableData: TableDataItem[] = [
    {
        id: '1001',
        dataSetID: 'DS005',
        dataSetName: '污水厂出水水质检测数据集202X',
        dataSetScale:'9,800条记录',
        businessObject: '出水处理',
        organizationsDimensions: '余杭四期污水处理厂',
        timeFrame: '2021/01/01-2023/12/31',
    },
    {
        id: '1002',
        dataSetID: 'DS002',
        dataSetName: '污水厂污泥处理过程数据集202',
        dataSetScale:'8,500条记录',
        businessObject: '污泥处理',
        organizationsDimensions: '余杭四期污水处理厂',
        timeFrame: '2021/01/01-2023/12/31',
    },
    {
        id: '1003',
        dataSetID: 'DS001',
        dataSetName: '污水厂曝气系统运行数据集202X',
        dataSetScale:'10,000条记录',
        businessObject: '曝气系统',
        organizationsDimensions: '余杭四期污水处理厂',
        timeFrame: '2020/01/01-2023/12/31',
    },
    {
        id: '1004',
        dataSetID: 'DS004',
        dataSetName: '污水厂生物反应池参数数据集202X',
        dataSetScale:'12,000条记录',
        businessObject: '生物反应池',
        organizationsDimensions: '余杭四期污水处理厂',
        timeFrame: '2020/01/01-2023/12/31',
    },
    {
        id: '1005',
        dataSetID: 'DS003',
        dataSetName: '污水厂进水水质监测数据集202X',
        organizationsDimensions: '余杭四期污水处理厂',
        businessObject: '进水预处理',
        dataSetScale:'15,000条记录',
        timeFrame: '2020/01/01-2022/12/31',
    },

]

// 模拟的版本管理表格数据
export const mockVersionTableData: TableDataVersionItem[] = [
  {
    "id": "1001",
    "version": "v1版本",
    "versionAlias": "svr模型1",
    "versionState": "1",//版本状态
      deploymentStatus:'1',//部署状态
    "versionDescribe": "A2O外回流比基础推理模型，采用传统机器学习算法",
      developLanguage:'Python',//编程语言
      modelType:'公开模型',
    "createdAt": "2024-01-01 00:00:00",
    "lastUpdated": "2024-01-01 00:00:00"
  },
    {
        "id": "1001",
        "version": "v1版本",
        "versionAlias": "svr模型2",
        "versionState": "1",//版本状态
        deploymentStatus:'1',//部署状态
        "versionDescribe": "A2O外回流比基础推理模型，采用传统机器学习算法",
        developLanguage:'Python',//编程语言
        modelType:'公开模型',
        "createdAt": "2024-01-01 00:00:00",
        "lastUpdated": "2024-01-01 00:00:00"
    },
    {
        "id": "1001",
        "version": "v1版本",
        "versionAlias": "svr模型3",
        "versionState": "2",//版本状态
        deploymentStatus:'2',//部署状态
        "versionDescribe": "A2O外回流比基础推理模型，采用传统机器学习算法",
        developLanguage:'Python',//编程语言
        modelType:'公开模型',
        "createdAt": "2024-01-01 00:00:00",
        "lastUpdated": "2024-01-01 00:00:00"
    },
    {
        "id": "1001",
        "version": "v1版本",
        "versionAlias": "svr模型4",
        "versionState": "2",//版本状态
        deploymentStatus:'3',//部署状态
        "versionDescribe": "A2O外回流比基础推理模型，采用传统机器学习算法",
        developLanguage:'Python',//编程语言
        modelType:'公开模型',
        "createdAt": "2024-01-01 00:00:00",
        "lastUpdated": "2024-01-01 00:00:00"
    },


]
