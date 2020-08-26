import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/SellerPage'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
import RankPage from '../views/RankPage.vue'
import DemoPage from '../views/DemoPage.vue'
import HotPage from '../views/HotPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  },
  {
    path: '/mappage',
    component: MapPage
  },
  {
    path: '/rankpage',
    component: RankPage
  },
  {
    path: '/demopage',
    component: DemoPage
  },
  {
    path: '/hotpage',
    component: HotPage
  }
]

const router = new VueRouter({
  routes
})

export default router
