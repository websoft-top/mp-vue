<!-- 角色编辑弹窗 -->
<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <a-card :bordered="false">
      <div class="w-[700px]">
        <ele-xg-player
          :config="{
            id: 'demoPlayer1',
            lang: 'zh-cn',
            fluid: true,
            // 视频地址
            url: form.path,
            // 封面
            poster: '',
            // 开启倍速播放
            playbackRate: [0.5, 1, 1.5, 2],
            // 开启画中画
            pip: true
          }"
          @player="onPlayer1"
        />
      </div>
      <a-space direction="vertical" class="mt-5">
        <div class="ele-text-secondary">
          文件名称：{{ form.name }}
        </div>
        <div class="ele-text-secondary">
          文件路径：{{ form.path }}
        </div>
        <div class="ele-text-secondary">
          视频描述：{{ form.comments }}
        </div>
      </a-space>
    </a-card>
  </a-page-header>
</template>

<script lang="ts" setup>
import {ref, reactive, watch, unref} from 'vue';
import Player from 'xgplayer';
import {useRouter} from 'vue-router';
import {toDateString} from 'ele-admin-pro';
import {setPageTabTitle} from '@/utils/page-tab-util';
import {message} from 'ant-design-vue/es';
import useFormData from '@/utils/use-form-data';
import {FileRecord} from '@/api/system/file/model';
import {getFile} from '@/api/system/file';

const {currentRoute} = useRouter();
import {getPageTitle} from "@/utils/common";

const ROUTE_PATH = '/cms/video/player';

// 视频播放器一实例
let player1: Player;
// 视频播放器一是否实例化完成
const ready1 = ref(false);

// 视频播放器一配置
const config1 = reactive({
  id: 'demoPlayer1',
  lang: 'zh-cn',
  fluid: true,
  // 视频地址
  url: 'https://file.wsdns.cn/20221126/cf17ef352db54bf28efeda268107714f.mp4',
  // 封面
  poster:
    'https://file.wsdns.cn/20221125/49f0c461d61e48f28b324366a0a63a2e.jpg',
  // 开启倍速播放
  playbackRate: [0.5, 1, 1.5, 2],
  // 开启画中画
  pip: true
});

/* 播放器一渲染完成 */
const onPlayer1 = (player: Player) => {
  player1 = player;
  player1.on('play', () => {
    ready1.value = true;
  });
};
// 视频信息
const {form, assignFields} = useFormData<FileRecord>({
  id: 0,
  name: '',
  url: '',
  path: '',
  comments: '',
  createNickname: '',
  createTime: ''
});
// 请求状态
const loading = ref(true);
/*  */
const query = () => {
  const {query} = unref(currentRoute);
  const id = query.id;
  if (!id || form.id === Number(id)) {
    return;
  }
  loading.value = true;
  getFile(Number(id))
    .then((data) => {
      loading.value = false;
      assignFields({
        ...data,
        createTime: toDateString(data.createTime)
      });
      // 修改页签标题
      if (unref(currentRoute).path === ROUTE_PATH) {
        setPageTabTitle(String(data.comments));
      }
    })
    .catch((e) => {
      loading.value = false;
      message.error(e.message);
    });
};

watch(
  currentRoute,
  (route) => {
    const {path} = unref(route);
    if (path !== ROUTE_PATH) {
      return;
    }
    query();
  },
  {immediate: true}
);
</script>
