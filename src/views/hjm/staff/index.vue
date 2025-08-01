<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-split-layout
        width="266px"
        allow-collapse
        :right-style="{ overflow: 'hidden' }"
        :style="{ minHeight: 'calc(100vh - 152px)' }"
      >
        <div>
          <ele-toolbar theme="default">
            <a-space :size="10">
              <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
                <template #icon>
                  <plus-outlined/>
                </template>
                <span>新建</span>
              </a-button>
              <a-button
                type="primary"
                :disabled="!current"
                class="ele-btn-icon"
                @click="openEdit(current)"
              >
                <template #icon>
                  <edit-outlined/>
                </template>
                <span>修改</span>
              </a-button>
              <a-button
                danger
                type="primary"
                :disabled="!current"
                class="ele-btn-icon"
                @click="remove"
              >
                <template #icon>
                  <delete-outlined/>
                </template>
                <span>删除</span>
              </a-button>
            </a-space>
          </ele-toolbar>
          <div class="ele-border-split sys-organization-list">
            <a-tree
              :tree-data="(data as any)"
              :show-line="true"
              v-model:expanded-keys="expandedRowKeys"
              v-model:selected-keys="selectedRowKeys"
              @select="onTreeSelect"
            />
          </div>
        </div>
        <template #content>
          <org-user-list
            :organization-list="data"
            :organization-id="current?.organizationId"
            @done="query"
          />
        </template>
      </ele-split-layout>
    </a-card>
    <!-- 编辑弹窗 -->
    <org-edit
      v-model:visible="showEdit"
      :data="editData"
      :organization-list="data"
      :organization-id="current?.organizationId"
      @done="query"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue/es';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import {messageLoading, toTreeData, eachTreeData} from 'ele-admin-pro/es';
import OrgUserList from './components/org-user-list.vue';
import OrgEdit from './components/org-edit.vue';
import {
  listOrganizations,
  removeOrganization
} from '@/api/system/organization';
import type {Organization} from '@/api/system/organization/model';
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/hjm/userVerify/components/Extra.vue";

// 加载状态
const loading = ref(true);

// 树形数据
const data = ref<Organization[]>([]);

// 树展开的key
const expandedRowKeys = ref<number[]>([]);

// 树选中的key
const selectedRowKeys = ref<number[]>([]);

// 选中数据
const current = ref<Organization | null>(null);

// 是否显示表单弹窗
const showEdit = ref(false);

// 编辑回显数据
const editData = ref<Organization | null>(null);

/* 查询 */
const query = () => {
  loading.value = true;
  listOrganizations()
    .then((list) => {
      loading.value = false;
      const eks: number[] = [];
      list.forEach((d, i) => {
        d.title = d.organizationName + `[${d.organizationId}]`;
        d.key = d.organizationId;
        d.value = d.organizationId;

        if (typeof d.key === 'number') {
          eks.push(d.key);
        }
      });
      expandedRowKeys.value = eks;
      data.value = toTreeData({
        data: list,
        idField: 'organizationId',
        parentIdField: 'parentId'
      });
      if (list.length) {
        // if (typeof list[0].key === 'number') {
        //   selectedRowKeys.value = [list[0].key];
        // }
        // current.value = list[0];
        // current.value.organizationId = 0;
      } else {
        selectedRowKeys.value = [];
        current.value = null;
      }
    })
    .catch((e) => {
      loading.value = false;
      message.error(e.message);
    });
};

/* 选择数据 */
const onTreeSelect = () => {
  eachTreeData(data.value, (d) => {
    if (typeof d.key === 'number' && selectedRowKeys.value.includes(d.key)) {
      current.value = d;
      return false;
    }
  });
};

/* 打开编辑弹窗 */
const openEdit = (item?: Organization | null) => {
  editData.value = item ?? null;
  showEdit.value = true;
};

/* 删除 */
const remove = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要删除选中的部门吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = messageLoading('请求中..', 0);
      removeOrganization(current.value?.organizationId)
        .then((msg) => {
          hide();
          message.success(msg);
          query();
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    }
  });
};

query();
</script>

<script lang="ts">
export default {
  name: 'SystemOrganization'
};
</script>

<style lang="less" scoped>
.sys-organization-list {
  padding: 12px 6px;
  height: calc(100vh - 242px);
  border-width: 1px;
  border-style: solid;
  overflow: auto;
}
</style>
