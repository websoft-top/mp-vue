<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑应用' : '添加应用'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-tabs type="card" v-model:active-key="active" @change="onChange">
        <a-tab-pane tab="基本信息" key="base">
          <a-form-item :label="`${form.type == 0 ? '应用' : '插件'}类型`" name="type">
            <a-radio-group v-model:value="form.type">
              <a-radio-button :value="0"
              >应用
              </a-radio-button
              >
              <a-radio-button :value="1"
              >插件
              </a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="菜单ID" name="menuId">
            <a-input-number
              allow-clear
              placeholder="请输入菜单ID"
              v-model:value="form.menuId"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '应用' : '插件'}名称`" name="shortName">
            <a-input
              allow-clear
              placeholder="请输入应用名称"
              v-model:value="form.shortName"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '应用' : '插件'}描述`" name="comments">
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="请输入描述"
              v-model:value="form.comments"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '应用' : '插件'}图标`" name="companyLogo">
            <SelectFile
              :placeholder="`请上传应用图标`"
              :limit="1"
              :data="icon"
              @done="chooseIcon"
              @del="onDeleteIcon"
            />
          </a-form-item>
          <a-form-item :label="`封面图`" name="image">
            <SelectFile
              :placeholder="`请上传封面图`"
              :limit="1"
              :data="images"
              @done="chooseImage"
              @del="onDeleteItem"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '应用' : '插件'}截图`" name="files">
            <SelectFile
              :placeholder="`请选择视频文件`"
              :limit="6"
              :data="files"
              @done="chooseFile"
              @del="onDeleteFile"
            />
          </a-form-item>
          <a-form-item label="所属栏目" name="categoryId">
            <a-tree-select
              allow-clear
              :tree-data="navigationList"
              tree-default-expand-all
              placeholder="请选择栏目"
              :value="form.categoryId || undefined"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              @update:value="(value?: number) => (form.categoryId = value)"
            />
          </a-form-item>
          <a-form-item label="所属行业" name="industryChild">
            <industry-select
              v-model:value="form.industryChild"
              valueField="label"
              placeholder="请选择所属行业"
              class="ele-fluid"
              @change="onIndustry"
            />
          </a-form-item>
          <a-form-item label="版本套餐" name="version">
            <SelectDictDictionary
              dict-code="packageMethod"
              :placeholder="`选择应用类型`"
              v-model:value="form.version"
              @done="chooseVersion"
            />
          </a-form-item>
          <a-form-item label="专属域名" name="freeDomain">
            <a-input
              v-model:value="form.freeDomain"
              placeholder="huawei"
              addon-before="https://"
              addon-after=".websoft.top"
            />
          </a-form-item>
          <a-form-item label="开通时间" name="startTime">
            <a-date-picker
              v-model:value="form.startTime"
              placeholder="开通时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-form-item label="到期时间" name="expirationTime">
            <a-date-picker
              v-model:value="form.expirationTime"
              placeholder="到期时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
          <a-divider style="margin-bottom: 20px"/>
