<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click ="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: { // 计算属性
    catName (){
      if(!this.allData){
        return ''
      }else{
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return{
        fontSize: this.titleFontSize + 'px'
      }
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
  },
  methods: {
    initChart () {
      this.chartInstance =  this.$echarts.init(this.$refs.hot_ref,'chalk')
      const initOption = {
        title: {
          text: '▎饼状图表展示',
          left: 20,
          top: 20
        },
        legend: {
          top: '5%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            //console.log(arg)
            const thirdCategory = arg.data.children
            
            // 计算出所有三级分类的数值总和
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
              // console.log(total)
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name}: ${parseInt(item.value / total * 100) + '%'}
              <br>`
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              formatter: (arg) => {
                // console.log(arg)
                return arg.name + arg.percent+'%'
              }
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: true  // 饼状图指引线
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      },
    async getData () {
      // 获取服务器的数据,对this.allData进行赋值之后,调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('hot') // 通过结构赋值,获取到数据
      this.allData = ret
      console.log(ret)
      this.updateChart()
     
    },
    updateChart () {
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData,
            emphasis: {
              label: {
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 150 * 3.6
      // console.log(titleFontSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if(this.currentIndex < 0){
        this.currentIndex = this.allData.length -1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if(this.currentIndex > this.allData.length -1){
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang='less' scoped>
.arr-left{
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer; // 鼠标一上去显示小手
  color: white;
}
.arr-right{
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 80px;
  color: white;
}
</style>
