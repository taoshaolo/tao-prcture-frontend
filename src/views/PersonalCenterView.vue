<template>
  <div id="personalCenterView">
    <h2>个人中心</h2>
    <a-card class="myCenterCard">
      <a-form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        layout="horizontal"
        :disabled="componentDisabled"
        :model="userForm"
        style="max-width: 600px"
      >
        <a-upload
          name="avatar"
          list-type="picture-card"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :custom-request="handleUpload"
        >
          <div v-if="userForm.userAvatar">
            <img :src="userForm.userAvatar" alt="avatar" class="userAvatar" />
          </div>
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
        <div style="margin-top: 16px" />
        <a-form-item name="id" label="用户id" style="text-align: left">
          <a-typography-paragraph :copyable="{ text: userForm.id }">
            {{ userForm.id }}
          </a-typography-paragraph>
        </a-form-item>
        <a-form-item name="userAccount" label="账号" style="text-align: left">
            {{ userForm.userAccount }}
        </a-form-item>
        <a-form-item name="sex" label="性别">
          <a-select v-model:value="userForm.sex" :options="sexOptions" style="text-align: left" />
        </a-form-item>
        <a-form-item name="userName" label="昵称">
          <a-input v-model:value="userForm.userName" />
        </a-form-item>
        <a-form-item name="userProfile" label="简介">
          <a-textarea v-model:value="userForm.userProfile" />
        </a-form-item>
        <a-form-item name="userRole" label="用户角色" style="text-align: left">
          {{ userForm.userRole }}
        </a-form-item>
        <a-form-item name="createTime" label="创建时间" style="text-align: left">
          {{ dayjs(userForm.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </a-form-item>
      </a-form>
      <a-space>
        <a-button type="primary" v-if="canEdit" ghost @click="handleSubmit" :icon="h(EditOutlined)">编辑</a-button>
        <a-button type="default" v-if="isEditing" @click="handleCancel" :icon="h(CloseOutlined)"
          >取消
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import {h, onMounted, reactive, ref, defineProps, computed} from 'vue'
import { EditOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { getUserVoByIdUsingGet, updateMyUserUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message, UploadProps } from 'ant-design-vue'
import { uploadFileUsingPost } from '@/api/fileController'
import dayjs from 'dayjs'
import {useRoute} from "vue-router";

const componentDisabled = ref(true)
const labelCol = { style: { width: '150px' } }

const wrapperCol = { span: 14 }

const userForm = reactive<API.UserVO>({})
const sexOptions = ref([
  { label: '男', value: 0 },
  { label: '女', value: 1 },
])

const isEditing = ref(false) // 新增状态变量用于跟踪是否处于编辑状态
const loginUserStore = useLoginUserStore()

const route = useRoute();

const getOldUserInfo = async () => {
  const res = await getUserVoByIdUsingGet({
    id: route.params.id,
  })

  if (res.data.code === 0 && res.data.data) {
    userForm.id = res.data.data.id
    userForm.userName = res.data.data.userName
    userForm.userAccount = res.data.data.userAccount
    userForm.userAvatar = res.data.data.userAvatar
    userForm.userProfile = res.data.data.userProfile
    userForm.userRole = res.data.data.userRole
    userForm.createTime = res.data.data.createTime
    userForm.sex = res.data.data.sex
  } else {
    message.error('获取用户信息失败')
  }
}

onMounted(() => {
  getOldUserInfo()
})

const handleCancel = () => {
  // 恢复
  Object.assign(userForm, getOldUserInfo())
  componentDisabled.value = true
  isEditing.value = false
}

// 是否有权限编辑
const canEdit = computed(() => {
  return loginUserStore.loginUser?.id === userForm.id;
});

const handleSubmit = async () => {
  if (!isEditing.value) {
    // 如果当前不是编辑状态
    componentDisabled.value = false // 开启编辑
    isEditing.value = true // 设置为编辑状态
  } else {
    // 如果当前是编辑状态
    const res = await updateMyUserUsingPost({
      ...userForm,
    })
    if (res.data.code === 0 && res.data.data) {
      message.success('修改成功')
      // 更新存储中的用户信息
      loginUserStore.setLoginUser({
        ...userForm,
      })
      componentDisabled.value = true // 关闭编辑
      isEditing.value = false // 设置为非编辑状态
    } else {
      message.error('修改失败')
    }
  }
}

const loading = ref<boolean>(false)
/**
 * 上传头像
 * @param file
 */
const handleUpload = async ({ file }) => {
  loading.value = true
  try {
    const res = await uploadFileUsingPost(
      {
        biz: 'user_avatar',
      },
      {},
      file,
    )
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      userForm.userAvatar = res.data.data // 更新头像地址
    } else {
      message.error('上传失败，' + res.data.message)
    }
  } catch (error) {
    console.error('上传失败' + error)
    message.error('上传失败,' + error.message)
  }
  loading.value = false
}

/**
 * 上传头像之前的校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 图片格式校验
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该图片的格式，推荐 jpg 或 png')
  }
  // 图片大小校验
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB！')
  }
  return isJpgOrPng && isLt2M
}


</script>

<style scoped>
#personalCenterView .myCenterCard {
  max-width: 600px;
  text-align: center;
  margin: 0 auto;
}

#personalCenterView .userAvatar {
  width: 100%;
  border-radius: 5px;
}

div:where(.css-dev-only-do-not-override-1p3hq3p).ant-typography, :where(.css-dev-only-do-not-override-1p3hq3p).ant-typography p{
  margin-bottom: 0 !important;
}
</style>
