<template>
  <div id="spaceManageView">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank">
          分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank">
          分析全空间
        </a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!-- 搜索 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="空间类别" name="spaceType">
        <a-select
          v-model:value="searchParams.spaceType"
          :options="SPACE_TYPE_OPTIONS"
          placeholder="请输入空间类别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="用户 id">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 25px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!-- 空间级别 -->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div v-if="record.spaceLevel === 0">
            <a-tag>普通版</a-tag>
          </div>
          <div v-else-if="record.spaceLevel === 1">
            <a-tag color="blue">专业版</a-tag>
          </div>
          <div v-else-if="record.spaceLevel === 2">
            <a-tag color="pink">旗舰版</a-tag>
          </div>
        </template>
        <!-- 空间类别 -->
        <template v-if="column.dataIndex === 'spaceType'">
          <div v-if="record.spaceType === 0">
            <a-tag color="green">私有空间</a-tag>
          </div>
          <div v-else-if="record.spaceType === 1">
            <a-tag color="purple">团队空间</a-tag>
          </div>
        </template>
        <!-- 使用情况 -->
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" :href="`/space_analyze?spaceId=${record.id}`" target="_blank">
              分析
            </a-button>
            <a-button type="link" :href="`/add_space?id=${record.id}`"> 编辑</a-button>
            <a-popconfirm
              title="你确定删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="doDelete(record.id)"
            >
              <a-button danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils'
import dayjs from 'dayjs'
import { SPACE_LEVEL_OPTIONS, SPACE_TYPE_OPTIONS } from '@/constants/space'
import { listPictureTagCategoryUsingGet } from '@/api/pictureController'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 定义数据
const dataList = ref<API.Space[]>([])
const total = ref<number>(0)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 表格变换，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: number) => {
  const res = await deleteSpaceUsingPost({
    id,
  })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})
</script>
