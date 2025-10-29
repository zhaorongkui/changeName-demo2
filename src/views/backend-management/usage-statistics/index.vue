<template>
  <div class="usage-statistics detail-config ">
    <!-- User Info Section -->
    <div class="user-info-section">
      <div class="user-avatar">
        <el-avatar :size="50" icon="User" />
      </div>
      <h3>{{ currentUserInfo.name }} <el-tag type="primary">{{ userInfo.accountType }}</el-tag></h3>
      <p>用户ID: {{ currentUserInfo.id }} | {{ currentUserInfo.deptId }}</p>
      <p>最后活跃: {{ currentUserInfo.updatedAt }}</p>
      <div class="quick-actions">
        <el-button type="primary">下载详细账单</el-button>
      </div>
    </div>

    <!-- Time Range Selector -->
    <div class="time-range-selector">
      <el-radio-group v-model="selectedTimeRange" @change="handleTimeRangeChange">
        <el-radio-button label="本月"></el-radio-button>
        <el-radio-button label="本季度"></el-radio-button>
        <el-radio-button label="自定义"></el-radio-button>
      </el-radio-group>
      <el-date-picker
          v-if="selectedTimeRange === '自定义'"
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="margin-left: 20px; width: 300px"
      />
    </div>

    <!-- Overview Cards -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card cpu-card">
          <div class="card-header">
            <h4>CPU总消耗</h4>
          </div>
          <div class="card-content">
            <div ref="cpuChart" class="chart-container cpu-container"></div>
            <div class="usage-value">{{ cpuUsage }} CPU小时</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card gpu-card">
          <div class="card-header">
            <h4>GPU总时长</h4>
          </div>
          <div class="card-content">
            <div ref="gpuChart" class="chart-container"></div>
            <div class="usage-value">{{ gpuUsage }} GPU小时</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card memory-card">
          <div class="card-header">
            <h4>内存占用</h4>
          </div>
          <div class="card-content">
            <div ref="memoryChart" class="chart-container"></div>
            <div class="usage-value">{{ memoryUsage }} GB-hours</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card token-card">
          <div class="card-header">
            <h4>Token用量</h4>
          </div>
          <div class="card-content">
            <div class="token-counter">
              <div class="token-value">{{ formatNumber(animatedTokenUsage) }}</div>
              <span class="token-unit">千token</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Detailed Visualizations -->
    <el-row :gutter="20" class="detailed-visualizations">
      <el-col :span="16">
        <el-card class="visualization-card">
          <template #header>
            <div class="card-header">
              <h4>资源消耗趋势</h4>
              <el-radio-group v-model="trendMetric" size="small">
                <el-radio-button label="CPU"></el-radio-button>
                <el-radio-button label="GPU"></el-radio-button>
                <el-radio-button label="内存"></el-radio-button>
                <el-radio-button label="Token"></el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart-container-large"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="visualization-card">
          <template #header>
            <div class="card-header">
              <h4>存储使用分布</h4>
            </div>
          </template>
          <div ref="storageChart" class="chart-container-medium"></div>
          <div class="storage-quota">
            <div class="quota-label">剩余配额</div>
            <el-progress :percentage="quotaPercentage" :status="quotaStatus" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Billing Information -->
    <el-card class="billing-card">
      <template #header>
        <div class="card-header">
          <h4>计费信息</h4>
        </div>
      </template>
      <div class="billing-content">
        <h5>当前周期 {{ billingInfo.period }}</h5>
        <ul>
          <li>基础套餐: {{ billingInfo.basePackage }}</li>
          <li>超额资源: <span v-if="billingInfo.overage > 0" class="overage">{{ billingInfo.overage }}</span><span v-else>{{ billingInfo.overage }}</span></li>
          <li>Token费用: {{ billingInfo.tokenCost }}</li>
          <li class="total">应付总额: {{ billingInfo.total }}</li>
        </ul>
      </div>
    </el-card>

    <!-- Alerts Section -->
    <div v-if="showAlert" class="alert-section">
      <el-alert
          :title="alertMessage"
          :type="alertType"
          show-icon
          :closable="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import * as echarts from 'echarts'

// User info
const userInfo = ref({
  name: '张三',
  accountType: '企业用户',
  id: 'USR001234',
  organization: 'XXX污水厂',
  lastActive: '2024-03-15 14:30:22'
})

// Time range selector
const selectedTimeRange = ref('本月')
const customDateRange = ref(['', ''])

// Handle time range change
const handleTimeRangeChange = () => {
  console.log('Time range changed to:', selectedTimeRange.value)
  // In a real application, this would fetch data from the server
}

// Usage data
const cpuUsage = ref(125.5)
const gpuUsage = ref(78.2)
const memoryUsage = ref(245.8)
const tokenUsage = ref(12847)
const animatedTokenUsage = ref(0)

// Format number with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Animate counter
const animateCounter = (start, end, duration) => {
  const startTime = performance.now()
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = Math.floor(start + (end - start) * progress)
    animatedTokenUsage.value = current

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}

// Watch for changes in tokenUsage and re-animate
watch(tokenUsage, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    animateCounter(animatedTokenUsage.value, newVal, 1000)
  }
})

// Chart references
const cpuChart = ref(null)
const gpuChart = ref(null)
const memoryChart = ref(null)
const trendChart = ref(null)
const storageChart = ref(null)

