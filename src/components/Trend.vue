<!--商家销量统计的横向柱状图 -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎ ' +  showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      showChoice: false, // 是否显示可选项
      chioceType: 'map', // 显示数据类型
      titleFontSize: 0 // 全局字体大小
    }
  },
  mounted () {
    this.initChart(
    )
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter() // 第一次加载 自适应文字
  },
  destroyed () {
    window.removeEventListener('resize',this.screenAdapter)
  },
  computed: {
    // 选择类型的计算
    selectTypes () {
      if(!this.allData){
        return []
      }else{
        return this.allData.type.filter(item => {
          return item.key !== this.chioceType
        })
      }
    },
    // 当前类型显示的计算
    showTitle () {
      if(!this.allData){
        return ''
      }else{
        return this.allData[this.chioceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    // 计算下拉选不对齐的问题
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '4%',
          top: '30%',
          right: '4%',
          bottom: '5%',
          containLable: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const {data: ret } = await this.$http.get('trend')
      //console.log(ret)
      this.allData = ret
      this.updateChart ()
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      // 类目轴的数据
      const timeArr = this.allData.common.month
      // y轴的数据 series下的数据
      const valueArr = this.allData[this.chioceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.chioceType,
          areaStyle: {
            // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // 0%的颜色
                {
                  offset: 0,
                  color: colorArr1[index]
                },
                // 100%的颜色
                {
                  offset: 1,
                  color: colorArr2[index]
                }
              ])
          }
        }
      })
      // 图例数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr

      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGrap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect (currentType) {
      this.chioceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang='less' scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
.select-con {
  background-color: #222733;
}
</style>