<!--          <a-form-item label="开发团队" name="companyName">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入企业名称"-->
<!--              v-model:value="form.companyName"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="主体类型" name="companyType">-->
<!--            <SelectDictDictionary-->
<!--              dict-code="CompanyType"-->
<!--              :placeholder="`选择企业类型`"-->
<!--              v-model:value="form.companyType"-->
<!--              @done="chooseCompanyType"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="手机号码" name="phone" extra="手机号码将作为登录账号使用">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入联系电话"-->
<!--              v-model:value="form.phone"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="座机电话" name="tel">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入座机电话"-->
<!--              v-model:value="form.tel"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="邮箱" name="email">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入邮箱"-->
<!--              v-model:value="form.email"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item :label="`${form.companyType == '个人' ? '身份证号码' : '社会信用代码'}`" name="companyCode">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入社会信用代码"-->
<!--              v-model:value="form.companyCode"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="企业法人" name="businessEntity">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入企业法人"-->
<!--              v-model:value="form.businessEntity"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="选择位置" name="lngAndLat">-->
<!--            <div class="flex-sb">-->
<!--              <a-input-->
<!--                allow-clear-->
<!--                placeholder="请选择所在位置"-->
<!--                v-model:value="form.lngAndLat"-->
<!--                disabled-->
<!--              />-->
<!--              <a-button-->
<!--                class="ele-btn-icon"-->
<!--                style="margin-left: 10px"-->
<!--                @click="openMapPicker"-->
<!--              >-->
<!--                打开地图位置选择器-->
<!--              </a-button>-->
<!--            </div>-->
<!--          </a-form-item>-->
<!--          <a-form-item label="所在省份" name="province">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入所在省份"-->
<!--              v-model:value="form.province"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="所在城市" name="city">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入所在城市"-->
<!--              v-model:value="form.city"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="所在辖区" name="region">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入所在辖区"-->
<!--              v-model:value="form.region"-->
<!--            />-->
<!--          </a-form-item>-->
<!--          <a-form-item label="详细地址" name="address">-->
<!--            <a-input-->
<!--              allow-clear-->
<!--              placeholder="请输入详细地址"-->
<!--              v-model:value="form.address"-->
<!--            />-->
<!--          </a-form-item>-->
          <a-divider style="margin-bottom: 20px"/>
          <a-form-item label="成员数量(人数上限)" name="members">
            <a-input
              allow-clear
              disabled
              placeholder="请输入成员数量(人数上限)"
              v-model:value="form.members"
            />
          </a-form-item>
          <a-form-item label="成员数量(当前)" name="users">
            <a-input
              allow-clear
              placeholder="请输入成员数量(当前)"
              disabled
              v-model:value="form.users"
            />
          </a-form-item>
          <a-form-item label="部门数量" name="departments">
            <a-input
              allow-clear
              placeholder="请输入部门数量"
              disabled
              v-model:value="form.departments"
            />
          </a-form-item>
          <a-form-item label="存储空间(已使用)" name="storage">
            <a-input
              allow-clear
              placeholder="请输入存储空间"
              disabled
              v-model:value="form.storage"
            />
          </a-form-item>
          <a-form-item label="存储空间(上限)" name="storageMax">
            <a-input
              allow-clear
              placeholder="请输入存储空间(上限)"
              disabled
              v-model:value="form.storageMax"
            />
          </a-form-item>
          <a-form-item label="模板ID" name="planId">
            <a-input
              allow-clear
              placeholder="请输入当前克隆的租户ID"
              disabled
              v-model:value="form.planId"
            />
          </a-form-item>
          <a-divider style="margin-bottom: 20px"/>
          <a-form-item label="主控节点" name="serverUrl">
            <a-input
              allow-clear
              placeholder="请输入主控节点"
              disabled
              v-model:value="form.serverUrl"
            />
          </a-form-item>
          <a-form-item label="模块节点" name="modulesUrl">
            <a-input
              allow-clear
              placeholder="请输入模块节点"
              v-model:value="form.modulesUrl"
            />
          </a-form-item>
          <a-form-item label="request合法域名" name="requestUrl">
            <a-input
              allow-clear
              placeholder="请输入request合法域名"
              v-model:value="form.requestUrl"
            />
          </a-form-item>
          <a-form-item label="socket合法域名" name="socketUrl">
            <a-input
              allow-clear
              placeholder="请输入socket合法域名"
              v-model:value="form.socketUrl"
            />
          </a-form-item>
          <a-form-item label="网站域名" name="websiteUrl">
            <a-input
              allow-clear
              placeholder="请输入网站域名"
              v-model:value="form.websiteUrl"
            />
          </a-form-item>
          <a-divider style="margin-bottom: 20px"/>
          <a-form-item label="计费方式" name="chargingMethod">
            <a-radio-group v-model:value="form.chargingMethod">
              <a-radio-button :value="0"
              >免费
              </a-radio-button
              >
              <a-radio-button :value="1"
              >一次性
              </a-radio-button
              >
              <a-radio-button :value="2"
              >按年
              </a-radio-button
              >
              <a-radio-button :value="3"
              >按月
              </a-radio-button
              >
              <a-radio-button :value="4"
              >按天
              </a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="销售价格" name="price">
            <a-input-number
              allow-clear
              placeholder="请输入销售价格"
              v-model:value="form.price"
            />
          </a-form-item>
          <a-form-item label="购买数量" name="buys">
            <a-input-number
              allow-clear
              placeholder="请输入购买数量"
              v-model:value="form.buys"
            />
          </a-form-item>
          <a-form-item label="点赞数量" name="likes">
            <a-input-number
              allow-clear
              placeholder="请输入点赞数量"
              v-model:value="form.likes"
            />
          </a-form-item>
          <a-form-item label="浏览数量" name="clicks">
            <a-input-number
              allow-clear
              placeholder="请输入浏览数量"
              v-model:value="form.clicks"
            />
          </a-form-item>
          <a-form-item label="评分" name="rate">
            <a-input-number
              allow-clear
              :min="1.0"
              :max="5.0"
              :precision="1"
              placeholder="评分值"
              v-model:value="form.rate"
            />
          </a-form-item>
