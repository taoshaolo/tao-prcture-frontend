<template>
  <div class="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="~@/assets/logo.png" alt="logo" />
            <div class="title">涛少云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu mode="horizontal" :selected-keys="selectedKeys" @click="doMenuClick">
          <template v-for="item in visibleRoutes">
            <a-menu-item v-if="!item.children" :key="item.path">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </a-menu-item>
            <a-sub-menu v-else :key="item.path">
              <template #title>{{ item.name }}</template>
              <a-menu-item v-for="child in item.children" :key="child.path">
                <router-link :to="{ path: `${item.path}/${child.path}` }">
                  {{ child.name }}
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" alt="avatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="user" @click="router.push('/my_center')">
                    <UserOutlined />
                    个人中心
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <CloudOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>

                  <a-menu-item key="logout" @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { LogoutOutlined, CloudOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
import checkAccess from '@/access/checkAccess'
import { routes } from '@/router/routes'

const loginUserStore = useLoginUserStore()

const router = useRouter()

// 当前选中的菜单项
const selectedKeys = ref(['/'])
// 路由跳转时，字段更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path]
})

// 展示在菜单栏的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false
    }
    // 根据权限过滤菜单
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
      return false
    }
    return true
  })
})

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

// 退出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出成功')
    router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出失败，' + res.data.message)
  }
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
