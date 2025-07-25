<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="add">
      <template #icon>
        <PlusOutlined/>
      </template>
      <span>添加</span>
    </a-button>
    <a-button
      danger
      type="primary"
      class="ele-btn-icon"
      :disabled="selection?.length === 0"
      @click="removeBatch"
    >
      <template #icon>
        <DeleteOutlined/>
      </template>
      <span>批量删除</span>
    </a-button>
    <a-button
      type="primary"
      :disabled="selection?.length === 0"
      @click="updateBatch"
    >
      移动
    </a-button>
    <a-radio-group v-model:value="type" @change="handleSearch" v-if="setting.setting?.articleReview">
      <a-radio-button type="text" value="已发布"
      >已发布({{ articleCount?.totalNum }})
      </a-radio-button
      >
      <a-radio-button value="待审核"
      >待审核({{ articleCount?.totalNum2 }})
      </a-radio-button
      >
      <a-radio-button value="已驳回"
      >已驳回({{ articleCount?.totalNum3 }})
      </a-radio-button
      >
    </a-radio-group>
    <a-tree-select
      allow-clear
      :tree-data="navigationList"
      tree-default-expand-all
      style="width: 240px"
      :listHeight="700"
      placeholder="请选择栏目"
      :value="where.categoryId || undefined"
      :dropdown-style="{ overflow: 'auto' }"
      @update:value="(value?: number) => (where.categoryId = value)"
      @change="onCategoryId"
    />
    <ChooseDictionary
      v-if="showChooseDict"
      dict-code="NavigationModel"
      :placeholder="`选择模型`"
      style="width: 120px"
      v-model:value="where.model"
      @done="chooseModel"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 240px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button type="text" @click="reset">重置</a-button>
    <a-button type="text" :disabled="!websiteId" @click="handleExport">导出xls</a-button>
    <a-button type="text" :disabled="!websiteId" @click="openImport">导入xls</a-button>
  </a-space>

  <!-- 导入弹窗 -->
  <import v-model:visible="showImport" @done="reload"/>
</template>

<script lang="ts" setup>
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons-vue';
import {ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {utils, writeFile} from 'xlsx';
import {getCount, listCmsArticle} from '@/api/cms/cmsArticle';
import type {CmsArticle, CmsArticleCount, CmsArticleParam} from '@/api/cms/cmsArticle/model';
import useSearch from '@/utils/use-search';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';
import dayjs from 'dayjs';
import Import from "./Import.vue";
import {useWebsiteSettingStore} from "@/store/modules/setting";
import {openUrl, push} from "@/utils/common";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: CmsArticle[];
    merchantId?: number;
    navigationList?: CmsNavigation[];
    categoryId?: number;
  }>(),
  {}
);

const type = ref<string>();
const setting = useWebsiteSettingStore();
// 统计数据
const articleCount = ref<CmsArticleCount>();
const showChooseDict = ref<boolean>(false);
// 请求状态
const loading = ref(false);
const xlsFileName = ref<string>();
const articleList = ref<CmsArticle[]>([]);
// 是否显示用户导入弹窗
const showImport = ref(false);
const websiteId = localStorage.getItem('WebsiteId')

// 表单数据
const {where, resetFields} = useSearch<CmsArticleParam>({
  articleId: undefined,
  model: undefined,
  categoryId: undefined,
  merchantId: undefined,
  keywords: '',
  sceneType: undefined,
  userId: undefined
});

const emit = defineEmits<{
  (e: 'search', where?: CmsArticleParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 新增
const add = () => {
  emit('add');
};

// 批量删除
const removeBatch = () => {
  emit('remove');
};

// 批量更新
const updateBatch = () => {
  emit('batchMove');
}

/* 打开编辑弹窗 */
const openImport = () => {
  showImport.value = true;
};

const handleSearch = (e) => {
  const text = e.target.value;
  if (text === '已发布') {
    where.status = 0;
  }
  if (text === '待审核') {
    where.status = 1;
  }
  if (text === '已驳回') {
    where.status = 2;
  }
  emit('search', where);
};

const reload = () => {
  getCount(where).then((data: any) => {
    articleCount.value = data;
  });
  emit('search', where);
};

// 按模型查找
const chooseModel = () => {
  emit('search', where);
};

// 按分类查询
const onCategoryId = (id: number) => {
  where.categoryId = id;
  emit('search', where);
};

// 导出
const handleExport = async () => {
  loading.value = true;
  const array: (string | number)[][] = [
    [
      '文章ID',
      '文章标题',
      '封面图片',
      '所属栏目',
      '栏目ID',
      '父级栏目名称',
      '父级栏目ID',
      '文章内容',
      '摘要',
      '来源',
      '实际阅读量',
      '作者',
      '发布时间',
      '类型',
      '模型',
      '详情页模板',
      '话题',
      '关键词',
      '产品概述',
      '显示方式',
      '客户端',
      '文件列表',
      '视频地址',
      '点赞数',
      '评论数',
      '推荐',
      '用户ID',
      '商户ID',
      '语言',
      '排序',
      `状态`,
      '租户ID'
    ]
  ];

  // 按搜索结果导出
  where.sceneType = 'Content';
  await listCmsArticle(where)
    .then((list) => {
      articleList.value = list;
      list?.forEach((d: CmsArticle) => {
        array.push([
          `${d.articleId}`,
          `${d.title}`,
          `${d.image}`,
          `${d.categoryName}`,
          `${d.categoryId}`,
          `${d.parentName}`,
          `${d.parentId}`,
          `${d.content}`,
          `${d.comments}`,
          `${d.source}`,
          `${d.actualViews}`,
          `${d.author}`,
          `${d.createTime}`,
          `${d.type}`,
          `${d.model}`,
          `${d.detail}`,
          `${d.topic}`,
          `${d.tags}`,
          `${d.overview}`,
          `${d.showType}`,
          `${d.platform}`,
          `${d.files}`,
          `${d.video}`,
          `${d.likes}`,
          `${d.commentNumbers}`,
          `${d.recommend}`,
          `${d.userId}`,
          `${d.merchantId}`,
          `${d.lang}`,
          `${d.sortNumber}`,
          `${d.status}`,
          `${d.tenantId}`
        ]);
      });
      const sheetName = `导出文章列表${dayjs(new Date()).format('YYYYMMDD')}`;
      const workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      const sheet = utils.aoa_to_sheet(array);
      workbook.Sheets[sheetName] = sheet;
      // 设置列宽
      sheet['!cols'] = [
        {wch: 10},
        {wch: 40},
        {wch: 20},
        {wch: 20},
        {wch: 60},
        {wch: 15},
        {wch: 10},
        {wch: 10},
        {wch: 20},
        {wch: 10},
        {wch: 20}
      ];
      message.loading('正在导出...');
      setTimeout(() => {
        writeFile(
          workbook,
          `${
            where.createTimeEnd ? xlsFileName.value + '_' : ''
          }${sheetName}.xlsx`
        );
        loading.value = false;
      }, 1000);
    })
    .catch((msg) => {
      message.error(msg);
      loading.value = false;
    })
    .finally(() => {
    });

};

/*  重置 */
const reset = () => {
  resetFields();
  type.value = undefined;
  reload();
  openUrl(`/website/article`)
};

watch(
  () => props.merchantId,
  () => {
    if (props.categoryId) {
      where.categoryId = props.categoryId;
    }
    reload();
  },
  {immediate: true}
);
</script>
