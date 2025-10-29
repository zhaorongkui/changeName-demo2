import { Path } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape'
import dagNode from '../components/cells/dagNode.vue'
import { text } from 'stream/consumers'

// 注册边
const registerEdge = (Graph) => {
  const defaultMarkup = [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round'
      }
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none'
      }
    }
  ]
  const defaultAttrs = {
    wrap: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round'
    },
    line: {
      connection: true,
      stroke: '#C2C8D5',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 6
      }
    }
  }
  Graph.registerEdge(
    'dag-edge',
    {
      markup: [...defaultMarkup],
      connector: { name: 'curveConnector' },
      attrs: {
        ...defaultAttrs
      }
    },
    true
  )
  Graph.registerEdge(
    'dag-edge-verdict-Y',
    {
      connector: { name: 'curveConnector' },
      markup: [
        ...defaultMarkup,
        {
          tagName: 'foreignObject',
          selector: 'fo',
          attrs: { width: 24, height: 18 },
          children: [
            {
              ns: 'http://www.w3.org/1999/xhtml',
              tagName: 'body',
              children: [
                {
                  tagName: 'button',
                  attrs: {
                    style: 'width:24px;height:18px;font-size:12px;background-color:#fff;'
                  },
                  textContent: 'Y'
                }
              ]
            }
          ]
        }
      ],
      attrs: {
        ...defaultAttrs,
        fo: {
          ref: 'wrap',
          refX: 0.5, // 边的中点
          refY: 0.5, // 边的中点
          x: -12, // 按钮宽40，居中
          y: -10,
          with: 26,
          height: 20
        }
      },
      data: {
        type: 'verdict-Y'
      }
    },
    true
  )
  Graph.registerEdge(
    'dag-edge-verdict-N',
    {
      connector: { name: 'curveConnector' },
      markup: [
        ...defaultMarkup,
        {
          tagName: 'foreignObject',
          selector: 'fo',
          attrs: { width: 24, height: 18 },
          children: [
            {
              ns: 'http://www.w3.org/1999/xhtml',
              tagName: 'body',
              children: [
                {
                  tagName: 'button',
                  attrs: {
                    style: 'width:24px;height:18px;font-size:12px;background-color:#fff;'
                  },
                  textContent: 'N'
                }
              ]
            }
          ]
        }
      ],
      attrs: {
        ...defaultAttrs,
        fo: {
          ref: 'wrap',
          refX: 0.5, // 边的中点
          refY: 0.5, // 边的中点
          x: -12, // 按钮宽40，居中
          y: -10,
          with: 26,
          height: 20
        }
      },
      data: {
        type: 'verdict-N'
      }
    },
    true
  )
}
// 注册连线
const registerConnector = (Graph) => {
  Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
      const hgap = Math.abs(targetPoint.x - sourcePoint.x)
      const path = new Path()
      path.appendSegment(Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y))
      path.appendSegment(Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y))
      // 水平三阶贝塞尔曲线
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x < targetPoint.x ? sourcePoint.x + hgap / 2 : sourcePoint.x - hgap / 2,
          sourcePoint.y,
          sourcePoint.x < targetPoint.x ? targetPoint.x - hgap / 2 : targetPoint.x + hgap / 2,
          targetPoint.y,
          targetPoint.x - 6,
          targetPoint.y
        )
      )
      path.appendSegment(Path.createSegment('L', targetPoint.x + 2, targetPoint.y))

      return path.serialize()
    },
    true
  )
}
// 注册连接点
const registerPort = (Graph) => {
  Graph.registerPortLayout(
    'in',
    (portsPositionArgs, elemBBox, groupPositionArgs) => {
      console.log('portsPositionArgs, elemBBox', portsPositionArgs, elemBBox, groupPositionArgs)
      // return {
      //   position: { x: elemBBox.width / 2, y: 0 }
      // }
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: 0,
            y: 12 + elemBBox.height
          },
          angle: 0
        }
      })
    },
    true
  )
  Graph.registerPortLayout(
    'out',
    (portsPositionArgs, elemBBox, groupPositionArgs) => {
      console.log('portsPositionArgs, elemBBox', portsPositionArgs, elemBBox, groupPositionArgs)
      // return {
      //   position: { x: elemBBox.width / 2, y: elemBBox.height }
      // }
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: elemBBox.width,
            y: 12 + elemBBox.height
          },
          angle: 0
        }
      })
    },
    true
  )
}
// 注册节点
const registerNode = (Graph) => {
  register({
    shape: 'dag-node',
    width: 180,
    height: 36,
    component: dagNode,
    ports: {
      groups: {
        in: {
          position: 'in',
          label: {
            position: {
              name: 'right',
              args: { x: 8, y: 1 }
            }
          },
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff'
            },
            text: {
              text: 'IN',
              fill: '#6a6c8a',
              fontSize: 10
            }
          }
        },
        out: {
          position: 'out',
          label: {
            position: {
              name: 'left',
              args: { x: -8, y: 1 }
            }
          },
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff'
            },
            text: {
              text: 'OUT',
              fill: '#6a6c8a',
              fontSize: 10
            }
          }
        },
        top: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff'
            }
          }
        },
        bottom: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff'
            }
          }
        }
      }
    }
  })
}

export const registerCustomNode = (Graph) => {
  registerEdge(Graph)
  registerConnector(Graph)
  registerPort(Graph)
  registerNode(Graph)
}
