
// 主题域选项
export const topicOptions = [
  { id: '1', name: '工艺' },
  { id: '2', name: '设备' },
  { id: '3', name: '工单' },
  { id: '4', name: '行政经营' }
]
// 业务分类选项
export const businessOptions = [
  { id: '1-1', name: '整厂' },
  { id: '1-2', name: '工艺系统' },
  { id: '1-3', name: '工艺' }
]

// 数据标签选项
export const tagOptions = [
  { id: 'tag1', name: '实时数据' },
  { id: 'tag2', name: '离线数据' },
  { id: 'tag3', name: '历史数据' },
  { id: 'tag4', name: '指标数据' },
  { id: 'tag5', name: '统计数据' }
]

// 组织维度选项
export const organizationOptions = [
  {
    id: 'org1',
    name: '北控水务集团',
    children: [
      {
        id: 'org1-1',
        name: '华北区域',
        children: [
          { id: 'org1-1-1', name: '北京公司' },
          { id: 'org1-1-2', name: '天津公司' }
        ]
      },
      {
        id: 'org1-2',
        name: '华东区域',
        children: [
          { id: 'org1-2-1', name: '上海公司' },
          { id: 'org1-2-2', name: '南京公司' }
        ]
      }
    ]
  }
]

// 申请状态
export const statusOptions = [
  { id: 'null', name: '全部' },
  { id: '1', name: '审核中' },
  { id: '2', name: '审核通过' },
  { id: '3', name: '审核未通过' }
]

