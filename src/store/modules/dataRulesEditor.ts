/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-05 16:11:02
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-11 14:19:53
 * @FilePath: \model-sandbox-frontend\src\store\modules\dataRulesEditor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { NodeAttribute } from '@/views/model-management/editor/utils/types'

// operatorArray 统一由 store 管理

const operatorArray = ref<NodeAttribute[]>([])

function setOperatorArray(arr: NodeAttribute[]) {
  operatorArray.value = arr
}

function addOrUpdateOperator(operator: NodeAttribute) {
  const idx = operatorArray.value.findIndex((item) => item.id === operator.id)
  if (idx > -1) {
    operatorArray.value.splice(idx, 1, operator)
  } else {
    operatorArray.value.push(operator)
  }
}

function removeOperatorById(id: string) {
  const idx = operatorArray.value.findIndex((item) => item.id === id)
  if (idx > -1) {
    operatorArray.value.splice(idx, 1)
  }
}

function getOperatorById(id: string) {
  return operatorArray.value.find((item) => item.id === id)
}

function getOperatorByType(type: string) {
  return operatorArray.value.find((item) => item.type === type)
}

const useDataRulesEditorStore = defineStore(
  'dataRulesEditor',
  () => {
    // 初始化 operatorArray（如有默认值）
    if (!operatorArray.value.length) {
      setOperatorArray([
        {
          id: 'ee74c493-27ec-4f2f-acf0-e0314637f4a3',
          label: '参数获取',
          type: 'params-input',
          properties: {
            'params-input': [
              {
                m_code: 789,
                m_time: '2023-10-03',
                m_text: '更多示例',
                '1#_flow_in': 300,
                '1#_flow_out': 280,
                '2#_flow_in': 310,
                '2#_flow_out': 295,
                '3#_flow_in': 320,
                '3#_flow_out': 315,
                total_flow_in: 930,
                total_flow_out: 890
              }
            ]
          },
          status: 'default'
        },
        {
          id: '74f08f6a-36d6-4eed-b6a6-1645fe04f43d',
          label: '数据计算',
          type: 'calculation',
          properties: {
            calculation: {
              displayScript: 'sum(p1,p2)',
              script: 'sum(p1,p2)',
              marks:
                '[{"from":{"line":0,"ch":4,"sticky":null},"to":{"line":0,"ch":6,"sticky":null},"enCode":"p1","uid":"RML4H6UlREbW8rrFQUvg"},{"from":{"line":0,"ch":7,"sticky":null},"to":{"line":0,"ch":9,"sticky":null},"enCode":"p2","uid":"DY4kg7m7ciXGA669lBNt"}]',
              params: {
                p1: {
                  indicatorCode: '1#_flow_in',
                  singleValue: true
                },
                p2: {
                  indicatorCode: '2#_flow_in',
                  singleValue: true
                }
              }
            }
          },
          status: 'default'
        },
        {
          id: '1097fe93-9f7b-4ef7-bb1c-a7a46ed835e1',
          label: '条件判断',
          type: 'condition',
          properties: {
            condition: {
              id: 'mxc1g170wwsphmk34jmj4',
              nodeType: 'group',
              type: 'or',
              children: [
                {
                  id: 'dwvmr0ky5ab1qrho3afuz4j',
                  nodeType: 'item',
                  field: '',
                  operator: '=',
                  value: ''
                },
                {
                  id: 't3tm5o2oj7846qw7qtsrh',
                  nodeType: 'item',
                  field: '',
                  operator: '=',
                  value: ''
                }
              ]
            }
          },
          status: 'default'
        }
      ])
    }
    return {
      operatorArray,
      setOperatorArray,
      addOrUpdateOperator,
      removeOperatorById,
      getOperatorById,
      getOperatorByType
    }
  },
  {
    persist: true
  }
)

export default useDataRulesEditorStore
