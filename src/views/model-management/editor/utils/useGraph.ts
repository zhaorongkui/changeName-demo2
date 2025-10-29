// ...existing code...
import { customRef, Ref } from 'vue'
import { Graph, Shape, Cell } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { ref, onMounted } from 'vue'
import { registerCustomNode } from './registerUtils'
import { validateConnection } from './limitUtils'
import { customCreateEdge } from './createUtils'

export function useGraph(containerRef) {
  const graphRef = ref(null)

  const initGraph = async () => {
    await registerCustomNode(Graph)
    graphRef.value = new Graph({
      container: containerRef.value,
      interacting: () => true,
      grid: true,
      panning: true,
      mousewheel: false,
      connecting: {
        snap: { radius: 20 },
        highlight: true,
        router: 'manhattan',
        connector: { name: 'rounded', args: { radius: 8 } },
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'top'
        },
        createEdge: (args) => customCreateEdge(args, graphRef.value),
        validateConnection: (args) => validateConnection(args, graphRef.value)
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4
            }
          }
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4
            }
          }
        }
      }
    })
    graphRef.value.use(
      new Selection({
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true
      })
    )
  }

  const bindGraphEvents = () => {
    // 边的连接事件
    graphRef.value.on('edge:connected', ({ edge }) => {
      edge.attr({
        line: {
          strokeDasharray: ''
        }
      })
    })
    // 节点状态变化事件
    graphRef.value.on('node:change:data', ({ node }) => {
      const edges = graphRef.value.getIncomingEdges(node)
      const { status } = node.getData()
      edges?.forEach((edge) => {
        if (status === 'running') {
          edge.attr('line/strokeDasharray', 5)
          edge.attr('line/style/animation', 'running-line 30s infinite linear')
        } else {
          edge.attr('line/strokeDasharray', '')
          edge.attr('line/style/animation', '')
        }
      })
    })
    // 节点鼠标悬停事件
    graphRef.value.on('node:mouseenter', (args) => {
      const node = args.cell
      const size = node.getSize?.()
      if (node) {
        node.addTools({
          name: 'button-remove',
          args: {
            x: size.width / 2,
            y: -2,
            offset: { x: 0, y: 0 }
          }
        })
      }
    })
    graphRef.value.on('node:mouseleave', ({ node }) => {
      if (node.hasTool('button-remove')) {
        node.removeTool('button-remove')
      }
    })
    graphRef.value.on('edge:mouseenter', ({ edge }) => {
      edge.addTools({
        name: 'button-remove',
        args: {
          x: 0,
          y: 0,
          offset: { x: 0, y: 0 }
        }
      })
    })
    graphRef.value.on('edge:mouseleave', ({ edge }) => {
      if (edge.hasTool('button-remove')) {
        edge.removeTool('button-remove')
      }
    })
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedEdges = graphRef.value.getSelectedCells().filter((cell) => cell.isEdge && cell.isEdge())
        if (selectedEdges.length > 0) {
          graphRef.value.removeCells(selectedEdges)
        }
      }
    })
  }

  const initData = async (data) => {
    const { cells } = data
    const newCells: Cell[] = []
    cells.forEach((item) => {
      if (item.shape === 'dag-node') {
        newCells.push(graphRef.value.createNode(item))
      } else {
        newCells.push(graphRef.value.createEdge(item))
      }
    })
    graphRef.value.resetCells(newCells)
    graphRef.value.centerContent()
  }

  const init = async () => {
    await initGraph()
    bindGraphEvents()
  }

  onMounted(async () => {})

  return {
    graph: graphRef,
    init,
    initData
  }
}
