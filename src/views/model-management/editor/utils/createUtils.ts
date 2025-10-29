import { Graph, Shape, Cell } from '@antv/x6'
export const customCreateEdge = (args, self) => {
  console.log('customCreateEdge', args)
  const { sourceCell } = args
  // 如果sourceCell 是 条件判断节点
  if (sourceCell.isNode() && sourceCell.data.type === 'condition') {
    // 获取节点 的 目标连线
    const targetEdges = self.getConnectedEdges(sourceCell, { outgoing: true })
    console.log('targetEdges', targetEdges)
    if (!targetEdges.length) {
      // 如果没有目标连线，创建一个默认的边
      return self.createEdge({
        shape: 'dag-edge-verdict-Y',
        zIndex: -1
      })
    } else if (targetEdges.length === 1) {
      const currentEdge = targetEdges[0]
      if (currentEdge.data.type === 'verdict-Y') {
        return self.createEdge({
          shape: 'dag-edge-verdict-N',
          zIndex: -1
        })
      } else if (currentEdge.data.type === 'verdict-N') {
        return self.createEdge({
          shape: 'dag-edge-verdict-Y',
          zIndex: -1
        })
      }
    }
  }
  return self.createEdge({
    shape: 'dag-edge',
    zIndex: -1
  })
}
