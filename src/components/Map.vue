<!--商家分布图表 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      mapData: {} // 获取到的省份的地图矢量数据缓存 
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
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
      // 获取中国地图的矢量数据
      // http://localhost:8082/static/map/china.json
      const ret = await axios.get('http://localhost:8082/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎运维人员分布图',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        tooltip: {
          show: true
        },
        color: ['#800080','#ED7C30','#80FF80'], //图例颜色
        legend: {
          left: '5%',
          bottom: '5%',
          icon: 'rect',
          orient: 'vertical',
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        // console.log(arg)
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        // 需要获取这个省份的地图矢量数据
        // 判断当前所点击的这个省份的地图矢量数据在mapData中是否存在,判断后才决定是否进行一次ajax请求
        if(!this.mapData[provinceInfo.key]){
          const ret = await axios.get('http://localhost:8082' + provinceInfo.path)
          console.log(ret)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData () {
      const { data : ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updateChart ()
    },
    updateChart () {
      // 图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // 如果想在地图中显示散点数据,需要给散点的图表增加一个配置,coordinateSystem
        return {
          type: 'effectScatter',
          name: item.name,
          rippleEffect: {
            period: 7,
            scale: 5,
            brushType: 'stroke'
          },
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {itemWidth: titleFontSize / 2, itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到上一级地图的方法
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
