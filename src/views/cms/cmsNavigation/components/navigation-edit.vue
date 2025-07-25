<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改导航' : '新建导航'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 6, sm: 4, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 18, sm: 20, xs: 24 } : { flex: '1' }
      "
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="上级分类" name="parentId">
            <a-tree-select
              allow-clear
              :tree-data="navigationList"
              tree-default-expand-all
              placeholder="请选择上级分类"
              :value="form.parentId || undefined"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              @update:value="(value?: number) => (form.parentId = value)"
            />
          </a-form-item>
          <a-form-item label="菜单名称" name="title">
            <a-input
              allow-clear
              placeholder="请输入菜单名称"
              v-model:value="form.title"
              @pressEnter="save"
            />
          </a-form-item>
          <a-form-item label="模型" name="model">
            <a-select v-model:value="form.model">
              <a-select-option
                v-for="item in models"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :label="`详情页ID`"
            name="itemId"
            v-if="form.model == 'detail' || form.model == 'item'"
          >
            <a-input-number
              allow-clear
              :placeholder="`请输入详情页ID`"
              v-model:value="form.itemId"
              style="width: 276px;"
              @pressEnter="save"
            />
          </a-form-item>
          <!--          <a-form-item label="组件路径" name="component" v-if="isUpdate">-->
          <!--            <a-input-->
          <!--              allow-clear-->
          <!--              disabled-->
          <!--              placeholder="/pages/item/index.vue"-->
          <!--              v-model:value="form.component"-->
          <!--              @pressEnter="save"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-form-item
            :label="form.model == 'links' ? '链接地址' : '路由地址'"
            name="path"
            v-if="form.model == 'links'"
          >
            <a-input
              allow-clear
              :placeholder="pathPlaceholder"
              v-model:value="form.path"
              @pressEnter="save"
            />
          </a-form-item>
          <a-form-item label="css样式" name="style" v-if="isUpdate">
            <a-input
              allow-clear
              placeholder="CSS"
              v-model:value="form.style"
              @pressEnter="save"
            />
          </a-form-item>
          <a-form-item label="描述" name="comments">
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="请输入描述"
              v-model:value="form.comments"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <!--          <a-form-item label="模型" name="model">-->
          <!--            <SelectModel-->
          <!--              dict-code="NavigationModel"-->
          <!--              :placeholder="`选择模型`"-->
          <!--              v-model:value="form.model"-->
          <!--              @done="chooseModel"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-form-item label="位置" name="top" v-if="isUpdate">
            <a-radio-group v-model:value="form.position" @change="onPosition">
              <a-radio :value="1">顶部</a-radio>
              <a-radio :value="2">底部</a-radio>
              <a-radio :value="0">不限</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="栅格" name="span">
            <a-input-number
              :min="0"
              :max="24"
              v-model:value="form.span"
              @pressEnter="save"
            />
          </a-form-item>
          <a-form-item label="排序" name="sortNumber">
            <a-input-number
              :min="0"
              :max="99999"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"
              @pressEnter="save"
            />
          </a-form-item>
          <a-form-item label="图标" name="icon">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="1"
              :data="images"
              :width="50"
              :height="50"
              @done="chooseFile"
              @del="onDeleteItem"
            />
          </a-form-item>
          <a-divider style="margin-bottom: 16px"/>
          <a-form-item label="状态" name="hide">
            <a-space>
              <a-switch
                checked-children="显示"
                un-checked-children="隐藏"
                :checked="form.hide === 0"
                @update:checked="updateHideValue"
              />
            </a-space>
          </a-form-item>
          <a-form-item label="权限" name="permission" v-if="isUpdate">
            <a-radio-group v-model:value="form.permission">
              <a-radio :value="0">所有人</a-radio>
              <a-radio :value="1">登录可见</a-radio>
              <a-radio :value="2">密码可见</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="访问密码"
            name="password"
            v-if="form.permission == 2"
          >
            <a-input-password
              allow-clear
              placeholder="请输入查看密码"
              v-model:value="password"
            />
          </a-form-item>
          <a-form-item label="关联栏目" name="style" v-if="lang && lang != 'zh_CN'"
                       extra="选择对应中文栏目，用于同步保存翻译内容">
            <a-tree-select
              allow-clear
              :tree-data="zhCmsNavigationList"
              tree-default-expand-all
              placeholder="请选择上级分类"
              :value="form.langCategoryId || undefined"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              @update:value="(value?: number) => (form.langCategoryId = value)"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {message} from 'ant-design-vue/es';