<!--          <a-form-item label="是否实名认证" name="authentication">-->
<!--            <a-switch-->
<!--              checked-children="是"-->
<!--              un-checked-children="否"-->
<!--              disabled-->
<!--              :checked="form.authentication == 1"-->
<!--              @update:checked="updateHideValue"-->
<!--            />-->
<!--          </a-form-item>-->
          <a-form-item label="是否推荐" name="recommend">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="form.recommend == 1"
              @update:checked="updateRecommend"
            />
          </a-form-item>
          <a-form-item label="是否官方自营" name="official">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="form.official"
              @update:checked="updateOfficial"
            />
          </a-form-item>
          <a-form-item label="允许搜索" name="hide">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="form.hide"
              @update:checked="updateHide"
            />
          </a-form-item>
          <a-form-item label="排序号" name="sortNumber">
            <a-input-number
              :min="0"
              :max="9999"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"
            />
          </a-form-item>
        </a-tab-pane>
        <template v-if="isUpdate">
          <a-tab-pane tab="安装说明" key="content">
            <!-- 编辑器 -->
            <tinymce-editor
              ref="editorRef"
              class="content"
              v-model:value="content"
              :init="config"
              placeholder="图片直接粘贴自动上传"
              @paste="onPaste"
            />
          </a-tab-pane>
          <a-tab-pane tab="产品参数" key="parameter">
<!--            <CompanyParameter :companyId="form.companyId"/>-->
          </a-tab-pane>
          <a-tab-pane tab="代码仓库" key="git">
            <CompanyGit :companyId="form.companyId"/>
          </a-tab-pane>
          <a-tab-pane tab="链接管理" key="links">
            <CompanyUrl :companyId="form.companyId"/>
          </a-tab-pane>
          <a-tab-pane tab="评论管理" key="comment">
<!--            <CompanyComment :companyId="form.companyId"/>-->
          </a-tab-pane>
        </template>
      </a-tabs>
    </a-form>
  </ele-modal>
  <!-- 地图位置选择弹窗 -->
  <ele-map-picker
    :need-city="true"
    :dark-mode="darkMode"
    v-model:visible="showMap"
    :center="[108.374959, 22.767024]"
    :search-type="1"
    :zoom="12"
    @done="onDone"
  />
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addCompany, updateCompany} from '@/api/system/company';
import {Company} from '@/api/system/company/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance} from 'ant-design-vue/es/form';
import {FileRecord} from '@/api/system/file/model';
import {CenterPoint} from "ele-admin-pro/es/ele-map-picker/types";
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
// import CompanyComment from "@/views/system/companyComment/index.vue";
import CompanyUrl from "@/views/system/companyUrl/index.vue";
// import CompanyParameter from "@/views/system/companyParameter/index.vue";
import CompanyGit from "@/views/system/companyGit/index.vue";
import TinymceEditor from "@/components/TinymceEditor/index.vue";
import {uploadFile, uploadOss} from "@/api/system/file";
import {listCompanyContent} from "@/api/system/companyContent";

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive, darkMode} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: Company | null;
  // 栏目数据
  navigationList?: CmsNavigation[];
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const companyId = ref(0);
// 提交状态
const loading = ref(false);
// 是否显示最大化切换按钮
const maxable = ref(true);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);
const images = ref<ItemType[]>([]);
const icon = ref<ItemType[]>([]);
const content = ref<any>();
// 是否显示地图选择弹窗
const showMap = ref(false);
const files = ref<ItemType[]>([]);
// 当前选项卡
const active = ref('base');