// 模拟的树形数据
export const BusinessTreeMockData: BusinessTreeNode[] = [
  {
    id: 'root_001',
    type: 'wastewater_plant',
    name: '污水处理厂',
    children: [
      {
        id: 'facility_00101',
        type: 'facility',
        name: '整厂',
        children: [
          {
            id: 'info_001',
            type: 'information',
            name: '设计信息'
          },
          {
            id: 'info_002',
            type: 'information',
            name: '行政信息',
            children: [
              {
                id: 'data_0011',
                type: 'data',
                name: '水厂'
              },
              {
                id: 'data_0021',
                type: 'data',
                name: '项目'
              }
            ]
          },
          {
            id: 'info_003',
            type: 'information',
            name: '合同信息'
          },
          {
            id: 'info_004',
            type: 'information',
            name: '运行信息',
            children: [
              {
                id: 'data_001',
                type: 'data',
                name: '水质'
              },
              {
                id: 'data_002',
                type: 'data',
                name: '水量'
              },
              {
                id: 'data_003',
                type: 'data',
                name: '电量'
              },
              {
                id: 'data_004',
                type: 'data',
                name: '污泥'
              },
              {
                id: 'data_005',
                type: 'data',
                name: '药剂'
              }
            ]
          },
          {
            id: 'info_005',
            type: 'information',
            name: '经营信息',
            children: [
              {
                id: 'data_001',
                type: 'data',
                name: '水质'
              },
              {
                id: 'data_002',
                type: 'data',
                name: '水量'
              },
              {
                id: 'data_003',
                type: 'data',
                name: '电量'
              },
              {
                id: 'data_004',
                type: 'data',
                name: '污泥'
              },
              {
                id: 'data_005',
                type: 'data',
                name: '药剂'
              }
            ]
          },
            {
            id: 'info_0051',
            type: 'information',
            name: '设施',
            children: [
              {
                id: 'facility_001',
                type: 'facility',
                name: '进水在线监测仪表间',
                children: [
                  { id: 'equip_001', type: 'equipment', name: 'COD分析仪' },
                  { id: 'equip_002', type: 'equipment', name: '氨氮分析仪' },
                  { id: 'equip_003', type: 'equipment', name: 'TN分析仪' },
                  { id: 'equip_004', type: 'equipment', name: 'TP分析仪' },
                  { id: 'equip_005', type: 'equipment', name: 'PH/T分析仪' },
                  { id: 'equip_006', type: 'equipment', name: 'SS分析仪' },
                  { id: 'equip_007', type: 'equipment', name: '浊度分析仪' }
                ],
                count: 7,
                level: 1
              },
              {
                id: 'facility_002',
                type: 'facility',
                name: '粗格栅',
                children: [
                  { id: 'equip_008', type: 'equipment', name: '总进水闸门' },
                  { id: 'equip_009', type: 'equipment', name: '粗格栅' },
                  { id: 'equip_010', type: 'equipment', name: '输送机' },
                  { id: 'equip_011', type: 'equipment', name: '液位差计' }
                ],
                count: 4,
                level: 1
              },
              {
                id: 'facility_003',
                type: 'facility',
                name: '进水提升泵房',
                children: [
                  { id: 'equip_012', type: 'equipment', name: '进水提升泵' },
                  { id: 'equip_013', type: 'equipment', name: '液位计' },
                  { id: 'equip_014', type: 'equipment', name: '进水总流量计' },
                  { id: 'equip_015', type: 'equipment', name: '进水提升泵流量计' }
                ],
                count: 4,
                level: 1
              },
              {
                id: 'facility_004',
                type: 'facility',
                name: '细格栅',
                children: [
                  { id: 'equip_016', type: 'equipment', name: '细格栅' },
                  { id: 'equip_017', type: 'equipment', name: '输送机' },
                  { id: 'equip_018', type: 'equipment', name: '冲洗泵' },
                  { id: 'equip_019', type: 'equipment', name: '液位差计' }
                ],
                count: 4,
                level: 1
              },
              {
                id: 'facility_005',
                type: 'facility',
                name: '精细格栅',
                children: [
                  { id: 'equip_020', type: 'equipment', name: '精细格栅' },
                  { id: 'equip_021', type: 'equipment', name: '输送机' },
                  { id: 'equip_022', type: 'equipment', name: '冲洗泵' },
                  { id: 'equip_023', type: 'equipment', name: '液位差计' }
                ],
                count: 4,
                level: 1
              },
              {
                id: 'facility_006',
                type: 'facility',
                name: '沉砂池',
                children: [
                  { id: 'equip_024', type: 'equipment', name: '搅拌器' },
                  { id: 'equip_025', type: 'equipment', name: '提砂风机' },
                  { id: 'equip_026', type: 'equipment', name: '吸砂泵' },
                  { id: 'equip_027', type: 'equipment', name: '吸砂机' },
                  { id: 'equip_028', type: 'equipment', name: '曝气风机' },
                  { id: 'equip_029', type: 'equipment', name: '砂水分离器' }
                ],
                count: 6,
                level: 1
              },
              {
                id: 'facility_007',
                type: 'facility',
                name: '初沉池',
                children: [
                  { id: 'equip_030', type: 'equipment', name: '排泥泵' },
                  { id: 'equip_031', type: 'equipment', name: '排泥流量计' },
                  { id: 'equip_032', type: 'equipment', name: '刮泥机' },
                  { id: 'equip_033', type: 'equipment', name: '吸泥机' }
                ],
                count: 4,
                level: 1
              },
              {
                id: 'facility_008',
                type: 'facility',
                name: '生化池',
                children: [
                  { id: 'equip_034', type: 'equipment', name: '选择区搅拌器' },
                  { id: 'equip_035', type: 'equipment', name: '脱气区搅拌器' },
                  { id: 'equip_036', type: 'equipment', name: '预缺氧区搅拌器' },
                  { id: 'equip_037', type: 'equipment', name: '厌氧区搅拌器' },
                  { id: 'equip_038', type: 'equipment', name: '缺氧区推流器' },
                  { id: 'equip_039', type: 'equipment', name: '后缺氧区推流器' },
                  { id: 'equip_040', type: 'equipment', name: '好氧区推流器' },
                  { id: 'equip_041', type: 'equipment', name: '内回流泵' },
                  { id: 'equip_042', type: 'equipment', name: '内回流流量计' },
                  { id: 'equip_043', type: 'equipment', name: '曝气支管阀' },
                  { id: 'equip_044', type: 'equipment', name: '曝气支管气体流量计' },
                  { id: 'equip_045', type: 'equipment', name: '好氧区前段DO分析仪' },
                  { id: 'equip_046', type: 'equipment', name: '好氧区中段DO分析仪' },
                  { id: 'equip_047', type: 'equipment', name: '好氧区末端DO分析仪' },
                  { id: 'equip_048', type: 'equipment', name: '后好氧区前段DO分析仪' },
                  { id: 'equip_049', type: 'equipment', name: '后好氧区中段DO分析仪' },
                  { id: 'equip_050', type: 'equipment', name: '后好氧区末端DO分析仪' },
                  { id: 'equip_051', type: 'equipment', name: '消氧区前段DO分析仪' },
                  { id: 'equip_052', type: 'equipment', name: '消氧区中段DO分析仪' },
                  { id: 'equip_053', type: 'equipment', name: '消氧区末端DO分析仪' },
                  { id: 'equip_054', type: 'equipment', name: '预缺氧区ORP分析仪' },
                  { id: 'equip_055', type: 'equipment', name: '缺氧区ORP分析仪' },
                  { id: 'equip_056', type: 'equipment', name: '后缺氧区ORP分析仪' },
                  { id: 'equip_057', type: 'equipment', name: '消氧区ORP分析仪' },
                  { id: 'equip_058', type: 'equipment', name: '脱气区ORP分析仪' },
                  { id: 'equip_059', type: 'equipment', name: 'MLSS分析仪' },
                  { id: 'equip_060', type: 'equipment', name: '氨氮分析仪' },
                  { id: 'equip_061', type: 'equipment', name: '硝氮分析仪' },
                  { id: 'equip_062', type: 'equipment', name: '正磷酸盐分析仪' }
                ],
                count: 29,
                level: 1
              },
              {
                id: 'facility_009',
                type: 'facility',
                name: '二沉池',
                children: [
                  { id: 'equip_063', type: 'equipment', name: '表曝机' },
                  { id: 'equip_064', type: 'equipment', name: '进水闸门（序批式）' },
                  { id: 'equip_065', type: 'equipment', name: '滗水器' },
                  { id: 'equip_066', type: 'equipment', name: '搅拌器（序批式）' },
                  { id: 'equip_067', type: 'equipment', name: 'DO分析仪（序批式）' },
                  { id: 'equip_068', type: 'equipment', name: '液位计（序批式）' },
                  { id: 'equip_069', type: 'equipment', name: '刮泥机' },
                  { id: 'equip_070', type: 'equipment', name: '吸泥机' }
                ],
                count: 8,
                level: 1
              }
            ]
          }
        ],
        count: 7,
        level: 1
      }

    ]
  }
]

