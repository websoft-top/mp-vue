<template>
  <ele-modal
    :width="500"
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
          <div class="ele-text-heading cursor-pointer" @click="onRadio(record)">
            {{ record.name }}
          </div>
        </template>
        <template v-if="column.key === 'model'">
          <div class="ele-text-heading cursor-pointer" @click="onRadio(record)">
            {{ record.model }}
          </div>
        </template>
        <template v-if="column.key === 'comments'">
          <a-popover>
            <template #content>
              {{ record.comments }}
            </template>
            <ExclamationCircleOutlined />
          </a-popover>
        </template>
        <template v-if="column.key === 'action'">
          <a class="block cursor-pointer" @click="onRadio(record)">选择</a>
        </template>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { EleProTable } from 'ele-admin-pro';
  import {pageCmsModel} from "@/api/cms/cmsModel";
  import {CmsModel, CmsModelParam} from "@/api/cms/cmsModel/model";

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 修改回显的数据
    data?: CmsModel | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: CmsModel): void;
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
      title: '模型',
      dataIndex: 'name',
      width: 180,
      key: 'name'
    },
    {
      title: '标识',
      width: 120,
      dataIndex: 'model',
      key: 'model'
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
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where = {};
    return pageCmsModel({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: CmsModelParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: CmsModel) => {
    updateVisible(false);
    emit('done', record);
  };

  /* 自定义行属性 */
  const customRow = (record: CmsModel) => {
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