// 用户信息
const form = reactive<Company>({
  companyId: undefined,
  type: undefined,
  menuId: undefined,
  shortName: undefined,
  companyName: undefined,
  companyCode: undefined,
  companyType: undefined,
  companyTypeMultiple: undefined,
  companyLogo: undefined,
  image: undefined,
  categoryId: 0,
  files: undefined,
  appType: undefined,
  freeDomain: undefined,
  domain: undefined,
  phone: undefined,
  tel: undefined,
  email: undefined,
  content: undefined,
  invoiceHeader: undefined,
  businessEntity: undefined,
  startTime: undefined,
  expirationTime: undefined,
  version: undefined,
  versionName: undefined,
  versionCode: undefined,
  price: undefined,
  rate: undefined,
  chargingMethod: undefined,
  members: undefined,
  users: undefined,
  official: undefined,
  industryParent: undefined,
  industryChild: undefined,
  departments: undefined,
  storage: undefined,
  storageMax: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  region: undefined,
  address: undefined,
  lngAndLat: '',
  longitude: undefined,
  latitude: undefined,
  authentication: undefined,
  authoritative: undefined,
  serverUrl: undefined,
  modulesUrl: undefined,
  redirectUrl: undefined,
  requestUrl: undefined,
  socketUrl: undefined,
  adminUrl: undefined,
  merchantUrl: undefined,
  websiteUrl: undefined,
  mpWeixinCode: undefined,
  mpAlipayCode: undefined,
  h5Code: undefined,
  androidUrl: undefined,
  iosUrl: undefined,
  recommend: undefined,
  likes: undefined,
  clicks: undefined,
  buys: undefined,
  isTax: undefined,
  planId: undefined,
  websiteStatus: undefined,
  merchantId: undefined,
  tid: undefined,
  userId: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  status: 100,
  hide: undefined,
  comments: '',
  sortNumber: 100
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  type: [
    {
      required: true,
      type: 'number',
      message: '请选择应用类型',
      trigger: 'change'
    }
  ],
  companyLogo: [
    {
      required: true,
      type: 'string',
      message: '请上传应用图标',
      trigger: 'change'
    }
  ],
  image: [
    {
      required: true,
      type: 'string',
      message: '请上传封面图',
      trigger: 'change'
    }
  ],
  shortName: [
    {
      required: true,
      type: 'string',
      message: '请填写应用名称',
      trigger: 'blur'
    }
  ],
  menuId: [
    {
      required: true,
      type: 'number',
      message: '请填写菜单根节点ID',
      trigger: 'blur'
    }
  ],
  freeDomain: [
    {
      required: true,
      type: 'string',
      message: '请填写专属访问域名',
      trigger: 'blur'
    }
  ],
  industryChild: [
    {
      required: true,
      type: 'string',
      message: '请选择所属行业',
      trigger: 'change'
    }
  ],
  price: [
    {
      required: true,
      type: 'number',
      message: '请填写销售价格',
      trigger: 'blur'
    }
  ],
  comments: [
    {
      required: true,
      type: 'string',
      message: '请填写应用介绍',
    }
  ],
  categoryId: [
    {
      required: true,
      type: 'number',
      message: '请选择所属栏目',
      trigger: 'change'
    }
  ],
  companyType: [
    {
      required: true,
      type: 'string',
      message: '请选择主体类型',
      trigger: 'change'
    }
  ],
  chargingMethod: [
    {
      required: true,
      type: 'number',
      message: '请选择计费方式',
      trigger: 'change'
    }
  ],
  appType: [
    {
      required: true,
      type: 'string',
      message: '请选择应用类型',
      trigger: 'change'
    }
  ],
  version: [
    {
      required: true,
      type: 'string',
      message: '请选择应用版本',
      trigger: 'change'
    }
  ],
  phone: [
    {
      required: true,
      type: 'string',
      message: '请填写联系电话',
      trigger: 'blur'
    }
  ],
  companyName: [
    {
      required: true,
      type: 'string',
      message: '请填写应用名称',
      trigger: 'blur'
    }
  ]
});

const chooseImage = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.image = data.path;
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.image = '';
};

const chooseIcon = (data: FileRecord) => {
  icon.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.companyLogo = data.path;
}

const onDeleteIcon = (index: number) => {
  icon.value.splice(index, 1);
  form.companyLogo = '';
};

const chooseCompanyType = (data: any) => {
  form.companyType = data.dictDataCode;
}

const chooseAppType = (data: any) => {
  form.appType = data.dictDataCode;
}

const chooseVersion = (data: any) => {
  form.version = data.dictDataCode;
}

const onIndustry = (item: any) => {
  form.industryParent = item[0]
  form.industryChild = item[1];
};

const updateHideValue = (value: boolean) => {
  form.authentication = value ? 1 : 0;
};

