<template>
  <ele-modal
    :width="750"
    :visible="visible"
    :maskClosable="false"
    :title="title"
    :footer="null"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="navigationId"
      :columns="columns"
      :datasource="datasource"
      :parse-data="parseData"
      :need-page="false"
      :customRow="customRow"
      :expand-icon-column-index="1"
      :expanded-row-keys="expandedRowKeys"
      cache-key="proNavigationTable"
      @done="onDone"
      @expand="onExpand"
    >
      <template #toolbar>
        <a-space>
          <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
            展开
          </a-button>
          <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
            折叠
          </a-button>
          <a-divider type="vertical" />
          <a-radio-group v-model:value="position" @change="reload">
            <a-radio-button :value="1">顶部</a-radio-button>
            <a-radio-button :value="2">底部</a-radio-button>
          </a-radio-group>
          <a-divider type="vertical" />
          <!-- 搜索表单 -->
          <a-input-search
            allow-clear
            v-model:value="searchText"
            placeholder="请输入搜索关键词"
            @search="reload"
            @pressEnter="reload"
          />
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <div class="cursor-pointer" @click="onRadio(record)">
            {{ record.title }}
          </div>
        </template>
        <template v-if="column.key === 'path'">
          <div class="text-gray-400">{{ record.path }}</div>
        </template>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { listCmsNavigation, pageCmsNavigation } from '@/api/cms/cmsNavigation';
  import { EleProTable } from 'ele-admin-pro';
  import { useI18n } from 'vue-i18n';
  import { toTreeData, eachTreeData } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem,
    EleProTableDone
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import type { CmsNavigation, CmsNavigationParam } from '@/api/cms/cmsNavigation/model';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 修改回显的数据
    data?: CmsNavigation | null;
    // 当前模型
    model?: string;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: CmsNavigation): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const { locale } = useI18n();
  const pageId = ref<number>(0);
  const checked = ref<boolean>(true);
  // 表格展开的行
  const expandedRowKeys = ref<number[]>([]);
  const searchText = ref('');
  const position = ref(1);
  // 菜单数据
  const menuData = ref<CmsNavigation[]>([]);

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'navigationId',
      width: 80
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ where }) => {
    where = {};
    where.title = searchText.value;
    // where.position = position.value;
    where.top = 0;
    where.bottom = undefined;
    if (position.value == 1) {
      where.top = 0;
      where.bottom = undefined;
    }
    if (position.value == 2) {
      where.top = undefined;
      where.bottom = 0;
    }
    where.isMpWeixin = false;
    where.lang = locale.value || undefined;
    return listCmsNavigation({ ...where });
  };

  /* 表格渲染完成回调 */
  const onDone: EleProTableDone<CmsNavigation> = ({ data }) => {
    menuData.value = data;
  };

  /* 数据转为树形结构 */
  const parseData = (data: CmsNavigation[]) => {
    return toTreeData({
      data: data.map((d) => {
        return { ...d, key: d.navigationId, value: d.navigationId };
      }),
      idField: 'navigationId',
      parentIdField: 'parentId'
    });
  };

  /* 展开全部 */
  const expandAll = () => {
    let keys: number[] = [];
    eachTreeData(menuData.value, (d) => {
      if (d.children && d.children.length && d.navigationId) {
        keys.push(d.navigationId);
      }
    });
    expandedRowKeys.value = keys;
  };

  /* 折叠全部 */
  const foldAll = () => {
    expandedRowKeys.value = [];
  };

  /* 点击展开图标时触发 */
  const onExpand = (expanded: boolean, record: CmsNavigation) => {
    if (expanded) {
      expandedRowKeys.value = [
        ...expandedRowKeys.value,
        record.navigationId as number
      ];
    } else {
      expandedRowKeys.value = expandedRowKeys.value.filter(
        (d) => d !== record.navigationId
      );
    }
  };

  /* 搜索 */
  const reload = (where?: CmsNavigationParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: CmsNavigation) => {
    pageId.value = Number(record.navigationId);
    updateVisible(false);
    emit('done', record);
  };

  /* 自定义行属性 */
  const customRow = (record: CmsNavigation) => {
    return {
      // 行点击事件
      // onClick: () => {
      //   updateVisible(false);
      //   emit('done', record);
      // },
      // 行双击事件
      onDblclick: () => {
        updateVisible(false);
        emit('done', record);
      }
    };
  };
</script>
<style lang="less"></style>
