<template>
  <a-image-preview-group>
    <a-space>
      <template v-for="(item, index) in data" :key="index">
        <div class="image-upload-item" v-if="isImage(item.url)">
          <a-image
            :style="{
              border: '1px dashed var(--grey-7)',
              width: width + 'px',
              height: height + 'px'
            }"
            :src="item.url"
          />
          <a class="image-upload-close" @click="onDeleteItem(index)">
            <CloseOutlined />
          </a>
        </div>
        <div v-else class="image-upload-item">
          <YoutubeOutlined />
          <a class="image-upload-close" @click="onDeleteItem(index)">
            <CloseOutlined />
          </a>
        </div>
      </template>
      <a-button
        @click="openEdit"
        v-if="data?.length < limit"
        :style="{ width: width + 'px', height: height + 'px' }"
        class="select-picture-btn ele-text-placeholder"
      >
        <PlusOutlined />
      </a-button>
    </a-space>
  </a-image-preview-group>

  <!-- 选择弹窗 -->
  <SelectData
    v-model:visible="showEdit"
    :data="current"
    :title="placeholder"
    :type="type"
    @done="onChange"
  />
</template>

<script lang="ts" setup>
  import { PlusOutlined, CloseOutlined, YoutubeOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import SelectData from './components/select-data.vue';
  import { FileRecord } from '@/api/system/file/model';
  import { isImage } from "@/utils/common";

  const props = withDefaults(
    defineProps<{
      value?: any;
      data?: any[];
      width?: number;
      height?: number;
      type?: string;
      limit?: number;
      placeholder?: string;
      index?: number;
    }>(),
    {
      placeholder: '请选择数据',
      width: 80,
      height: 80,
      limit: 1
    }
  );

  const emit = defineEmits<{
    (e: 'done', data: FileRecord): void;
    (e: 'del', index: number): void;
    (e: 'clear'): void;
  }>();

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 当前编辑数据
  const current = ref<FileRecord | null>(null);

  /* 打开编辑弹窗 */
  const openEdit = (row?: FileRecord) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  const onChange = (row) => {
    row.index = props.index;
    emit('done', row);
  };

  const onDeleteItem = (index: number) => {
    emit('del', index);
  };
</script>
<style lang="less" scoped>
  .select-picture-btn {
    background-color: var(--grey-9);
    border: 1px dashed var(--border-color-base);
    font-size: 16px;
  }
  //.ant-image-img {
  //  width: 100px !important;
  //  height: 100px !important;
  //}
  .image-upload-item {
    position: relative;
  }
  .image-upload-close {
    width: 18px;
    height: 18px;
    color: rgb(255, 255, 255);
    font-size: 10px;
    border-bottom-left-radius: 18px;
    border-top-right-radius: 2px;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 1px;
    right: 1px;
    line-height: 1;
    box-sizing: border-box;
    padding: 2px 0 0 5px;
    transition: background-color 0.2s ease-in-out 0s;
    cursor: pointer;
    z-index: 2;
    //display: flex;
    //justify-content: center;
    //align-items: center;
  }
  .image-upload-close:hover {
    background-color: var(--red-6);
  }
</style>
