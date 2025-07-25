<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch />
    </template>
    <a-card :bordered="false">
      <div class="website-field">
        <!-- 表格 -->
        <ele-pro-table
          ref="tableRef"
          row-key="websiteId"
          :columns="columns"
          :datasource="datasource"
          :customRow="customRow"
          :need-page="false"
          tool-class="ele-toolbar-form"
          class="sys-org-table"
        >
          <template #toolbar>
            <Search @add="openEdit" />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="ele-text-heading" @mouseover="onCopyIcon(record.name)" @mouseleave="hideCopyIcon">{{ record.name }}<CopyOutlined class="px-2" v-if="currentName == record.name" @click="copyText(`config.${record.name}`)"/></div>
            </template>
            <template v-if="column.key === 'value'">
              <a-image
                v-if="record.type === 1"
                :src="record.value"
                :width="120"
              />
              <div v-else v-html="record.value"></div>
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
              <a @click="copyText(`config.${record.name}`)">复制</a>
              <a-divider type="vertical" />
              <a @click="openEdit(record)">编辑</a>
              <template v-if="record.deleted == 0">
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定要删除此记录吗？"
                  @confirm="remove(record)"
                >
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </template>
              <template v-if="record.deleted == 1">
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定要放回原处吗？"
                  @confirm="recovery(record)"
                >
                  <a class="ele-text-danger">恢复</a>
                </a-popconfirm>
              </template>
            </template>
          </template>
        </ele-pro-table>
        <!-- 编辑弹窗 -->
        <Edit v-model:visible="showEdit" :data="current" @done="reload" />
      </div>
    </a-card>
  </a-page-header>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { message } from 'ant-design-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons-vue';
  import type { DatasourceFunction } from 'ele-admin-pro/es/ele-pro-table/types';
  import CmsWebsiteSearch from "@/views/cms/cmsWebsite/components/search.vue";
  import Search from './components/search.vue';
  import Edit from './components/edit.vue';
  import {
    CmsWebsiteField,
    CmsWebsiteFieldParam
  } from '@/api/cms/cmsWebsiteField/model';
  import {
    listCmsWebsiteField,
    removeCmsWebsiteField,
    undeleteWebsiteField
  } from '@/api/cms/cmsWebsiteField';
  import { copyText, getPageTitle } from '@/utils/common';

  const props = defineProps<{
    websiteId: any;
    data: CmsWebsiteField;
  }>();

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  const selection = ref<any[]>();
  // 当前编辑数据
  const current = ref<CmsWebsiteField | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  const currentName = ref<string>();
  const { locale } = useI18n();

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    // 搜索条件
    where.lang = locale.value || undefined;
    return listCmsWebsiteField({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<any[]>([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 120
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      ellipsis: true
    },
    {
      title: '字段内容',
      dataIndex: 'value',
      key: 'value',
      ellipsis: true
    },
    {
      title: '描述',
      dataIndex: 'comments',
      key: 'comments',
      width: 120,
      align: 'center',
      ellipsis: true
    },
    {
      title: '排序',
      dataIndex: 'sortNumber',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      hideInSetting: true
    }
  ]);

  const onCopyIcon = (text: string) => {
    currentName.value = text;
  }

  const hideCopyIcon = () => {
    currentName.value = undefined;
  }

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsWebsiteField) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 搜索 */
  const reload = (where?: CmsWebsiteFieldParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 删除单个 */
  const remove = (row: CmsWebsiteField) => {
    const hide = message.loading('请求中..', 0);
    removeCmsWebsiteField(row.id)
      .then((msg) => {
        hide();
        message.success(msg);
        if (row.name == 'i18n') {
          localStorage.removeItem('i18n');
          window.location.reload();
        }
        reload();
      })
      .catch((e) => {
        hide();
        message.error(e.message);
      });
  };

  // 从回收站放回原处
  const recovery = (row: CmsWebsiteField) => {
    const hide = message.loading('请求中..', 0);
    undeleteWebsiteField(row.id)
      .then((msg) => {
        hide();
        message.success(msg);
        reload();
      })
      .catch((e) => {
        hide();
        message.error(e.message);
      });
  };

  /* 自定义行属性 */
  const customRow = (record: CmsWebsiteField) => {
    return {
      // 行点击事件
      onClick: () => {
        // console.log(record);
      },
      // 行双击事件
      onDblclick: () => {
        openEdit(record);
      }
    };
  };

  watch(
    () => props.websiteId,
    (websiteId) => {
      if (websiteId) {
        reload();
      }
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'CmsWebsiteFieldIndex'
  };
</script>
