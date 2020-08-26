<template>
  <div class="com-container">
    test
    <div class="com-chart" ref="demo_ref">1111</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
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
      this.chartInstance =  this.$echarts.init(this.$refs.demo_ref)
      const initOption = {}
      },
    async getData () {
      // 获取服务器的数据,对this.allData进行赋值之后,调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('demo') // 通过结构赋值,获取到数据
      this.allData = ret
     
    },
    updateChart () {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
