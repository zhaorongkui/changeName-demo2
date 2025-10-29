
export interface TableDataItem {
  /**
   * 模型ID
   */
  modelId: string
  /**
   * 模型名称
   */
  modelName: string
  /**
   * 运行时间
   */
  runTime: string
  /**
   * 运行次数
   */
  runCount: number
  /**
   * 推理延迟(ms)
   */
  inferenceLatency: number
  /**
   * 内存占用(MB)
   */
  memoryUsage: number
  /**
   * 准确率（最好）
   */
  bestAccuracy: number
  /**
   * 准确率（平均）
   */
  avgAccuracy: number
  /**
   * 均方误差（MSE/RMSE）
   */
  squaredError: string | null
    region: string
    visibility:string
    language: string
}

export const mockTableData: TableDataItem[] = 
  [
  {
    "modelId": "MODEL_001",
    "modelName": "A2O外回流比推理模型",
    "runTime": "2025-08-15 09:30",
    "runCount": 720,
    "inferenceLatency": 85,
    "memoryUsage": 768,
    "bestAccuracy": 0.956,
    "avgAccuracy": 0.942,
    "squaredError": "0.038 (RMSE)",
    "region": "华东业务区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_002",
    "modelName": "进水水质异常检测模型",
    "runTime": "2025-08-10 14:20",
    "runCount": 420,
    "inferenceLatency": 65,
    "memoryUsage": 512,
    "bestAccuracy": 0.968,
    "avgAccuracy": 0.951,
    "squaredError": "0.029 (RMSE)",
    "region": "云服",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_003",
    "modelName": "二沉池污泥界面高度检测",
    "runTime": "2025-08-18 11:15",
    "runCount": 680,
    "inferenceLatency": 110,
    "memoryUsage": 1024,
    "bestAccuracy": 0.923,
    "avgAccuracy": 0.912,
    "squaredError": "0.051 (RMSE)",
    "region": "通用",
    "visibility": "计算机视觉模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_004",
    "modelName": "污泥沉降比智能识别系统",
    "runTime": "2025-08-12 10:45",
    "runCount": 320,
    "inferenceLatency": 95,
    "memoryUsage": 896,
    "bestAccuracy": 0.941,
    "avgAccuracy": 0.932,
    "squaredError": "0.042 (RMSE)",
    "region": "华北大区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_005",
    "modelName": "MBR膜污染预测模型",
    "runTime": "2025-08-16 13:10",
    "runCount": 760,
    "inferenceLatency": 78,
    "memoryUsage": 832,
    "bestAccuracy": 0.952,
    "avgAccuracy": 0.945,
    "squaredError": "0.036 (RMSE)",
    "region": "华南业务区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_006",
    "modelName": "曝气量优化控制模型",
    "runTime": "2025-08-14 16:30",
    "runCount": 450,
    "inferenceLatency": 82,
    "memoryUsage": 704,
    "bestAccuracy": 0.947,
    "avgAccuracy": 0.938,
    "squaredError": "0.041 (RMSE)",
    "region": "西部大区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_007",
    "modelName": "污泥脱水加药量预测",
    "runTime": "2025-08-17 08:50",
    "runCount": 230,
    "inferenceLatency": 58,
    "memoryUsage": 640,
    "bestAccuracy": 0.961,
    "avgAccuracy": 0.954,
    "squaredError": "0.032 (RMSE)",
    "region": "华中业务区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_008",
    "modelName": "生物池微生物群落分析",
    "runTime": "2025-08-11 15:25",
    "runCount": 720,
    "inferenceLatency": 125,
    "memoryUsage": 1152,
    "bestAccuracy": 0.935,
    "avgAccuracy": 0.926,
    "squaredError": "0.047 (RMSE)",
    "region": "云服",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_009",
    "modelName": "出水总磷预测预警系统",
    "runTime": "2025-08-13 10:15",
    "runCount": 230,
    "inferenceLatency": 67,
    "memoryUsage": 576,
    "bestAccuracy": 0.958,
    "avgAccuracy": 0.949,
    "squaredError": "0.035 (RMSE)",
    "region": "东部大区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  },
  {
    "modelId": "MODEL_010",
    "modelName": "污水厂能耗优化模型",
    "runTime": "2025-08-19 09:00",
    "runCount": 340,
    "inferenceLatency": 92,
    "memoryUsage": 960,
    "bestAccuracy": 0.943,
    "avgAccuracy": 0.934,
    "squaredError": "0.044 (RMSE)",
    "region": "全国业务区污水厂",
    "visibility": "未公开模型",
    "language": "Python"
  }
]