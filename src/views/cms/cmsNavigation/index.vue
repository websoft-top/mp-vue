<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false">
      <!-- 表格 -->
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
        :scroll="{ x: 1200 }"
        cache-key="proCmsNavigationTable"
        @done="onDone"
        @expand="onExpand"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
              展开
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
              折叠
            </a-button>
            <a-divider type="vertical"/>
            <a-radio-group v-model:value="position" @change="reload">
              <a-radio-button :value="1">顶部</a-radio-button>
              <a-radio-button :value="2">底部</a-radio-button>
              <a-radio-button :value="0">不限</a-radio-button>
            </a-radio-group>
            <a-divider type="vertical"/>
            <a-select
              v-model:value="modelName"
              style="width: 150px"
              placeholder="选择模型"
              @change="reload"
            >
              <a-select-option :value="undefined">不限</a-select-option>
              <template v-for="(item,index) in modelList" :key="index">
                <a-select-option :value="item.model" :index="index">{{ item.name }}</a-select-option>
              </template>
            </a-select>
            <!-- 搜索表单 -->
            <a-input-search
              allow-clear
              v-model:value="searchText"
              placeholder="请输入搜索关键词"
              @search="reload"
              @pressEnter="reload"
            />
            <a-button
              type="text"
              @click="push('/website/model')"
            >模型管理
            </a-button
            >
            <a-button type="text" class="ele-btn-icon" @click="clearSiteInfoCache">
              清除缓存
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'title'">
            <a-space>
              <a-avatar v-if="record.icon" :size="22" :src="record.icon"/>
              <a @click="push({
                  path: `/website/article`,
                  query: {
                    id: record.navigationId,
                    name: record.title,
                    model: record.model
                  }
                })">{{ record.title }}</a>
            </a-space>
            <template v-if="record.model == 'page'">
              <a-divider type="vertical"/>
              <a-tooltip v-if="record.model == 'page'" :title="`编辑页面内容及SEO信息`">
                <a @click="openDesign(record)">
                  <FileWordOutlined/>
                </a>
              </a-tooltip>
            </template>
          </template>
          <template v-if="column.key === 'path'">
            <div @mouseover="saveNavigationIcon(record.navigationId)" @mouseleave="removeNavigationIcon">
              <span class="text-gray-400">{{ record.path }}</span>
              <span class="text-gray-400" v-if="currentId == record.navigationId" @click="copyText(record.path)"><CopyOutlined
                class="px-2"/></span>
            </div>
          </template>
          <template v-if="column.key === 'component'">
            <template v-if="!isDirectory(record)">
              <span class="ele-text-placeholder">{{ record.component }}</span>
            </template>
            <template v-else>
              <span></span>
            </template>
          </template>
          <template v-if="column.key === 'model'">
            <text class="ele-text-placeholder">{{ record.model }}</text>
          </template>
          <template v-if="column.key === 'type'">
            <a-tag v-if="isExternalLink(record.path)" color="purple"
            >外部链接
            </a-tag
            >
            <a-tag v-else-if="index === 0" color="orange">首页</a-tag>
            <a-tag v-else-if="isExternalLink(record.component)" color="orange">
              内链
            </a-tag>
            <span v-else-if="isDirectory(record)"></span>
            <a-tag v-else>{{ record.modelName }}</a-tag>
          </template>
          <template v-if="column.key === 'banner'">
            <a-image v-if="record.banner" :src="record.banner" :width="100"/>
          </template>
          <template v-if="column.key === 'showIndex'">
            <a-tag v-if="record.showIndex === 1" color="green">显示</a-tag>
            <span v-else></span>
          </template>
          <template v-if="column.key === 'position'">
            <a-space>
              <span v-if="record.top === 0" class="ele-text-placeholder"
              >顶部</span
              >
              <span v-if="record.bottom === 0" class="ele-text-placeholder"
              >底部</span
              >
              <span v-if="record.top === 0 || record.bottom === 0"></span>
            </a-space>
          </template>
          <template v-if="column.key === 'hide'">
            <span v-if="record.hide === 0" class="ele-text-success">显示</span>
            <span v-if="record.hide === 1" class="ele-text-placeholder"
            >隐藏</span
            >
          </template>
          <template v-else-if="column.key === 'action'">
            <template v-if="record.path != '/'">
              <!--              <a-tooltip v-if="record.model == 'page'" :title="`配置SEO及页面内容`">-->
              <!--                <a @click="openDesign(record)">单页</a>-->
              <!--                <a-divider type="vertical"/>-->
              <!--              </a-tooltip>-->
              <a-tooltip :title="`添加子分类`">
                <a @click="openEdit(null, record.navigationId,record.model)">添加</a>
              </a-tooltip>
              <!--              <a-divider type="vertical" />-->
              <!--              <a-tooltip :title="`自定义组件`">-->
              <!--                <a @click="openDesign(record)">组件</a>-->
              <!--              </a-tooltip>-->
              <a-divider type="vertical"/>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                placement="topRight"
                title="确定要删除此菜单吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </template>
            <template v-else>
              <!--              <a-tooltip :title="`布局`">-->
              <!--                <a @click="openEdit(null, record.navigationId,record.model)" disabled>设置</a>-->
              <!--              </a-tooltip>-->
              <!--              <a-tooltip :title="`添加子分类`">-->
              <!--                <a @click="openEdit(null, record.navigationId,record.model)">添加</a>-->
              <!--              </a-tooltip>-->
              <!--              <a-tooltip :title="`自定义组件`">-->
              <!--                <a @click="openDesign(record)">组件</a>-->
              <!--              </a-tooltip>-->
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                placement="topRight"
                title="确定要删除此菜单吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </template>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <CmsNavigationEdit
      v-model:visible="showEdit"
      :data="current"
      :parent-id="parentId"
      :navigation-list="navigationData"
      :position="position"
      :model="model"
      @done="reload"
    />
    <!-- 页面编辑弹窗 -->
    <DesignEdit
      v-model:visible="showDesignEdit"
      :data="design"
      :category-id="categoryId"
      @done="reload"
    />
    <!-- 页面组件弹窗 -->
    <Components
      v-model:visible="showDesignRecordEdit"
      :data="current"
      :category-id="categoryId"
      @done="reload"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {message} from 'ant-design-vue/es';
