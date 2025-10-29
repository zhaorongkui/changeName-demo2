/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-31 09:55:52
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-01 11:31:06
 * @FilePath: \model-sandbox-frontend\src\views\model-management\editor\utils\executeUtils.ts
 * @Description: 运行模型
 * */

const timeout = 500 // 模拟延时，单位为毫秒

type nodeStatus = 'default' | 'success' | 'failed' | 'running'

// 定义执行结果类型
interface ExecuteResult {
  status: 'success' | 'failed'
  data: any
  nextNode?: any
}

interface NodeAttribute {
  id: string
  status: nodeStatus
  label?: string
}

/**
 * 过滤没有输入线的节点
 * @param graph - 图实例
 * @param nodes - 节点数组
 * @returns 过滤后的节点数组
 */
const filterWithoutIncoming = (graph, nodes) => {
  return nodes.filter((node) => {
    const incoming = graph.getIncomingEdges(node)
    return !incoming || incoming.length === 0
  })
}
/**
 * 获取对应类型的节点
 */
const getNodesByType = (nodes, type) => {
  return nodes.filter((node) => node.getData().type === type)
}
/**
 * 重置节点状态
 */
export const resetNodeStatus = (graph) => {
  const nodes = graph.getNodes()
  nodes.forEach((node) => {
    node.setData({ ...node.getData(), status: 'default' })
  })
}
/**
 * 更新节点状态
 */
const updateNodeStatus = (graph, node, status: nodeStatus) => {
  node.setData({ ...node.getData(), status })
  // 更新节点 输入线的 效果
  graph.on('node:change:data', ({ node }) => {
    const incomingEdges = graph.getIncomingEdges(node)
    // console.log('🚀 ~ executeUtils.ts ~ useExecuteModel ~ incomingEdges:', incomingEdges)
    const { status } = node.getData()
    if (incomingEdges?.length) {
      incomingEdges?.forEach((edge) => {
        if (status === 'running') {
          edge.attr('line/strokeDasharray', 5)
          edge.attr('line/style/animation', 'running-line 30s infinite linear')
        } else {
          edge.attr('line/strokeDasharray', '')
          edge.attr('line/style/animation', '')
        }
      })
    }
  })
}
/**
 * 节点进行中
 */
const setNodeRunning = (graph, node) => {
  updateNodeStatus(graph, node, 'running')
}
/**
 * 节点完成
 */
const setNodeCompleted = (graph, node) => {
  updateNodeStatus(graph, node, 'success')
}
/**
 * 节点失败
 */
const setNodeFailed = (graph, node) => {
  updateNodeStatus(graph, node, 'failed')
}

/**
 * 获取当前节点的下一个节点
 */
const getNextNode = (graph, node) => {
  const outgoingEdges = graph.getOutgoingEdges(node)
  if (outgoingEdges?.length) {
    const nextEdge = outgoingEdges[0]
    return graph.getCellById(nextEdge.getTargetCellId())
  }
  return null
}

/**
 * 执行节点
 */
const executeNode = (graph, node) => {
  setNodeRunning(graph, node)
  executeEvent(graph, node)
    .then((result) => {
      console.log('执行结果:', result)
      const { nextNode, status } = result
      if (status === 'failed') {
        setNodeFailed(graph, node)
        return
      }
      if (nextNode) {
        // 模拟执行逻辑
        setTimeout(() => {
          setNodeCompleted(graph, node)
          executeNode(graph, nextNode) // 递归执行下一个节点
        }, timeout) // 模拟延时
      } else {
        setNodeCompleted(graph, node) // 如果没有下一个节点，标记为完成
      }
    })
    .catch((error) => {
      setNodeFailed(graph, node) // 执行失败，标记为失败
    })
}

/**
 * 执行事件
 */
const executeEvent = (graph, node): Promise<ExecuteResult> => {
  return new Promise(async (resolve, reject) => {
    const type = node.getData().type
    let result: ExecuteResult = null
    switch (type) {
      case 'params-input':
        result = await inputEvent(graph, node)
        break
      case 'condition':
        result = await conditionEvent(graph, node)
        break
      case 'calculation':
        result = await calculateEvent(graph, node)
        break
      case 'params-output':
        result = await outputEvent(graph, node)
        break
      default:
        console.warn(`未处理的节点类型: ${type}`)
        reject(new Error(`未处理的节点类型: ${type}`))
    }
    resolve(result)
  })
}

const inputEvent = (graph, node): Promise<ExecuteResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'success', data: { input: 'input data' }, nextNode: getNextNode(graph, node) })
    }, timeout)
  })
}

const conditionEvent = (graph, node): Promise<ExecuteResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const outgoingEdges = graph.getOutgoingEdges(node)
      console.log('🚀 ~ executeUtils.ts ~ conditionEvent ~ outgoingEdges:', outgoingEdges)
      let verdictEdge = null
      const judgeResult = Math.random() > 0.5
      console.log('🚀 ~ executeUtils.ts ~ conditionEvent ~ judgeResult:', judgeResult)
      if (judgeResult) {
        verdictEdge = outgoingEdges.find((edge) => edge.getData().type === 'verdict-Y')
      } else {
        verdictEdge = outgoingEdges.find((edge) => edge.getData().type === 'verdict-N')
      }

      resolve({
        status: 'success',
        data: { condition: 'condition met' },
        nextNode: graph.getCellById(verdictEdge.getTargetCellId())
      })
    }, timeout)
  })
}

const calculateEvent = (graph, node): Promise<ExecuteResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'success', data: { result: 'calculated result' }, nextNode: getNextNode(graph, node) })
    }, timeout)
  })
}

const outputEvent = (graph, node): Promise<ExecuteResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'success', data: { output: 'output data' } })
    }, timeout)
  })
}

/**
 *
 * @params graph
 * @returns
 */
export function useExecuteModel(graph, operatorArray) {
  const execute = () => {
    // 模拟运行模型逻辑
    const data = graph.toJSON() //返回一个具有 { cells: [] } 结构的对象，其中 cells 数组按渲染顺序保存节点和边。
    console.log('运行模型数据:', data)

    const nodes = graph.getNodes()
    console.log('🚀 ~ executeUtils.ts ~ execute ~ nodes:', nodes)

    resetNodeStatus(graph) // 重置所有节点状态
    // 获取没有输入线的节点
    const nodesWithoutIncoming = filterWithoutIncoming(graph, nodes)
    console.log('没有输入线的节点:', nodesWithoutIncoming)
    // 输入节点
    const inputNodes = getNodesByType(nodesWithoutIncoming, 'params-input')
    console.log('输入节点:', inputNodes)
    inputNodes.forEach((node) => {
      executeNode(graph, node)
    })
  }

  return {
    execute
  }
}