// 树节点接口定义
export interface BusinessTreeNode {
  id: string | number
  name: string
  children?: BusinessTreeNode[]
  count?: number
  level?: number
  type?: string
    parenId?: string
    currentId?: string
}

export interface OrgTreeNode {
  orgId: string
  name: string
  label?: string // 对应 name
  value: string // 对应 orgId
  parentOrgId: string
  thirdCode: string
  deptType: string
  orgLevel: number | null
  orgType: number
  status: number
  source: number
  principal: string
  depth: number
  tenantId: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  remark: string
  tags: string
  notificationReceivers?: string
  userCnt?: string // 可选属性，可能不需要在所有节点中使用
  thirdPartyUserCnt?: string // 可选属性，可能不需要在所有节点中使用
  children?: OrgTreeNode[] // 可选的子节点数组
}

export const OrgTreeMockData: OrgTreeNode[] = [
  {
    orgId: '1',
    name: '北控水务集团',
    label: '北控水务集团',
    value: '1',
    parentOrgId: '0',
    thirdCode: '100000',
    deptType: '1',
    orgLevel: 1,
    orgType: 1,
    status: 1,
    source: 1,
    principal: '张三',
    depth: 1,
    tenantId: 'tenant_001',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedAt: '2023-01-01T00:00:00Z',
    updatedBy: 'admin',
    remark: '集团总部',
    tags: '["总部","集团"]',
    children: [
      {
        orgId: '1-1',
        name: '华北区域',
        label: '华北区域',
        value: '1-1',
        parentOrgId: '1',
        thirdCode: '110000',
        deptType: '2',
        orgLevel: 2,
        orgType: 2,
        status: 1,
        source: 1,
        principal: '李四',
        depth: 2,
        tenantId: 'tenant_001',
        createdAt: '2023-01-01T00:00:00Z',
        createdBy: 'admin',
        updatedAt: '2023-01-01T00:00:00Z',
        updatedBy: 'admin',
        remark: '负责华北地区业务',
        tags: '["区域","华北"]',
        children: [
          {
            orgId: '1-1-1',
            name: '北京公司',
            label: '北京公司',
            value: '1-1-1',
            parentOrgId: '1-1',
            thirdCode: '110100',
            deptType: '3',
            orgLevel: 3,
            orgType: 3,
            status: 1,
            source: 1,
            principal: '王五',
            depth: 3,
            tenantId: 'tenant_001',
            createdAt: '2023-01-01T00:00:00Z',
            createdBy: 'admin',
            updatedAt: '2023-01-01T00:00:00Z',
            updatedBy: 'admin',
            remark: '负责北京地区业务',
            tags: '["公司","北京"]'
          },
          {
            orgId: '1-1-2',
            name: '天津公司',
            label: '天津公司',
            value: '1-1-2',
            parentOrgId: '1-1',
            thirdCode: '120100',
            deptType: '3',
            orgLevel: 3,
            orgType: 3,
            status: 1,
            source: 1,
            principal: '赵六',
            depth: 3,
            tenantId: 'tenant_001',
            createdAt: '2023-01-01T00:00:00Z',
            createdBy: 'admin',
            updatedAt: '2023-01-01T00:00:00Z',
            updatedBy: 'admin',
            remark: '负责天津地区业务',
            tags: '["公司","天津"]'
          }
        ]
      },
      {
        orgId: '1-2',
        name: '华东区域',
          label: '华东区域',
        value: '1-2',
        parentOrgId: '1',
        thirdCode: '310000',
        deptType: '2',
        orgLevel: 2,
        orgType: 2,
        status: 1,
        source: 1,
        principal: '钱七',
        depth: 2,
        tenantId: 'tenant_001',
        createdAt: '2023-01-01T00:00:00Z',
        createdBy: 'admin',
        updatedAt: '2023-01-01T00:00:00Z',
        updatedBy: 'admin',
        remark: '负责华东地区业务',
        tags: '["区域","华东"]',
        children: [
          {
            orgId: '1-2-1',
            name: '上海公司',
              label: '上海公司',
            value: '1-2-1',
            parentOrgId: '1-2',
            thirdCode: '310100',
            deptType: '3',
            orgLevel: 3,
            orgType: 3,
            status: 1,
            source: 1,
            principal: '孙八',
            depth: 3,
            tenantId: 'tenant_001',
            createdAt: '2023-01-01T00:00:00Z',
            createdBy: 'admin',
            updatedAt: '2023-01-01T00:00:00Z',
            updatedBy: 'admin',
            remark: '负责上海地区业务',
            tags: '["公司","上海"]'
          },
          {
            orgId: '1-2-2',
            name: '南京公司',
              label: '南京公司',
            value: '1-2-2',
            parentOrgId: '1-2',
            thirdCode: '320100',
            deptType: '3',
            orgLevel: 3,
            orgType: 3,
            status: 1,
            source: 1,
            principal: '周九',
            depth: 3,
            tenantId: 'tenant_001',
            createdAt: '2023-01-01T00:00:00Z',
            createdBy: 'admin',
            updatedAt: '2023-01-01T00:00:00Z',
            updatedBy: 'admin',
            remark: '负责南京地区业务',
            tags: '["公司","南京"]'
          }
        ]
      }
    ]
  }
]
