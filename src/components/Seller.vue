<!--商家销量统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共多少页
      timerId: null // 定时器ID
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    // 组件销毁的时候需要将监听器取消掉
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {
    // 初始化echartInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '▎未关闭事件单',
          textStyle: {
            fontSize: 66
          },
          top: 20,
          left: 20
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '6%',
          bottom: '3%',
          containLable: true // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 66,
            label: {
              show: true, // 开启显示
              position: 'right', // 在上方显示
              textStyle: { // 数值样式
                color: 'white',
                fontSize: 16
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0], // （顺时针左上，右上，右下，左下）
              // 指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0%的颜色
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 100%的颜色
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象进行鼠标事件监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData () {
      // http://localhost:8081/api/seller
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret

      // 对数据进行排序
      this.allData.sort((a, b) => {
        return a.value - b.value // 从小到大排序
      })
      console.log(ret)

      this.totalPage = this.allData.length % 15 === 0 ? this.allData.length / 15 : this.allData.length / 15 + 1
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 15
      const end = this.currentPage * 15
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 定时器,5秒加载一次数据
    startInterval () {
      console.log('startInterval')
      // 为保险起见,启动定时器时先判断是否已经存在定时器,如果有则先关闭原来的
      if (this.timerId) {
        clearInterval(this.timerId)
      }

      this.timerId = setInterval(() => {
        this.currentPage++
        // 如果自增的页数大于现有页数,则回到第一页
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 5000)
    },
    // 屏幕分辨率适配(浏览器的大小发生变化时)
    screenAdapter () {
      // 通过获取当前图表div的状态变化情况来识别分辨率
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 150 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
