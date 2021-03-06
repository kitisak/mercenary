import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/containers/login'
import Tutorial from '@/containers/Tutorial'
import Home from '@/containers/home'
// import Collection from '@/containers/collection'
import Lobby from '@/containers/lobby'
import Battle from '@/containers/battle'
import Create from '@/containers/create'
import Join from '@/containers/join'

import { Observable } from 'rxjs'
import { Auth, User, Room, Loader } from '@/services'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { auth: true }
    },
    // {
    //   path: '/collection',
    //   name: 'Collection',
    //   component: Collection,
    //   meta: { auth: true }
    // },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby,
      props: (to) => ({ id: to.params.id }),
      meta: { auth: true }
    },
    {
      path: '/create',
      name: 'Create',
      component: Create,
      meta: { auth: true }
    },
    {
      path: '/join/:id',
      name: 'Join',
      component: Join,
      props: (to) => ({ id: to.params.id }),
      meta: { auth: true }
    },
    {
      path: '/battle',
      name: 'Battle',
      component: Battle,
      meta: { auth: true }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  Loader.stop()
  Auth.currentUser
    .first()
    .flatMap((user) =>
      user
        ? User.getCurrentRoom()
          .flatMap((id) => id
            ? Room.get(id)
              .do((room) => {
                if (!room) {
                  User.setCurrentRoom(null)
                }
              })
            : Observable.of(null))
        : Observable.of(user),
      (user, room) => ([ user, room ]))
    .subscribe(
      ([ user, room ]) => {
        if (user && (to.name !== 'Lobby' && to.name !== 'Battle') && room) {
          next({ name: 'Lobby' })
          return
        }
        if (user && (to.name === 'Lobby' || to.name === 'Battle') && !room) {
          next({ name: 'Home' })
          return
        }
        if (to.meta.auth && !user) {
          next({ name: 'Login' })
          return
        }
        if (!to.meta.auth && user && to.name !== 'Tutorial') {
          next({ name: 'Home' })
          return
        }
        next()
      }
    )
})

export default router