import type {FormInstance, Rule} from 'ant-design-vue/es/form';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {toTreeData} from 'ele-admin-pro/es';
import {useThemeStore} from '@/store/modules/theme';
import useFormData from '@/utils/use-form-data';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';
import {
  addCmsNavigation, listCmsNavigation,
  updateCmsNavigation
} from '@/api/cms/cmsNavigation';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FileRecord} from '@/api/system/file/model';
import {uuid} from "ele-admin-pro";
import {CmsModel} from "@/api/cms/cmsModel/model";
import {listCmsModel} from "@/api/cms/cmsModel";

// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);
const {locale} = useI18n();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsNavigation | null;
  // 上级分类id
  parentId?: number;
  // 位置
  position?: number;
  // 全部导航数据
  navigationList: CmsNavigation[];
  // 模型
  model?: string;
}>();


const models = ref<CmsModel[]>([]);
//
const formRef = ref<FormInstance | null>(null);
// 是否是修改
const isUpdate = ref(false);
// 提交状态
const loading = ref(false);
// 已上传数据
const images = ref<ItemType[]>([]);
const password = ref();
const pathPlaceholder = ref<string>('请输入链接地址');
const lang = ref(localStorage.getItem('i18n-lang'));
const zhCmsNavigationList = ref<CmsNavigation[]>([]);

// 表单数据
const {form, resetFields, assignFields} = useFormData<CmsNavigation>({
  navigationId: undefined,
  model: 'page',
  code: undefined,
  modelName: undefined,
  type: 0,
  title: '',
  parentId: 0,
  parentName: undefined,
  parentPath: undefined,
  parentPosition: undefined,
  path: undefined,
  component: undefined,
  componentPath: '/pages/[page].vue',
  sortNumber: 100,
  comments: '',
  hide: 0,
  permission: 0,
  password: undefined,
  position: 1,
  top: 0,
  bottom: 1,
  gutter: undefined,
  span: 0,
  isMpWeixin: undefined,
  status: 0,
  pageId: 0,
  itemId: 0,
  lang: locale.value,
  langCategoryId: undefined,
  tenantId: undefined
});

// 表单验证规则
const rules = reactive<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '请输入菜单名称',
      type: 'string',
      trigger: 'blur'
    }
  ],
  itemId: [
    {
      required: true,
      message: '请选择详情页ID',
      type: 'number',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: '请输入路由地址',
      type: 'string',
      trigger: 'blur'
    }
  ],
  model: [
    {
      required: true,
      message: '请选择模型',
      type: 'string',
      trigger: 'blur'
    }
  ],
  // component: [
  //   {
  //     required: true,
  //     type: 'string',
  //     trigger: 'blur',
  //     validator: (_rule: Rule, value: string) => {
  //       return new Promise<void>((resolve, reject) => {
  //         if (!value) {
  //           return reject('请填写组件路径');
  //         }
  //         if (value.charAt(0) != '/') {
  //           return reject('请填写路由地址，必须是以"/"开头的英文字母+数字');
  //         }
  //         if (isChinese(value)) {
  //           return reject('不支持中文');
  //         }
  //         resolve();
  //       });
  //     }
  //   }
  // ],
  // path: [
  //   {
  //     required: true,
  //     type: 'string',
  //     trigger: 'blur',
  //     validator: (_rule: Rule, value: string) => {
  //       return new Promise<void>((resolve, reject) => {
  //         if (!value) {
  //           return reject('请填写路由地址');
  //         }
  //         if (form.type == 9) {
  //           if (!isUrl(value)) {
  //             return reject('请输入正确的网址');
  //           }
  //           resolve();
  //         }
  //         if (form.type == 1) {
  //           if (form.pageId == 0) {
  //             return reject('请选择页面');
  //           }
  //         }
  //         if (value.charAt(0) != '/') {
  //           return reject('请填写路由地址，必须是以"/"开头的英文字母+数字');
  //         }
  //         if (isChinese(value)) {
  //           return reject('不支持中文');
  //         }
  //         resolve();
  //         // checkExistence('path', value, form.navigationId)
  //         //   .then((msg) => {
  //         //     return reject(msg);
  //         //   })
  //         //   .catch(() => {
  //         //     resolve();
  //         //   });
  //       });
  //     }
  //   }
  // ],
  status: [
    {
      required: true,
      message: '请设置是否展示',
      type: 'number',
      trigger: 'blur'
    }
  ]
});

