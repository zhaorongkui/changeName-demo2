export const validateConnection = (args, graph) => {
  console.log('validateConnection', args, graph)
  const { sourceCell, targetCell, sourceMagnet, targetMagnet } = args
  // 不能连接自身 只允许连接到下游节点
  if (sourceCell === targetCell) {
    return false
  }
  // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
  if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'top') {
    return false
  }
  if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'top') {
    return false
  }

  //   不能重复连线  这个待确定
  const edges = graph.getEdges()
  const portId = targetMagnet.getAttribute('port')
  if (edges.find((edge) => edge.getTargetPortId() === portId)) {
    return false
  }
  return true
}

/**
 * 判断图是否为DAG（有向无环图）
 */
export function isDAG(graph) {
  const nodes = graph.getNodes()
  const visited = new Set()
  const recStack = new Set()

  function dfs(node) {
    if (recStack.has(node.id)) return false // 有环，非DAG
    if (visited.has(node.id)) return true
    visited.add(node.id)
    recStack.add(node.id)
    const outgoingEdges = graph.getOutgoingEdges(node) || []
    for (const edge of outgoingEdges) {
      const targetId = edge.getTargetCellId()
      const targetNode = graph.getCellById(targetId)
      if (targetNode && !dfs(targetNode)) return false
    }
    recStack.delete(node.id)
    return true
  }

  for (const node of nodes) {
    if (!dfs(node)) return false
  }
  return true
}

/**
 * 校验只有一个参数输入节点且必须是参数获取节点开头
 */
export function validateSingleParamsInputStart(graph, cells) {
  const inputNodes = cells.filter((cell) => cell.getData?.()?.type === 'params-input')
  if (inputNodes.length !== 1) {
    return { valid: false, message: '必须且只能有一个参数输入节点' }
  }
  const inputNode = inputNodes[0]
  const inEdges = graph.getIncomingEdges(inputNode)
  if (inEdges && inEdges.length > 0) {
    return { valid: false, message: '参数输入节点必须作为起点（不能有入边）' }
  }
  return { valid: true }
}

/**
 * 校验至少有一个输出节点且所有终止节点必须是参数输出节点
 */
export function validateOutputEnd(graph, cells) {
  const outputNodes = cells.filter((cell) => cell.getData?.()?.type === 'params-output')
  if (outputNodes.length < 1) {
    return { valid: false, message: '至少需要一个输出节点' }
  }
  // 找到所有没有出边的节点（终止节点）
  const endNodes = cells.filter((cell) => {
    const outEdges = graph.getOutgoingEdges(cell)
    return !outEdges || outEdges.length === 0
  })
  // 所有终止节点必须是参数输出节点
  const allEndIsOutput = endNodes.every((node) => node.getData?.()?.type === 'params-output')
  if (!allEndIsOutput) {
    return { valid: false, message: '所有终止节点必须是参数输出节点' }
  }
  return { valid: true }
}

/**
 * 校验条件判断节点必须有两个出边，且类型分别为 dag-edge-verdict-Y 和 dag-edge-verdict-N
 */
export function validateConditionNodeEdges(graph, cells) {
  // 假设条件判断节点类型为 'condition'
  const conditionNodes = cells.filter((cell) => cell.getData?.()?.type === 'condition')
  for (const node of conditionNodes) {
    const outEdges = graph.getOutgoingEdges(node) || []
    if (outEdges.length !== 2) {
      return { valid: false, message: '条件判断节点必须有且只有两个出边' }
    }
    const edgeTypes = outEdges.map((edge) => edge.shape)
    if (!edgeTypes.includes('dag-edge-verdict-Y') || !edgeTypes.includes('dag-edge-verdict-N')) {
      return { valid: false, message: '条件判断节点的两个出边必须满足互斥关系' }
    }
  }
  return { valid: true }
}

/**
 * 验证模型
 */
export const validateModel = (graph) => {
  return new Promise((resolve, reject) => {
    const cells = graph.getCells()
    if (cells.length === 0) {
      return Promise.reject(new Error('No cells to execute'))
    }

    // 这里预留 校验 数据的逻辑

    // 验证只有一个参数输入节点且必须是参数获取节点开头
    const inputCheck = validateSingleParamsInputStart(graph, cells)
    if (!inputCheck.valid) {
      return reject(new Error(inputCheck.message))
    }
    // 验证至少有一个输出节点且所有终止节点必须是参数输出节点
    const outputCheck = validateOutputEnd(graph, cells)
    if (!outputCheck.valid) {
      return reject(new Error(outputCheck.message))
    }

    // 验证条件判断节点必须有两个出边
    const conditionCheck = validateConditionNodeEdges(graph, cells)
    if (!conditionCheck.valid) {
      return reject(new Error(conditionCheck.message))
    }

    // 验证是 DAG图
    if (!isDAG(graph)) {
      return reject(new Error('模型不是DAG图，存在环路'))
    }

    return resolve(true)
  })
}
