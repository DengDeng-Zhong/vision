import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/SellerPage'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
import RankPage from '../views/RankPage.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
