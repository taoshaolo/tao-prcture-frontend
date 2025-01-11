import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/user/UserLoginView.vue'
import UserRegisterView from '../views/user/UserRegisterView.vue'
import UserManageView from '../views/admin/UserManageView.vue'
import AddPictureView from '../views/AddPictureView.vue'
import AddPictureBatchView from '../views/AddPictureBatchView.vue'
import PictureManageView from '../views/admin/PictureManageView.vue'
import PictureDetailView from '../views/PictureDetailView.vue'
import SpaceManageView from '../views/admin/SpaceManageView.vue'
import AddSpaceView from '../views/AddSpaceView.vue'
import MySpaceView from '../views/MySpaceView.vue'
import SpaceDetailView from '../views/SpaceDetailView.vue'
import SearchPictureView from '../views/SearchPictureView.vue'
import MyCenterView from '../views/MyCenterView.vue'
import SpaceAnalyzeView from '../views/SpaceAnalyzeView.vue'

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
      path: '/my_center',
      name: '用户注册',
      component: MyCenterView,
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
      path: '/add_space',
      name: '创建空间',
      component: AddSpaceView,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchView,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManageView,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManageView,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailView,
      props: true,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailView,
      props: true,
    },
    {
      path: '/search_picture',
      name: '以图搜图',
      component: SearchPictureView,
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpaceView,
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component: SpaceAnalyzeView,
    },

  ],
})

export default router
