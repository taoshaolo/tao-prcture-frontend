<template>
  <div id="spaceManageView">
    <a-flex justify="space-between">
      <h2>成员信息</h2>
    </a-flex>
    <div style="margin-bottom: 25px" />
    <a-form v-if="canManageSpaceUser" layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格 -->
    <a-table :columns="dynamicColumns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a @click="goToUserDetail(record.user?.id)" style="color: black">
            <a-space>
              <a-avatar :src="record.user?.userAvatar" />
              {{ record.user?.userName }}
              <a-tag color="blue" v-if="loginUser.id === record.user?.id">我</a-tag>
            </a-space>
          </a>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-if="canManageSpaceUser"
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value) => editSpaceRole(value, record)"
          />
          <template v-else>
            <div v-if="record.spaceRole === 'viewer'">
              <a-tag color="green">{{ SPACE_ROLE_MAP[record.spaceRole] }}</a-tag>
            </div>
            <div v-else-if="record.spaceRole === 'editor'">
              <a-tag color="blue">{{ SPACE_ROLE_MAP[record.spaceRole] }}</a-tag>
            </div>
            <div v-else-if="record.spaceRole === 'admin'">
              <a-tag color="pink">{{ SPACE_ROLE_MAP[record.spaceRole] }}</a-tag>
            </div>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-popconfirm
            title="你确定删除吗？"
            ok-text="是"
            cancel-text="否"
            @confirm="doDelete(record.id)"
          >
            <a-button type="primary" ghost danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { SPACE_PERMISSION_ENUM, SPACE_ROLE_MAP, SPACE_ROLE_OPTIONS } from '@/constants/space'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  getPermissionListUsingGet,
  listSpaceUserUsingPost,
} from '@/api/spaceUserController'
import { useRouter } from 'vue-router'
import {useLoginUserStore} from "@/stores/useLoginUserStore";

// 表格列
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
]

// 动态生成列
const dynamicColumns = computed(() => {
  let cols = [...columns]
  if (canManageSpaceUser.value) {
    cols.push({
      title: '操作',
      key: 'action',
    })
  }
  return cols
})

// 定义属性
interface Props {
  id: string
}

const props = defineProps<Props>()

const loginUser = useLoginUserStore().loginUser

// 数据
const dataList = ref([])

const permissionList = ref<string[]>()

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (permissionList.value ?? []).includes(permission)
  })
}

const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)

// 获取数据
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId,
  })
  if (res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 获取权限
const getPermissionList = async () => {
  const res = await getPermissionListUsingGet({
    id: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    permissionList.value = res.data.data
  } else {
    message.error('获取权限失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
  getPermissionList()
})

const editSpaceRole = async (value, record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
    fetchData()
  }
}

const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 添加用户
const formData = reactive<API.SpaceUserAddRequest>({})

const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}

const router = useRouter()

// 跳转到用户详情页
const goToUserDetail = (id: string) => {
  router.push({
    path: `/personal_center/${id}`,
  })
}
</script>
