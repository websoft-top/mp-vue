<template>
  <div
    :class="data.key + ' ' + data.class"
    :style="data.style"
    @click="onClick"
  >
    {{ data.style }}
    {{ data.class }}
    <a-carousel arrows autoplay :dots="true">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 20px; z-index: 1">
          <LeftCircleOutlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 40px">
          <RightCircleOutlined />
        </div>
      </template>
      <template v-if="form.images">
        <template v-for="(item, index) in JSON.parse(form.images)" :key="index">
          <div class="ad-item">
            <a-image :preview="false" :src="item.url" width="100vw" />
            <a-space class="ad-text" :size="10" direction="vertical">
              <div class="title">{{ form.name }}</div>
              <div class="desc">{{ form.comments }}</div>
              <div class="btn"
                ><a-button
                  size="large"
                  style="padding: 0 30px"
                  @click="openNew(`${form.path}`)"
                  >了解更多</a-button
                ></div
              >
            </a-space>
          </div>
        </template>
      </template>
    </a-carousel>
  </div>
</template>
<script setup lang="ts">
  import { getAd } from '@/api/cms/ad';
  import useFormData from '@/utils/use-form-data';
  import { Ad } from '@/api/cms/ad/model';
  import { ref } from 'vue';
  import { openNew } from '@/utils/common';
  import {
    LeftCircleOutlined,
    RightCircleOutlined
  } from '@ant-design/icons-vue';

  const props = defineProps<{
    // 是否显示
    visible: boolean;
    // 修改回显的数据
    data?: any | null;
    index?: number | 0;
  }>();

  const emit = defineEmits<{
    (e: 'done', index: number): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const visible = ref<boolean>(false);

  // 表单数据
  const { form, assignFields } = useFormData<Ad>({
    adId: undefined,
    name: '',
    adType: '图片广告',
    images: '',
    width: '',
    height: '',
    path: '',
    type: '',
    status: 0,
    comments: '',
    sortNumber: 100
  });

  // 幻灯片样式
  const bodyStyle = {
    width: '100%'
  };

  const dotsClass = 'dots';

  const onChange = () => {
    visible.value = !visible.value;
  };

  const reload = () => {
    getAd(255).then((data) => {
      assignFields(data);
    });
  };

  reload();

  const onClick = () => {
    emit('done', Number(props.index));
  };
</script>
<style scoped lang="less">
  .hidden-sm-and-down {
    :deep(.slick-slide) {
      overflow: hidden;
    }
    :deep(.slick-arrow.custom-slick-arrow) {
      font-size: 38px;
    }
  }
  .hidden-sm-and-up {
    :deep(.slick-arrow.custom-slick-arrow) {
      top: 50px;
      font-size: 24px;
    }
  }
  .banner {
    :deep(.slick-arrow.custom-slick-arrow) {
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      transition: ease all 0.3s;
      opacity: 0.3;
      z-index: 1;
    }
    :deep(.slick-arrow.custom-slick-arrow:before) {
      display: none;
    }
    :deep(.slick-arrow.custom-slick-arrow:hover) {
      color: #fff;
      opacity: 0.5;
    }

    :deep(.slick-slide h3) {
      color: #fff;
    }

    .ad-item {
      position: relative;
    }
    .ad-text {
      display: none;
      top: 100px;
      left: 0;
      position: absolute;
      width: 1100px;
      margin: 0 20vw;
      z-index: 999;
      .title {
        font-size: 50px;
        text-align: center;
        color: #ffffff;
        font-weight: bold;
      }
      .desc {
        color: #ffffff;
        text-align: center;
      }
      .btn {
        text-align: center;
        margin-top: 30px;
      }
    }
    .slick-dots {
      background-color: #ff0000;
      font-size: 800px;
      width: 1000px;
    }
  }
</style>
