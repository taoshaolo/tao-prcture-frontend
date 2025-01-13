<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <GlobalSider class="sider" />
        <a-layout-content class="content">
          <Vue3Marquee class="marquee-text" :duration="30">
            亲爱的用户，欢迎您来到 [涛-智能协同云图库] 哦 💕
            这里就像一个装满宝藏的图片盒子，无论您是在寻找精美的壁纸，
            还是可爱的头像，亦或是搞笑的表情包，我们都能满足您的需求呢！您可以自由上传您喜欢的图片，也可以下载那些让您心动的图片，
            让我们一起分享和探索这个充满乐趣的图片世界吧 🌈
            <span class="highlight">😊温馨提示：点击免费下载，才是高清原图哦😎</span>
          </Vue3Marquee>
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        作者：涛少
        <a href="https://github.com/taoshaolo" target="_blank">
          <GithubOutlined />
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
import { Vue3Marquee } from 'vue3-marquee'
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 20px;
  background: white;
  color: unset;
  margin-bottom: 1px;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
  padding: 8px 16px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .header {
  margin-bottom: 1px;
}

#basicLayout .sider {
  background: #fff;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

#basicLayout .marquee-text {
  height: 40px;
  background: #ecf9ff;
  padding: 0 16px;
  color: #1989fa;
  font-size: 14px;
  line-height: 24px;
}

.highlight {
  color: #ff5722; /* 深红色 */
  font-weight: bold; /* 加粗 */
}
</style>
