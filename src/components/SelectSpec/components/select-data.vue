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
      row-key="specId"
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
        <template v-if="column.key === 'image'">
          <a-image
            v-if="record.image"
            :src="record.image"
            :preview="false"
            :width="45"
          />
        </template>
        <template v-if="column.key === 'specValue'">
          <a-space direction="vertical">
            <template
              v-for="(item, index) in JSON.parse(record.specValue)"
              :key="index"
            >
              <div class="text-left">
                <span class="text-gray-400 mr-2">{{ item.value }} :</span>
                <ele-tag
                  shape="round"
                  size="small"
                  v-for="(sub, subIndex) in item.detail"
                  :key="subIndex"
                >
                  {{ sub }}
                </ele-tag>
              </div>
            </template>
          </a-space>
        </template>
        <template v-if="column.key === 'action'">
          <a-radio @click="onRadio(record)" />
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
  import { pageShopSpec } from '@/api/shop/shopSpec';
  import { EleProTable } from 'ele-admin-pro';
  import { ShopSpec, ShopSpecParam } from '@/api/shop/shopSpec/model';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 商户类型
    shopType?: string;
    // 修改回显的数据
    data?: ShopSpec | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: ShopSpec): void;
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
      title: '操作',
      key: 'action',
      align: 'center'
    },
    {
      title: '规格',
      dataIndex: 'specName',
      key: 'specName',
      align: 'center'
    },
    {
      title: '规格值',
      dataIndex: 'specValue',
      key: 'specValue'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where = {};
    // 搜索条件
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    if (props.shopType == 'empty') {
      where.emptyType = true;
    } else {
      where.shopType = props.shopType;
    }
    return pageShopSpec({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: ShopSpecParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: ShopSpec) => {
    updateVisible(false);
    emit('done', record);
  };

  /* 自定义行属性 */
  const customRow = (record: ShopSpec) => {
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
