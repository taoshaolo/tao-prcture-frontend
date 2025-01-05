import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/user/UserLoginView.vue'
import UserRegisterView from '../views/user/UserRegisterView.vue'
import UserManageView from '../views/admin/UserManageView.vue'
import AddPictureView from '../views/AddPictureView.vue'
import PictureManageView from '../views/admin/PictureManageView.vue'
import PictureDetailPage from '../views/PictureDetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginView,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterView,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManageView,
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPictureView,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManageView,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
