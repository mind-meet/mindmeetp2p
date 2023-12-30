import { createRouter, createWebHistory } from 'vue-router'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: () => import('./views/index.vue'), name: 'index' },
  { path: '/join/:id', component: () => import('./views/_id.vue'), name: 'join' },
   { path: '/:pathMatch(.*)*', component: () => import('./views/404.vue'), name: '404' },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

export default router;