// Chart instances
let cpuChartInstance = null
let gpuChartInstance = null
let memoryChartInstance = null
let trendChartInstance = null
let storageChartInstance = null

// Trend metric selector
const trendMetric = ref('CPU')

// Storage quota
const quotaPercentage = ref(65)
const quotaStatus = computed(() => {
  if (quotaPercentage.value < 80) return ''
  if (quotaPercentage.value < 100) return 'warning'
  return 'exception'
})

// Billing information
const billingInfo = ref({
  period: '2024-03-01 至 2024-03-31',
  basePackage: '¥2,999.00',
  overage: '¥1,250.00',
  tokenCost: '¥847.50',
  total: '¥5,096.50'
})

// Alert
const showAlert = computed(() => {
  return quotaPercentage.value >= 80 || billingInfo.value.overage > 0
})

const alertMessage = computed(() => {
  if (billingInfo.value.overage > 0) {
    return '资源使用即将超限'
  }
  return '账户状态正常'
})

const alertType = computed(() => {
  if (billingInfo.value.overage > 0) {
    return 'warning'
  }
  return 'success'
})

// Initialize charts
const initCharts = () => {
  // CPU chart (ring progress)
  if (cpuChart.value) {
    cpuChartInstance = echarts.init(cpuChart.value)
    const cpuOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: '#1890FF'
            }
          },
          axisLine: {
            lineStyle: {
              width: 6
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 75,
              name: 'CPU'
            }
          ]
        }
      ]
    }
    cpuChartInstance.setOption(cpuOption)
  }

  // GPU chart (bar progress)
  if (gpuChart.value) {
    gpuChartInstance = echarts.init(gpuChart.value)
    const gpuOption = {
      xAxis: {
        type: 'category',
        show: false,
        data: ['GPU']
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: [78.2],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: '#1890FF'
          }
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
    gpuChartInstance.setOption(gpuOption)
  }

  // Memory chart (liquid fill)
  if (memoryChart.value) {
    memoryChartInstance = echarts.init(memoryChart.value)
    const memoryOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: '#52C41A'
            }
          },
          axisLine: {
            lineStyle: {
              width: 7
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 65,
              name: 'Memory'
            }
          ]
        }
      ]
    }
    memoryChartInstance.setOption(memoryOption)
  }

  // Trend chart (area chart with line overlay)
  if (trendChart.value) {
    trendChartInstance = echarts.init(trendChart.value)
    const trendOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890FF'
          }
        },
        {
          data: [120, 200, 150, 80, 70, 110],
          type: 'area',
          smooth: true,
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.2)'
          }
        }
      ]
    }
    trendChartInstance.setOption(trendOption)
  }

  // Storage chart (pie chart)
  if (storageChart.value) {
    storageChartInstance = echarts.init(storageChart.value)
    const storageOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: false
      },
      series: [
        {
          name: '存储使用分布',
          type: 'pie',
          radius: ['70%', '90%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 34, name: '模型存储' },
            { value: 25, name: '数据集' },
            { value: 18, name: '日志文件' },
            { value: 15, name: '缓存文件' },
            { value: 8, name: '其他' }
          ]
        }
      ]
    }
    storageChartInstance.setOption(storageOption)
  }
}

// Resize charts when window is resized
const resizeCharts = () => {
  if (cpuChartInstance) cpuChartInstance.resize()
  if (gpuChartInstance) gpuChartInstance.resize()
  if (memoryChartInstance) memoryChartInstance.resize()
  if (trendChartInstance) trendChartInstance.resize()
  if (storageChartInstance) storageChartInstance.resize()
}
const currentUserInfo = ref({})
onMounted(() => {
  initCharts()
  currentUserInfo.value = JSON.parse(localStorage.getItem('app')).userInfo
  window.addEventListener('resize', resizeCharts)
  // Animate token counter
  animateCounter(0, tokenUsage.value, 2000)
})

// Clean up event listeners
// In Vue 3, this is automatically handled by the framework
</script>

<style scoped>
.usage-statistics {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.user-info-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 15px;
}

.user-details h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.user-details p {
  margin: 3px 0;
  color: #666;
  font-size: 13px;
}

.time-range-selector {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.overview-cards {
  margin-bottom: 15px;
}

.overview-card {
  //height: 150px;
}

.card-header h4 {
  margin: 0;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 70px;
  height: 70px;
}

.usage-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 8px;
}

.token-counter {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.token-unit {
  font-size: 14px;
  color: #666;
  margin-left: 5px;
}

.detailed-visualizations {
  margin-bottom: 20px;
}

.visualization-card {
  min-height: 350px;
}

.chart-container-large {
  width: 100%;
  min-height: 250px;
}

.chart-container-medium {
  width: 100%;
 min-height: 180px;
}

.storage-quota {
  margin-top: 15px;
}

.quota-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.billing-card {
  margin-bottom: 15px;
  min-height: 250px;
  overflow: auto !important;
}

.billing-content h5 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #333;
}

.billing-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.billing-content li {
  padding: 3px 0;
  font-size: 13px;
  color: #666;
}

.billing-content .overage {
  color: #FA541C;
  font-weight: bold;
}

.billing-content .total {
  font-weight: bold;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
  padding-top: 8px;
}

.alert-section {
  margin-top: 15px;
}
.cpu-container{
  width: 100px !important;
}

</style>