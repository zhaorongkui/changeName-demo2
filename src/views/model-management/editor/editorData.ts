export default [
  {
    id: '1',
    shape: 'dag-node',
    x: 0,
    y: 110,
    data: {
      label: '参数获取',
      status: 'default',
      type: 'params-input'
    },
    ports: [
      {
        id: '1-1',
        group: 'bottom'
      }
    ]
  },
  {
    id: '2',
    shape: 'dag-node',
    x: 240,
    y: 110,
    data: {
      label: '数据计算',
      status: 'default',
      type: 'calculation'
    },
    ports: [
      {
        id: '2-1',
        group: 'top'
      },
      {
        id: '2-2',
        group: 'bottom'
      }
      //   {
      //     id: '2-3',
      //     group: 'bottom'
      //   }
    ]
  },
  {
    id: '3',
    shape: 'dag-node',
    x: 480,
    y: 80,
    data: {
      label: '参数输出',
      status: 'default',
      type: 'params-output'
    },
    ports: [
      {
        id: '3-1',
        group: 'top'
      },
      {
        id: '3-2',
        group: 'bottom'
      }
    ]
  },
  {
    id: '4',
    shape: 'dag-node',
    x: 480,
    y: 140,
    data: {
      label: '条件判断',
      status: 'default',
      type: 'condition'
    },
    ports: [
      {
        id: '4-1',
        group: 'top'
      },
      {
        id: '4-2',
        group: 'bottom'
      }
    ]
  },
  {
    id: '5',
    shape: 'dag-edge',
    source: {
      cell: '1',
      port: '1-1'
    },
    target: {
      cell: '2',
      port: '2-1'
    },
    zIndex: 0
  },
  {
    id: '6',
    shape: 'dag-edge',
    source: {
      cell: '2',
      port: '2-2'
    },
    target: {
      cell: '3',
      port: '3-1'
    },
    zIndex: 0
  },
  {
    id: '7',
    shape: 'dag-edge',
    source: {
      cell: '2',
      port: '2-2'
    },
    target: {
      cell: '4',
      port: '4-1'
    },
    zIndex: 0
  },

  {
    id: '9',
    shape: 'dag-node',
    x: 720,
    y: 160,
    data: {
      label: '数据计算',
      status: 'running',
      type: 'calculation'
    },
    ports: [
      {
        id: '9-1',
        group: 'top'
      }
    ]
  },
  {
    id: '10',
    shape: 'dag-node',
    x: 720,
    y: 240,
    data: {
      label: '条件判断',
      status: 'failed',
      type: 'condition'
    },
    ports: [
      {
        id: '10-1',
        group: 'top'
      }
    ]
  },
  {
    id: '11',
    shape: 'dag-node',
    x: 720,
    y: 80,
    data: {
      label: '参数输出',
      status: 'success',
      type: 'params-output'
    },
    ports: [
      {
        id: '10-1',
        group: 'top'
      }
    ]
  },
  {
    id: '12',
    shape: 'dag-node',
    x: 960,
    y: 240,
    data: {
      label: '参数输出',
      status: 'success',
      type: 'params-output'
    },
    ports: [
      {
        id: '9-1',
        group: 'top'
      }
    ]
  },
  {
    id: '14',
    shape: 'dag-edge',
    source: {
      cell: '4',
      port: '4-2'
    },
    target: {
      cell: '9',
      port: '9-1'
    },
    zIndex: 0
  },
  {
    id: '15',
    shape: 'dag-edge',
    source: {
      cell: '4',
      port: '4-2'
    },
    target: {
      cell: '10',
      port: '10-1'
    },
    zIndex: 0
  }
]

