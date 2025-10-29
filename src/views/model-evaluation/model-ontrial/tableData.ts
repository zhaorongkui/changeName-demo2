
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
    /**
     * 模型类型
     */
    modelType: string | number
}

export const mockTableData: TableDataItem[] = 
  [

]