import {PlusOutlined, CopyOutlined, FileWordOutlined} from '@ant-design/icons-vue';
import type {
  DatasourceFunction,
  ColumnItem,
  EleProTableDone
} from 'ele-admin-pro/es/ele-pro-table/types';
import {
  messageLoading,
  toDateString,
  isExternalLink,
  toTreeData,
  eachTreeData
} from 'ele-admin-pro/es';
import type {EleProTable} from 'ele-admin-pro/es';
import {useI18n} from 'vue-i18n';
import CmsNavigationEdit from './components/navigation-edit.vue';
import DesignEdit from './components/design-edit.vue';
import Components from './components/components.vue';
import {
  listCmsNavigation,
  removeCmsNavigation
} from '@/api/cms/cmsNavigation';
import type {
  CmsNavigation,
  CmsNavigationParam
} from '@/api/cms/cmsNavigation/model';
import {copyText, getPageTitle} from '@/utils/common';
import {CmsDesign} from '@/api/cms/cmsDesign/model';
import {removeSiteInfoCache} from '@/api/cms/cmsWebsite';
import Extra from "./components/extra.vue";
import {useRouter} from 'vue-router';
import {listCmsModel} from "@/api/cms/cmsModel";
import {CmsModel} from "@/api/cms/cmsModel/model";

const {push} = useRouter();
// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
const modelList = ref<CmsModel[]>([])
const websiteId = localStorage.getItem('WebsiteId')
const currentId = ref<number>();
const modelName = ref<string>();
// 国际化
const {locale} = useI18n();

// 表格列配置
const columns = ref<ColumnItem[]>([
  // {
  //   key: 'index',
  //   width: 48,
  //   align: 'center',
  //   fixed: 'left',
  //   hideInSetting: true,
  //   customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
  // },
  {
    title: 'ID',
    dataIndex: 'navigationId',
    key: 'navigationId',
    width: 90
  },
  {
    title: '栏目名称',
    dataIndex: 'title',
    key: 'title',
    showSorterTooltip: false,
    ellipsis: true
  },
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    hideInTable: true,
    key: 'component'
  },
  {
    title: '模型',
    dataIndex: 'model',
    key: 'model',
    width: 120,
    align: 'center'
  },
  {
    title: 'banner',
    dataIndex: 'banner',
    align: 'center',
    key: 'banner',
    width: 120,
    hideInTable: true
  },
  {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
    align: 'center',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'hide',
    key: 'hide',
    align: 'center',
    width: 120,
    showSorterTooltip: false,
    customRender: ({text}) => ['显示', '隐藏'][text]
  },
  {
    title: '排序',
    dataIndex: 'sortNumber',
    align: 'center',
    width: 120,
    showSorterTooltip: false
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    showSorterTooltip: false,
    ellipsis: true,
    hideInTable: true,
    width: 180,
    customRender: ({text}) => toDateString(text)
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 220,
    fixed: 'right'
  }
]);

