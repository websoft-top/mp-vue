<template>
  <div class="page">
    <a-row :gutter="20">
      <a-col
        v-for="(item, index) in data"
        :key="index"
        v-bind="
          styleResponsive
            ? { xl: 4, lg: 8, md: 12, sm: 12, xs: 24 }
            : { span: 6 }
        "
      >
        <a-card
          :bordered="false"
          hoverable
          style="margin-top: 16px"
          v-if="item"
        >
          <template #cover>
            <!-- 文件类型 -->
            <template v-if="!isImage(item.path)">
              <span
                class="ele-text-secondary ele-text-center"
                style="padding: 20px 0"
                >[文件]</span
              >
            </template>
            <template v-else-if="item.path.indexOf('https://oss') == 0">
              <a-image
                :src="`${item.path}`"
                :preview="{
                  src: `${item.downloadUrl}`
                }"
              />
            </template>
            <template v-else>
              <a-image :src="`https://file.jimeigroup.cn${item.path}`" alt="" />
            </template>
          </template>
          <a-card-meta :title="item.name" @click="openEdit(item)">
            <template #description>
              <div
                class="project-list-desc"
                v-if="item.comments"
                :title="item.comments"
              >
                {{ item.comments }}
              </div>
            </template>
          </a-card-meta>
          <div class="ele-cell">
            <div
              class="ele-cell-content ele-text-secondary"
              @click="openEdit(item)"
            >
              {{ timeAgo(item.createTime) }}
            </div>
            <a-tooltip :title="item.createNickname" placement="top">
              <a-avatar
                :src="item.avatar"
                size="smal/down/webshop_v2.2.5.tar.gzl"
              />
            </a-tooltip>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- 编辑弹窗 -->
    <PhotoEdit v-model:visible="showEdit" :data="current" @done="query" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import { FileRecord, FileRecordParam } from '@/api/system/file/model';
  import PhotoEdit from './components/photo-edit.vue';
  import { timeAgo } from 'ele-admin-pro';
  import { isImage } from '@/utils/common';

  const props = defineProps<{
    // 搜索关键字
    searchText: string;
    // 搜索条件
    where?: FileRecordParam | null;
    // 修改回显的数据
    data?: FileRecord[] | [];
  }>();

  // 当前编辑数据
  const current = ref<FileRecord | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);

  const emit = defineEmits<{
    (e: 'done'): void;
  }>();

  /* 打开编辑弹窗 */
  const openEdit = (row?: FileRecord) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const query = () => {
    emit('done');
  };

  watch(
    () => props.data,
    (visible) => {
      if (visible) {
        console.log(visible);
      } else {
      }
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'PhotoImage'
  };
</script>

<style lang="less" scoped>
  .project-list-desc {
    height: 44px;
    line-height: 22px;
    margin-bottom: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
