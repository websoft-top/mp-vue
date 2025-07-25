<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
      >
        <template #toolbar>
          <search
            @search="reload"
            :navigationList="navigationList"
            :selection="selection"
            @add="openEdit"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="50"/>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">显示</a-tag>
            <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                title="确定要删除此记录吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <HjmQuestionsEdit v-model:visible="showEdit" :navigationList="navigationList" :data="current" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import Extra from './components/Extra.vue';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import {toTreeData} from 'ele-admin-pro';
import HjmQuestionsEdit from './components/hjmQuestionsEdit.vue';
import {pageHjmQuestions, removeHjmQuestions, removeBatchHjmQuestions} from '@/api/hjm/hjmQuestions';
import type {HjmQuestions, HjmQuestionsParam} from '@/api/hjm/hjmQuestions/model';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import {listCmsNavigation} from "@/api/cms/cmsNavigation";
import {getPageTitle} from "@/utils/common";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<HjmQuestions[]>([]);
// 当前编辑数据
const current = ref<HjmQuestions | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);
// 栏目数据
const navigationList = ref<CmsNavigation[]>();

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders,
                                          filters
                                        }) => {
  if (filters) {
    where.status = filters.status;
  }
  return pageHjmQuestions({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 90,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    align: 'center',
    customRender: (record) => ['选择题', '填空题', '问答题'][record.text]
  },
  {
    title: '题目',
    dataIndex: 'question',
    key: 'question'
  },
  {
    title: '所属课程',
    dataIndex: 'courseName',
    key: 'courseName',
    width: 120,
    align: 'center',
  },
  // {
  //   title: '正确答案',
  //   dataIndex: 'correctAnswer',
  //   key: 'correctAnswer',
  //   align: 'center',
  // },
  // {
  //   title: '难度',
  //   dataIndex: 'difficulty',
  //   key: 'difficulty',
  //   align: 'center',
  // },
  {
    title: '排序',
    dataIndex: 'sortNumber',
    key: 'sortNumber',
    align: 'center',
    width: 120
  },
  // {
  //   title: '备注',
  //   dataIndex: 'comments',
  //   key: 'comments',
  //   align: 'center',
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: true,
    ellipsis: true,
    width: 180,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: HjmQuestionsParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: HjmQuestions) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: HjmQuestions) => {
  const hide = message.loading('请求中..', 0);
  removeHjmQuestions(row.id)
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

/* 批量删除 */
const removeBatch = () => {
  if (!selection.value.length) {
    message.error('请至少选择一条数据');
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '确定要删除选中的记录吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = message.loading('请求中..', 0);
      removeBatchHjmQuestions(selection.value.map((d) => d.id))
        .then((msg) => {
          hide();
          message.success(msg);
          reload();
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    }
  });
};

/* 查询 */
const query = () => {
  loading.value = true;

  // 加载栏目数据
  if (!navigationList.value) {
    listCmsNavigation({}).then((res) => {
      navigationList.value = toTreeData({
        data: res?.map((d) => {
          d.value = d.navigationId;
          d.label = d.title;
          if (!d.component) {
            d.disabled = true;
          }
          if (
            d.model == 'index' ||
            d.model == 'page' ||
            d.model == 'order' ||
            d.model == 'links'
          ) {
            d.disabled = true;
          }
          return d;
        }),
        idField: 'navigationId',
        parentIdField: 'parentId'
      });
    });
  }
};

/* 自定义行属性 */
const customRow = (record: HjmQuestions) => {
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
query();
</script>

<script lang="ts">
export default {
  name: 'HjmQuestions'
};
</script>

<style lang="less" scoped></style>
