<!--商家销量统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      startValue: 0, // 区域缩放的起点
      endValue: 14, // 区域缩放的终点
      timerId: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter() // 第一次加载 自适应文字
  },
  destroyed () {
    window.removeEventListener('resize',this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance =  this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎报单系统排行(已关闭/未关闭堆叠图)',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: "5%",
          botttom: '5%',
          containLable: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'bar',
          itemStyle: {
              normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
                    color: '#1E90FF'
									}
								}
							}
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      // 获取服务器的数据,对this.allData进行赋值之后,调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('rank') // 通过结构赋值,获取到数据
      this.allData = ret
      // 对allData里面的每一个元素进行排序,从大到小
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      console.log(ret)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]

      // 处理图表需要的数据
      const keyArr = this.allData.map(item => {
        return item.name
      })
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: keyArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue        
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 150 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
              fontsize: titleFontSize
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if(this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if(this.endValue > this.allData.length - 1){
          this.startValue = 0
          this.endValue = 14
        }
        this.updateChart()
      }, 2500)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