const chooseModel = (item: CmsModel) => {
  form.model = `${item.model}`;
  form.path = `${item.path}`;
  form.component = `${item.component}`;
  form.itemId = undefined;

  if (item.model == 'links') {
    pathPlaceholder.value = 'https://';
  }
  if (item.model == 'product') {
    pathPlaceholder.value = '/iphone-15-pro';
  }
};

const chooseFile = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.icon = data.path;
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.icon = '';
};

const onPosition = (index: number) => {
  if (form.position == 0) {
    form.top = 0;
    form.bottom = 0;
  }
  if (form.position == 1) {
    form.top = 0;
    form.bottom = 1;
  }
  if (form.position == 2) {
    form.top = 1;
    form.bottom = 0;
  }
};

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      if (password.value) {
        form.password = password.value;
      }
      if (form.model == 'detail' && form.itemId == 0) {
        message.error('请输入文章ID');
        return false;
      }
      if (form.model == 'item' && form.itemId == 0) {
        message.error('请输入产品ID');
        return false;
      }
      if (form.path == '/') {
        form.model = 'index';
        form.sortNumber = 0;
      }
      const navigationForm = {
        ...form,
        parentId: form.parentId || 0
      };
      const saveOrUpdate = isUpdate.value
        ? updateCmsNavigation
        : addCmsNavigation;
      saveOrUpdate(navigationForm)
        .then((msg) => {
          message.success(msg);
          updateVisible(false);
          emit('done');
        })
        .catch((e) => {
          message.error(e.message);
        });
    })
    .catch(() => {
    });
};

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

const updateHideValue = (value: boolean) => {
  form.hide = value ? 0 : 1;
};

// 获取模型列表
const getModels = () => {
  listCmsModel({}).then(res => {
    models.value = res.map(d => {
      d.label = d.name;
      d.value = d.model;
      return d;
    });
  })
}

// 简体中文栏目
if (lang.value != 'zh_CN') {
  listCmsNavigation({
    lang: 'zh_CN'
  }).then(list => {
    zhCmsNavigationList.value = toTreeData({
      data: list.map((d) => {
        return {...d, key: d.navigationId, value: d.navigationId};
      }),
      idField: 'navigationId',
      parentIdField: 'parentId'
    });

  })
}


watch(
  () => props.visible,
  (visible) => {
    getModels();
    if (visible) {
      form.position = props.position;
      images.value = [];
      if (props.parentId) {
        form.parentId = props.parentId;
      }
      if (props.model) {
        form.model = props.model;
        form.path = `/${props.model}`;
        form.component = `/pages/${props.model}/index.vue`;
        if (props.model == 'page') {
          form.component = `/pages/[${props.model}]/index.vue`;
        }
      }
      if (props.data) {
        assignFields({
          ...props.data,
          tempPath: props.data.path
        });
        if (props.data.icon) {
          images.value.push({
            uid: uuid(),
            url: props.data.icon,
            status: 'done'
          });
        }
        if (form.lang == '') {
          form.lang = locale.value;
        }
        if (props.data.parentPosition) {
          form.position = props.data.parentPosition;
        }
        // if (props.data.type == 2) {
        //   form.pageName = props.data.title;
        // }
        isUpdate.value = true;
      } else {
        isUpdate.value = false;
      }
    } else {
      resetFields();
      formRef.value?.clearValidate();
    }
  }
);
</script>

<script lang="ts">
import * as icons from '@/layout/menu-icons';

export default {
  components: icons,
  data() {
    return {
      iconData: [
        {
          title: '已引入的图标',
          icons: Object.keys(icons)
        }
      ]
    };
  }
};
</script>
