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
      row-key="merchantId"
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
        <template v-if="column.key === 'shopType'">
          <a-tag v-if="record.shopType === 10">企业</a-tag>
          <a-tag v-if="record.shopType === 20">政府单位</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="primary" @click="onRadio(record)">选择</a-button>
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
  import { pageShopMerchant } from '@/api/shop/shopMerchant';
  import { EleProTable } from 'ele-admin-pro';
  import { ShopMerchant, ShopMerchantParam } from '@/api/shop/shopMerchant/model';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 商户类型
    shopType?: string;
    type?: string;
    // 修改回显的数据
    data?: ShopMerchant | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: ShopMerchant): void;
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
      title: 'LOGO',
      dataIndex: 'image',
      key: 'image',
      align: 'center'
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName'
    },
    {
      title: '商户类型',
      dataIndex: 'shopType',
      // key: 'shopType'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center'
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
    if (props.type) {
      where.type = props.type;
    }
    return pageShopMerchant({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: ShopMerchantParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: ShopMerchant) => {
    updateVisible(false);
    emit('done', record);
  };

  /* 自定义行属性 */
  const customRow = (record: ShopMerchant) => {
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