// 当前编辑数据
const current = ref<CmsNavigation | null>(null);
// 当前选中页面
const design = ref<CmsDesign>();
// 是否显示编辑弹窗
const showEdit = ref(false);
// 编辑内容
const showDesignEdit = ref(false);
// 页面组件
const showDesignRecordEdit = ref(false);
// 上级分类id
const parentId = ref<number>();
const categoryId = ref<number>();
// 分类数据
const navigationData = ref<CmsNavigation[]>([]);
// 表格展开的行
const expandedRowKeys = ref<number[]>([]);
const searchText = ref('');
const position = ref(undefined);
const model = ref<any>('page')

// 清除缓存
const clearSiteInfoCache = () => {
  removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId')).then(
    (msg) => {
      if (msg) {
        message.success(msg);
      }
    }
  );
};

// 表格数据源
const datasource: DatasourceFunction = ({where}) => {
  where = {};
  where.keywords = searchText.value;
  where.top = undefined;
  where.bottom = undefined;
  if (position.value == 1) {
    where.top = 0;
    where.bottom = undefined;
  }
  if (position.value == 2) {
    where.top = undefined;
    where.bottom = 0;
  }
  if (position.value == 0) {
    where.top = undefined;
    where.bottom = undefined;
  }
  where.isMpWeixin = false;
  if (locale.value) {
    where.lang = locale.value || undefined;
  }
  where.model = modelName.value;
  return listCmsNavigation({...where});
};

/* 数据转为树形结构 */
const parseData = (data: CmsNavigation[]) => {
  return toTreeData({
    data: data.map((d) => {
      return {...d, key: d.navigationId, value: d.navigationId};
    }),
    idField: 'navigationId',
    parentIdField: 'parentId'
  });
};

/* 表格渲染完成回调 */
const onDone: EleProTableDone<CmsNavigation> = ({data}) => {
  navigationData.value = data;
};

/* 刷新表格 */
const reload = (where?: CmsNavigationParam) => {
  console.log(where, 'w')
  tableRef?.value?.reload({where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsNavigation | null, id?: number, mod?: string) => {
  current.value = row ?? null;
  model.value = mod ?? null;
  parentId.value = id;
  showEdit.value = true;
};

// 跳转模型内容列表
const openDesign = (row?: CmsNavigation) => {
  categoryId.value = row?.navigationId;
  showDesignEdit.value = true;
  return;

  // if (row && isDirectory(row)) {
  //   categoryId.value = row?.navigationId;
  //   showDesignEdit.value = true;
  //   return;
  // }
  // TODO 单页模型
  // if (row?.model == 'custom') {
  //   router.push({
  //     path: `/cms/design`,
  //     query: {
  //       id: row.navigationId,
  //       type: row.model
  //     }
  //   });
  //   return;
  // }

  // TODO 文章列表
  // if (row?.model === 'article') {
  //   router.push({
  //     path: `/cms/article`,
  //     query: {
  //       id: row.navigationId,
  //       type: row.model
  //     }
  //   });
  //   return;
  // }

  // TODO 产品列表
  // if (row?.model === 'product') {
  //   router.push({
  //     path: '/goods/index',
  //     query: { categoryId: row.navigationId, type: row.type }
  //   });
  //   return;
  // }
};

const onModel = () => {
  reload()
}

const saveNavigationIcon = (index: number) => {
  currentId.value = index;
}

const removeNavigationIcon = () => {
  currentId.value = undefined;
}

/* 删除单个 */
const remove = (row: CmsNavigation) => {
  console.log(row);
  if (row.children?.length) {
    message.error('请先删除子节点');
    return;
  }
  const hide = messageLoading('请求中..', 0);
  removeCmsNavigation(row.navigationId)
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

/* 展开全部 */
const expandAll = () => {
  let keys: number[] = [];
  eachTreeData(navigationData.value, (d) => {
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

/* 判断是否是目录 */
const isDirectory = (d: CmsNavigation) => {
  return !!d.children?.length;
};

listCmsModel().then((data) => {
  modelList.value = data;
});

/* 自定义行属性 */
const customRow = (record: CmsNavigation) => {
  return {
    // 行点击事件
    onClick: () => {
      // console.log(record);
    },
    // 行双击事件
    onDblclick: () => {
      if (record.model !== 'index') {
        openEdit(record);
      }
    }
  };
};
</script>

<script lang="ts">
export default {
  name: 'CmsNavigation'
};
</script>
