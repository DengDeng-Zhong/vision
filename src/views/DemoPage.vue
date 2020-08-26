<!--
针对于 /trendpage 这条路径而显示出来的
在这个组件中,通过子组件注册的方式,要显示trend.vue这个组件
-->
<template>
  <div class="com-page">
    <demo></demo>
  </div>
</template>

<script>
import Demo from '../components/Demo'
export default {
  data () {
    return {}
  },
  methods: {},
  components: {
    demo: Demo
  }
}
</script>

<style lang="less" scoped>
</style>
