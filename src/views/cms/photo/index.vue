<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra />
    </template>
    <a-space style="margin-bottom: 10px" v-if="activeKey == '2'">
      <a-upload
        :show-upload-list="false"
        :accept="'image/*,application/*'"
        :customRequest="onUpload"
      >
        <a-button key="1" type="primary" class="ele-btn-icon">
          <template #icon>
            <UploadOutlined/>
          </template>
          <span>上传图片</span>
        </a-button>
      </a-upload>
      <a-input-search
        allow-clear
        style="width: 360px"
        v-model:value="searchText"
        placeholder="请输入关键词"
        key="2"
        @search="query"
        @pressEnter="query"
      >
        <template #addonBefore>
          <a-select
            v-model:value="type"
            style="width: 100px; margin: -5px -12px"
          >
            <a-select-option value="name">文件名称</a-select-option>
            <a-select-option value="createNickname">
              上传人
            </a-select-option>
          </a-select>
        </template>
      </a-input-search>
      <SelectDict
        dict-code="groupId"
        :placeholder="`按分组筛选`"
        style="width: 200px"
        v-model:value="where.groupName"
        @done="chooseGroupId"
      />
    </a-space>
    <template v-if="activeKey === '2'">
      <Image :data="data" :where="where" @done="query"/>
      <div class="ele-text-center" style="margin-top: 38px">
        <a-pagination
          :total="count"
          v-model:current="page"
          v-model:page-size="limit"
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
          @change="query"
        />
      </div>
    </template>
    <template v-if="activeKey === '1'">
      <List :data="data" :where="where"/>
    </template>
  </a-page-header>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {UploadOutlined} from '@ant-design/icons-vue';
import {FileRecord, FileRecordParam} from '@/api/system/file/model';
import Image from './image.vue';
import List from './list.vue';
import {messageLoading} from 'ele-admin-pro';
import {pageFiles, uploadFile} from '@/api/system/file';
import {message} from 'ant-design-vue/es';
import {DictData} from '@/api/system/dict-data/model';
import {getMerchantId} from "@/utils/merchant";
import {getPageTitle} from "@/utils/common";
import Extra from "./components/Extra.vue";

const type = ref('name');
const searchText = ref('');
const data = ref<FileRecord[] | any>([]);
// 当前选项卡
const activeKey = ref('1');
// 第几页
const page = ref(1);
// 每页多少条
const limit = ref(12);
// 总数量
const count = ref(0);
// 搜索表单
const where = reactive<FileRecordParam>({
  name: '',
  createNickname: '',
  groupId: undefined,
  groupName: undefined
});

/* 搜索 */
const chooseGroupId = (item: DictData) => {
  console.log(item);
  where.groupId = item.dictDataId;
  where.groupName = item.dictDataName;
  query();
};

/* 查询数据 */
const query = () => {
  console.log('query()');
  if (type.value == 'name') {
    where.name = searchText.value;
  }
  if (type.value == 'createNickname') {
    where.createNickname = searchText.value;
  }
  where.page = page.value;
  where.limit = limit.value;
  where.merchantId = getMerchantId();
  // where.contentType = 'image';
  const hide = messageLoading('请求中..', 0);
  pageFiles(where).then((res) => {
    count.value = Number(res?.count);
    data.value = res?.list;
    hide();
  });
};

query();

// 上传文件
const onUpload = (item) => {
  const {file} = item;
  if (!file.type.startsWith('image')) {
    message.error('只能选择图片');
    return;
  }
  if (file.size / 1024 / 1024 > 10) {
    message.error('大小不能超过 10MB');
    return;
  }
  const hide = messageLoading({
    content: '上传中..',
    duration: 0,
    mask: true
  });
  uploadFile(file)
    .then((data) => {
      hide();
      message.success('上传成功');
      query();
    })
    .catch((e) => {
      message.error(e.message);
      hide();
    });
};
</script>

<script lang="ts">
export default {
  name: 'PhotoIndex'
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
