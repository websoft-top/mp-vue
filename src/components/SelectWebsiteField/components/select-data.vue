<template>
  <ele-modal
    width="70%"
    :visible="visible"
    :maskClosable="false"
    :title="title"
    :footer="null"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="id"
      :datasource="datasource"
      :columns="columns"
      :customRow="customRow"
      :pagination="false"
    >
      <template #toolbar>
        <a-input-search
          allow-clear
          v-model:value="searchText"
          placeholder="请输入搜索关键词"
          style="width: 200px"
          @search="reload"
          @pressEnter="reload"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="ele-text-heading" @click="onRadio(record)">
            {{ record.name }}
          </div>
          <div class="ele-text-placeholder">{{ record.comments }}</div>
        </template>
        <template v-if="column.key === 'value'">
          <a-image v-if="record.type === 1" :src="record.value" :width="120"/>
          <div v-else>{{ record.value }}</div>
        </template>
        <template v-if="column.key === 'defaultValue'">
          <a-image v-if="record.type === 1" :src="record.value" :width="120"/>
          <div v-else>{{ record.value }}</div>
        </template>
        <template v-if="column.key === 'comments'">
          <a-popover>
            <template #content>
              {{ record.comments }}
            </template>
            <ExclamationCircleOutlined/>
          </a-popover>
        </template>
        <template v-if="column.key === 'action'">
          <a @click="onRadio(record)">选择</a>
        </template>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {
  ColumnItem,
  DatasourceFunction
} from 'ele-admin-pro/es/ele-pro-table/types';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {EleProTable} from 'ele-admin-pro';
import {Company, CompanyParam} from '@/api/system/company/model';
import {CmsWebsiteField} from '@/api/cms/cmsWebsiteField/model';
import {pageWebsiteField} from "@/api/system/website/field";

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 标题
  title?: string;
  // 修改回显的数据
  data?: CmsWebsiteField | null;
}>();

const emit = defineEmits<{
  (e: 'done', data: Company): void;
  (e: 'update:visible', visible: boolean): void;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 搜索内容
const searchText = ref(null);

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格配置
const columns = ref<ColumnItem[]>([
  {
    title: '参数名',
    dataIndex: 'name',
    width: 180,
    key: 'name'
  },
  {
    title: '默认值',
    width: 120,
    dataIndex: 'defaultValue',
    key: 'defaultValue'
  },
  {
    title: '描述',
    dataIndex: 'comments',
    key: 'comments',
    width: 120,
    align: 'center'
  },
  {
    title: '可设置范围',
    width: 120,
    align: 'center',
    dataIndex: 'modifyRange'
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    align: 'center',
    hideInSetting: true
  }
]);

// 表格数据源
const datasource: DatasourceFunction = ({page, limit, where, orders}) => {
  where = {};
  // 搜索条件
  if (searchText.value) {
    where.keywords = searchText.value;
  }
  return pageWebsiteField({
    ...where,
    ...orders,
    page,
    limit
  });
};

/* 搜索 */
const reload = (where?: CompanyParam) => {
  tableRef?.value?.reload({page: 1, where});
};

const onRadio = (record: Company) => {
  updateVisible(false);
  emit('done', record);
};

/* 自定义行属性 */
const customRow = (record: Company) => {
  return {
    // 行双击事件
    onDblclick: () => {
      updateVisible(false);
      emit('done', record);
    }
  };
};
</script>
<style lang="less"></style>
