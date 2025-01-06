<template>
  <div id="addPictureBatchView">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <!-- 图片信息表单 -->
    <a-form name="formData" layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="searchText" label="关键词">
        <a-input v-model:value="formData.name" placeholder="请输入关键词" allow-clear />
      </a-form-item>
      <a-form-item name="count" label="抓取数量">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入数字"
          style="min-width: 180px"
          min="1"
          max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="namePrefix" label="名称前缀">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="请输入名称前缀，会自动补充序号"
          allow-clear
        />
      </a-form-item>
      <!--      <a-form-item name="category" label="分类">-->
      <!--        <a-auto-complete-->
      <!--          v-model:value="formData.category"-->
      <!--          placeholder="请输入分类"-->
      <!--          :options="categoryOptions"-->
      <!--          allow-clear-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item name="tags" label="标签">-->
      <!--        <a-select-->
      <!--          v-model:value="formData.tags"-->
      <!--          mode="tags"-->
      <!--          placeholder="请输入标签"-->
      <!--          :options="tagOptions"-->
      <!--          allow-clear-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          批量创建
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  uploadPictureByBatchUsingPost,
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'

const formData = reactive<API.PictureEditRequest>({})
const loading = ref(false)
const router = useRouter()

const handleSubmit = async (values: any) => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(`创建成功，共 ${res.data.data} 条 `)
    // 跳转到首页
    router.push({
      path: `/`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
  loading.value = false
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

<style scoped>
#addPictureBatchView {
  max-width: 720px;
  margin: 0 auto;
}
</style>
