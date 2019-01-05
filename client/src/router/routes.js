let userid = localStorage.getItem('userId')

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('pages/Home.vue') },
      { path: 'register-confirmation', name: 'RegisterConfirmation', component: () => import('pages/RegisterConfirmation.vue') },
      { path: !userid ? 'list' : '', name: 'list', component: () => import('pages/TrackList.vue') },
      { path: 'vote', name: 'vote', component: () => import('pages/Vote.vue') },
      { path: 'search', name: 'search', component: () => import('pages/Search.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue') },
      { path: 'connect', name: 'connect', component: () => import('pages/Connect.vue') },
      { path: 'repet', name: 'repet', component: () => import('pages/Repet.vue') },
      { path: 'group-creation', name: 'groupCreation', component: () => import('pages/GroupCreation.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
