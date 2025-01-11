import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NoAuthView from '@/views/NoAuthView.vue'

import UserLoginView from '@/views/user/UserLoginView.vue'
import UserRegisterView from '@/views/user/UserRegisterView.vue'

import MyCenterView from '@/views/MyCenterView.vue'
import UserManageView from '@/views/admin/UserManageView.vue'
import AddPictureView from '@/views/AddPictureView.vue'
import AddSpaceView from '@/views/AddSpaceView.vue'
import AddPictureBatchView from '@/views/AddPictureBatchView.vue'
import PictureManageView from '@/views/admin/PictureManageView.vue'
import SpaceManageView from '@/views/admin/SpaceManageView.vue'
import PictureDetailView from '@/views/PictureDetailView.vue'
import SpaceDetailView from '@/views/SpaceDetailView.vue'
import SearchPictureView from '@/views/SearchPictureView.vue'
import MySpaceView from '@/views/MySpaceView.vue'
import SpaceAnalyzeView from '@/views/SpaceAnalyzeView.vue'
import ACCESS_ENUM from "@/access/accessEnum";

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '首页',
    component: HomeView,
  },
  {
    path: '/user/login',
    name: '用户登录',
    component: UserLoginView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/user/register',
    name: '用户注册',
    component: UserRegisterView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/my_center',
    name: '个人中心',
    component: MyCenterView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/add_picture',
    name: '创建图片',
    component: AddPictureView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/add_space',
    name: '创建空间',
    component: AddSpaceView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/add_picture/batch',
    name: '批量创建图片',
    component: AddPictureBatchView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/admin',
    name: '管理页面',
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
    children: [
      {
        path: 'userManage',
        name: '用户管理',
        component: UserManageView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'pictureManage',
        name: '图片管理',
        component: PictureManageView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'spaceManage',
        name: '空间管理',
        component: SpaceManageView,
        meta: {
          access: ACCESS_ENUM.ADMIN,
        },
      },
    ]
  },
  {
    path: '/picture/:id',
    name: '图片详情',
    component: PictureDetailView,
    props: true,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/space/:id',
    name: '空间详情',
    component: SpaceDetailView,
    props: true,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/search_picture',
    name: '以图搜图',
    component: SearchPictureView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/my_space',
    name: '我的空间',
    component: MySpaceView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/space_analyze',
    name: '空间分析',
    component: SpaceAnalyzeView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/noAuth',
    name: '无权限',
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
]