const updateRecommend = (value: number) => {
  form.recommend = value ? 1 : 0;
}

const updateOfficial = () => {
  form.official = !form.official;
}

const updateHide = () => {
  form.hide = !form.hide;
}

const chooseFile = (data: FileRecord) => {
  files.value.push({
    uid: data.id,
    url: data.url,
    status: 'done'
  });
};

const onDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

const onChange = () => {
  // 加载多规格
  form.companyId = props.data?.companyId
};

// const updateAuthoritative = () => {
//   form.authoritative = !form.authoritative;
// }

// const updateWebsiteStatus = () => {
//   form.websiteStatus = !form.websiteStatus
// }

/* 打开位置选择 */
const openMapPicker = () => {
  showMap.value = true;
};

/* 地图选择后回调 */
const onDone = (location: CenterPoint) => {
  // city.value = [
  //   `${location.city?.province}`,
  //   `${location.city?.city}`,
  //   `${location.city?.district}`
  // ];
  form.province = `${location.city?.province}`;
  form.city = `${location.city?.city}`;
  form.region = `${location.city?.district}`;
  form.address = `${location.address}`;
  form.latitude = `${location.lat}`;
  form.longitude = `${location.lng}`;
  form.lngAndLat = `${location.lng},${location.lat}`;
  showMap.value = false;
};

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);
const config = ref({
  height: 500,
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();
    const formData = new FormData();
    formData.append('file', file, file.name);
    uploadOss(file).then(res => {
      success(res.path)
    }).catch((msg) => {
      error(msg);
    })
  },
  // 自定义文件上传(这里使用把选择的文件转成 blob 演示)
  file_picker_callback: (callback: any, _value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    // 设定文件可选类型
    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*,.pdf');
    }
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      if (meta.filetype === 'media') {
        if (file.size / 1024 / 1024 > 200) {
          editorRef.value?.alert({ content: '大小不能超过 200MB' });
          return;
        }
        if(file.type.startsWith('application/pdf')){
          uploadOss(file).then(res => {
            const addPath = `<a href="${res.downloadUrl}" target="_blank">${res.name}</a>`;
            content.value = content.value + addPath
          })
          return;
        }
        if (!file.type.startsWith('video/')) {
          editorRef.value?.alert({ content: '只能选择视频文件' });
          return;
        }
        uploadOss(file).then(res => {
          callback(res.path)
        });
      }
    };
    input.click();
  }
});

/* 粘贴图片上传服务器并插入编辑器 */
const onPaste = (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  let hasFile = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      let file = items[i].getAsFile();
      const item: ItemType = {
        file,
        uid: (file as any).lastModified,
        name: file.name
      };
      uploadFile(<File>item.file)
        .then((result) => {
          const addPath = `<p><img class="content-img" src="${result.url}"></p>`;
          content.value = content.value + addPath
        })
        .catch((e) => {
          message.error(e.message);
        });
      hasFile = true;
    }
  }
  if (hasFile) {
    e.preventDefault();
  }
}

const {resetFields} = useForm(form, rules);

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      const formData = {
        ...form,
        content: content.value,
        files: JSON.stringify(files.value),
        domain: `${form.freeDomain}.websoft.top`
      };
      const saveOrUpdate = isUpdate.value ? updateCompany : addCompany;
      saveOrUpdate(formData)
        .then((msg) => {
          loading.value = false;
          message.success(msg);
          updateVisible(false);
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          message.error(e.message);
        });
    })
    .catch(() => {
    });
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      icon.value = [];
      images.value = [];
      files.value = [];
      content.value = '';
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.companyLogo) {
          icon.value.push({
            uid: uuid(),
            url: props.data.companyLogo,
            status: 'done'
          })
        }
        if (props.data.image) {
          images.value.push({
            uid: uuid(),
            url: props.data.image,
            status: 'done'
          })
        }
        if (props.data.version) {
          form.version = `${props.data.version}`
        }
        if (props.data.files) {
          files.value = JSON.parse(props.data.files);
        }
        listCompanyContent({companyId: props.data?.companyId}).then(list => {
          if(list.length > 0){
            content.value = list[0].content
          }
        })
        isUpdate.value = true;
      } else {
        isUpdate.value = false;
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
<style lang="less" scoped>
.flex-sb {
  display: flex;
  justify-content: space-between;
}
</style>