export const CellsData = {
  cells: [
    {
      shape: 'dag-edge',
      attrs: {
        line: {
          strokeDasharray: ''
        }
      },
      connector: {
        name: 'curveConnector'
      },
      id: '371dfe57-908d-48c6-ba4d-a17c8cd88778',
      zIndex: -1,
      source: {
        cell: 'ee74c493-27ec-4f2f-acf0-e0314637f4a3',
        port: 'bc4547bc-c2a0-4c82-8664-c410212e69b8'
      },
      target: {
        cell: '74f08f6a-36d6-4eed-b6a6-1645fe04f43d',
        port: '748eb6c2-cad0-4e50-b0bb-ae1973e54ba3'
      }
    },
    {
      shape: 'dag-edge',
      attrs: {
        line: {
          strokeDasharray: ''
        }
      },
      connector: {
        name: 'curveConnector'
      },
      id: '011ec304-2ec1-4c36-a888-04947a0e7226',
      zIndex: -1,
      source: {
        cell: '74f08f6a-36d6-4eed-b6a6-1645fe04f43d',
        port: '0432916b-ab80-4f17-9c5a-130bef59fc65'
      },
      target: {
        cell: '1097fe93-9f7b-4ef7-bb1c-a7a46ed835e1',
        port: '7bcf83b2-aa4b-4c0b-a694-894414386341'
      }
    },
    {
      shape: 'dag-edge-verdict-N',
      attrs: {
        line: {
          strokeDasharray: ''
        }
      },
      connector: {
        name: 'curveConnector'
      },
      id: 'e9f2400b-5a2c-49e6-ab47-e9d27b26e82e',
      zIndex: -1,
      source: {
        cell: '1097fe93-9f7b-4ef7-bb1c-a7a46ed835e1',
        port: '620c4c58-9fd3-4ff3-b0a1-e2583b4d85f7'
      },
      target: {
        cell: '505dc25b-95f0-4615-a516-0e6815b9aa45',
        port: '5f8959c3-8797-4ab0-957a-0745e2cab2c5'
      },
      tools: {
        items: [],
        name: null
      }
    },
    {
      shape: 'dag-edge-verdict-Y',
      attrs: {
        line: {
          strokeDasharray: ''
        }
      },
      connector: {
        name: 'curveConnector'
      },
      id: 'fdd1ec94-39f2-4196-b5d1-20d7fbe557a0',
      zIndex: -1,
      source: {
        cell: '1097fe93-9f7b-4ef7-bb1c-a7a46ed835e1',
        port: '620c4c58-9fd3-4ff3-b0a1-e2583b4d85f7'
      },
      target: {
        cell: '63616787-e666-4254-8f8d-920e746c660a',
        port: '3d1a43db-6de8-46a5-89d0-128c44b4b8c1'
      }
    },
    {
      position: {
        x: -50,
        y: 20
      },
      size: {
        width: 180
        // height: 36
      },
      view: 'vue-shape-view',
      shape: 'dag-node',
      ports: {
        groups: {
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
        },
        items: [
          {
            group: 'bottom',
            id: 'bc4547bc-c2a0-4c82-8664-c410212e69b8'
          }
        ]
      },
      id: 'ee74c493-27ec-4f2f-acf0-e0314637f4a3',
      data: {
        type: 'params-input',
        status: 'default',
        label: '参数获取'
      },
      zIndex: 1,
      tools: {
        items: [],
        name: null
      }
    },
    {
      position: {
        x: 410,
        y: 20
      },
      size: {
        width: 180,
        height: 36
      },
      view: 'vue-shape-view',
      shape: 'dag-node',
      ports: {
        groups: {
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
        },
        items: [
          {
            group: 'top',
            id: '7bcf83b2-aa4b-4c0b-a694-894414386341'
          },
          {
            group: 'bottom',
            id: '620c4c58-9fd3-4ff3-b0a1-e2583b4d85f7'
          }
        ]
      },
      id: '1097fe93-9f7b-4ef7-bb1c-a7a46ed835e1',
      data: {
        type: 'condition',
        status: 'default',
        label: '条件判断'
      },
      zIndex: 2,
      tools: {
        items: [],
        name: null
      }
    },
    {
      position: {
        x: 180,
        y: 20
      },
      size: {
        width: 180,
        height: 36
      },
      view: 'vue-shape-view',
      shape: 'dag-node',
      ports: {
        groups: {
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
        },
        items: [
          {
            group: 'top',
            id: '748eb6c2-cad0-4e50-b0bb-ae1973e54ba3'
          },
          {
            group: 'bottom',
            id: '0432916b-ab80-4f17-9c5a-130bef59fc65'
          }
        ]
      },
      id: '74f08f6a-36d6-4eed-b6a6-1645fe04f43d',
      data: {
        type: 'calculation',
        status: 'default',
        label: '数据计算'
      },
      zIndex: 3,
      tools: {
        items: [],
        name: null
      }
    },
    {
      position: {
        x: 730,
        y: 60
      },
      size: {
        width: 180,
        height: 36
      },
      view: 'vue-shape-view',
      shape: 'dag-node',
      ports: {
        groups: {
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
        },
        items: [
          {
            group: 'top',
            id: '5f8959c3-8797-4ab0-957a-0745e2cab2c5'
          }
        ]
      },
      id: '505dc25b-95f0-4615-a516-0e6815b9aa45',
      data: {
        type: 'params-output',
        status: 'default',
        label: '参数输出'
      },
      zIndex: 4,
      tools: {
        items: [],
        name: null
      }
    },
    {
      position: {
        x: 730,
        y: -20
      },
      size: {
        width: 180,
        height: 36
      },
      view: 'vue-shape-view',
      shape: 'dag-node',
      ports: {
        groups: {
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
        },
        items: [
          {
            group: 'top',
            id: '3d1a43db-6de8-46a5-89d0-128c44b4b8c1'
          }
        ]
      },
      id: '63616787-e666-4254-8f8d-920e746c660a',
      data: {
        type: 'params-output',
        status: 'default',
        label: '参数输出'
      },
      zIndex: 5,
      tools: {
        items: [],
        name: null
      }
    }
  ]
}
