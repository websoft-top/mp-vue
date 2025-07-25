<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
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
        <DeleteOutlined />
      </template>
      <span>批量删除</span>
    </a-button>
    <a-radio-group v-model:value="where.official" @change="handleSearch">
      <a-radio-button :value="1"
      >自营
      </a-radio-button
      >
      <a-radio-button :value="0"
      >市场
      </a-radio-button
      >
    </a-radio-group>
    <a-radio-group v-model:value="type" @change="handleSearch">
      <a-radio-button :value="0"
      >产品</a-radio-button
      >
      <a-radio-button :value="1"
      >插件</a-radio-button
      >
    </a-radio-group>
    <a-radio-group v-model:value="type" @change="handleSearch">
      <a-radio-button value="已发布"
        >已发布({{ articleCount?.totalNum }})</a-radio-button
      >
      <a-radio-button value="待审核"
        >待审核({{ articleCount?.totalNum2 }})</a-radio-button
      >
      <a-radio-button value="已驳回"
        >已驳回({{ articleCount?.totalNum3 }})</a-radio-button
      >
    </a-radio-group>
    <a-tree-select
      allow-clear
      :tree-data="navigationList"
      tree-default-expand-all
      style="width: 280px"
      placeholder="请选择栏目"
      :value="where.categoryId || undefined"
      :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
      @update:value="(value?: number) => (where.categoryId = value)"
      @change="onCategoryId"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 280px"
      v-model:value="where.keywords"
      @pressEnter="reload"
      @search="reload"
    />
    <a-button @click="reset">重置</a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { ref, watch } from 'vue';
  import type { ArticleCount } from '@/api/cms/article/model';
  import useSearch from '@/utils/use-search';
  import { CmsNavigation } from '@/api/cms/cmsNavigation/model';
  import { getCount } from '@/api/cms/cmsProduct';
  import { CmsProductParam } from '@/api/cms/cmsProduct/model';
  import { listCmsNavigation } from '@/api/cms/cmsNavigation';
  import { toTreeData } from 'ele-admin-pro';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      merchantId?: number;
      navigationList?: CmsNavigation[];
      categoryId?: number;
      model?: string;
    }>(),
    {}
  );

  const type = ref<string>();
  // 统计数据
  const articleCount = ref<ArticleCount>();
  // 栏目数据
  const navigationList = ref<CmsNavigation[]>();

  // 表单数据
  const { where, resetFields } = useSearch<CmsProductParam>({
    productId: undefined,
    type: undefined,
    official: undefined,
    status: undefined,
    keywords: ''
  });

  const emit = defineEmits<{
    (e: 'search', where?: CmsProductParam): void;
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
    where.type = text
    emit('search', where);
  };

  const reload = () => {
    emit('search', where);
  };

  // 按分类查询
  const onCategoryId = (id: number) => {
    where.categoryId = id;
    emit('search', where);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    type.value = undefined;
    reload();
  };

  // 加载栏目数据
  if (!navigationList.value) {
    listCmsNavigation({}).then((res) => {
      navigationList.value = toTreeData({
        data: res?.map((d) => {
          d.value = d.navigationId;
          d.label = d.title;
          return d;
        }),
        idField: 'navigationId',
        parentIdField: 'parentId'
      });
    });
  }
  // 统计数据
  getCount(where).then((data: any) => {
    articleCount.value = data;
  });

  watch(
    () => props.merchantId,
    () => {
      if (props.categoryId) {
        where.categoryId = props.categoryId;
      }
      reload();
    },
    { immediate: true }
  );
</script>
