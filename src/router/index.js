import Vue from 'vue'
import Router from 'vue-router'
import PlayArea from '@/components/PlayArea'
import Reversi from '@/components/Reversi'
import NotFound from '@/components/error/NotFound'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PlayArea',
      component: PlayArea
    },
    {
      path: '/reversi',
      name: 'reversi',
      component: Reversi
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})
