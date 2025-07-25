<template>
  <div class="ele-body ele-body-card">
    <a-card
      :bordered="false"
      :body-style="{ paddingTop: '0px', minHeight: '800px' }"
    >
      <a-tabs v-model:active-key="active" size="large">
        <a-tab-pane tab="系统信息" key="info">
          <a-form
            :label-col="
              styleResponsive
                ? { lg: 2, md: 6, sm: 4, xs: 24 }
                : { flex: '100px' }
            "
            :wrapper-col="styleResponsive ? { offset: 1 } : { offset: 1 }"
            style="margin-top: 20px;"
          >
            <a-form-item labelAlign="right" label="LOGO">
              <SelectFile
                :placeholder="`请选择图片`"
                :limit="1"
                :data="logo"
                @done="chooseFile"
                @del="onDeleteItem"
              />
            </a-form-item>
            <a-form-item label="租户ID">
              <span class="ele-text-heading">{{ form.tenantId }}</span>
            </a-form-item>
            <a-form-item label="应用名称">
              <a-space class="justify ele-text-heading">
                <span>{{ form.shortName }}</span>
                <a @click="onEdit('应用名称', 'shortName', form.shortName)"
                >修改</a
                >
              </a-space>
            </a-form-item>
            <a-form-item label="应用描述">
              <a-space class="justify ele-text-heading">
                <div style="max-width: 600px">{{ form.comments }}</div>
                <a @click="onEdit('应用描述', 'comments', form.comments)"
                >修改</a
                >
              </a-space>
            </a-form-item>
            <a-form-item label="专属域名">
              <a-space class="justify">
                <a class="cursor-pointer" @click="openSpmUrl(`${form.adminUrl}`)">{{ `${form.adminUrl}` }}</a>
                <a @click="onEdit('专属域名', 'adminUrl', form.adminUrl)">修改</a>
              </a-space>
            </a-form-item>
            <!--            <a-form-item label="应用类型">-->
            <!--              <a-space class="justify">-->
            <!--                <span>Tenant</span>-->
            <!--              </a-space>-->
            <!--            </a-form-item>-->
<!--            <a-form-item label="应用状态">-->
<!--              <span v-if="form.status == 0" class="ele-text-success">已上线</span>-->
<!--              <span v-if="form.status == 1" class="ele-text-warning">开发中</span>-->
<!--              <span v-if="form.status == 2" class="ele-text-danger">维护中</span>-->
<!--              <span v-if="form.status == 3" class="ele-text-placeholder">已欠费</span>-->
<!--            </a-form-item>-->
            <a-form-item label="应用版本">
              <a-space class="justify">
                <a-tag v-if="form.version === 10" class="cursor-pointer" @click="updateVersion(form.version)">基础版</a-tag>
                <a-tag color="blue" v-if="form.version === 20" class="cursor-pointer" @click="updateVersion(form.version)">专业版</a-tag>
                <a-tag color="cyan" v-if="form.version === 30">永久授权</a-tag>
              </a-space>
            </a-form-item>
<!--            <a-form-item label="网站主页">-->
<!--              <a-space class="justify">-->
<!--                <span class="cursor-pointer" @click="openSpmUrl(`https://${form.websiteUrl}`)">{{ `${form.websiteUrl}` }}</span>-->
<!--                <a @click="onEdit('专属域名', 'websiteUrl', form.websiteUrl)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
            <a-form-item label="开通时间">
              <span class="ele-text-heading">{{ form.createTime }}</span>
            </a-form-item>
            <a-form-item label="到期时间" v-if="form.version != 30">
              <a-space>
                <span class="ele-text-heading">{{ form.expirationTime }}</span>
                <a-tag color="red">已到期</a-tag>
              </a-space>
            </a-form-item>
            <a-divider style="padding-bottom: 20px" />
<!--            <a-form-item label="主体名称">-->
<!--              <a-space class="justify">-->
<!--                <div class="ele-text-heading">-->
<!--                  <span style="padding-right: 12px">{{ form.companyName ? form.companyName : "-" }}</span>-->
<!--                </div>-->
<!--                <a @click="onEdit('主体名称', 'companyName', form.companyName)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
            <a-form-item label="主体类型">
              <a-space class="justify">
                <a-tag>{{ form.companyType }}</a-tag>
                <a @click="onEdit('主体类型', 'companyType', form.companyType)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="实名认证">
              <a-space class="justify">
                <a-tag v-if="form.authentication == 1" color="green">已认证</a-tag>
                <a-tag v-else color="orange" class="cursor-pointer" @click="openSpmUrl(`https://websoft.top/user/auth`)">未认证</a-tag>
              </a-space>
            </a-form-item>
            <a-form-item label="所属行业">
              <a-space class="justify">
                <span>{{ form.industryParent }}/{{ form.industryChild }}</span>
                <a @click="onEdit('行业类型', 'industryParent', form.industryParent)"
                >修改</a
                >
              </a-space>
            </a-form-item>
            <a-form-item label="用户数量">
              <a-space class="justify ele-text-heading">
                <span>{{ form.users }}/{{ form.members }}</span>
              </a-space>
            </a-form-item>
            <!--            <a-form-item label="部门数量">-->
            <!--              <a-space class="justify ele-text-heading">-->
            <!--                <span>{{ form.departments }}</span>-->
            <!--              </a-space>-->
            <!--            </a-form-item>-->
            <a-form-item label="存储空间">
              <a-space class="justify ele-text-heading">
                <span>{{ getFileSize(form.storage) }}/{{ getFileSize(form.storageMax) }}</span>
              </a-space>
            </a-form-item>
<!--            <a-form-item label="所属地区">-->
<!--              <a-space class="justify">-->
<!--                <span-->
<!--                >{{ form.province }}{{ form.city }}{{ form.region ? form.region : '-' }}</span-->
<!--                >-->
<!--                <a @click="onEdit('所属地区', 'city', form.city)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
<!--            <a-form-item label="企业地址">-->
<!--              <a-space class="justify">-->
<!--                <span>{{ form.address ? form.address : '-' }}</span>-->
<!--                <a @click="onEdit('企业地址', 'address', form.address)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
            <!--            <a-form-item label="企业域名">-->
            <!--              <a-space class="justify ele-text-heading">-->
            <!--                <span>{{ form.domain ? form.domain : '-' }}</span>-->
            <!--                <a @click="onEdit('企业域名', 'domain', form.domain)">修改</a>-->
            <!--              </a-space>-->
            <!--            </a-form-item>-->
            <!--            <a-form-item label="联系电话">-->
            <!--              <a-space class="justify ele-text-heading">-->
            <!--                <span>{{ form.phone }}</span>-->
            <!--              </a-space>-->
            <!--            </a-form-item>-->
            <!--            <a-form-item label="电子邮箱">-->
            <!--              <a-space class="justify ele-text-heading">-->
            <!--                <span>{{ form.email }}</span>-->
            <!--              </a-space>-->
            <!--            </a-form-item>-->
            <a-divider style="padding-bottom: 20px" />
<!--            <a-form-item label="应用类型">-->
<!--              <a-space class="justify">-->
<!--                <a-tag>{{ form.appType }}</a-tag>-->
<!--                <a @click="onEdit('应用类型', 'appType', form.appType)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
<!--            <a-form-item label="专属域名">-->
<!--              <a-space class="justify">-->
<!--                <span class="cursor-pointer" @click="openSpmUrl(`https://${form.domain}`)">{{ `${form.domain}` }}</span>-->
<!--                <a @click="onEdit('专属域名', 'domain', form.domain)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
<!--            <a-form-item label="当前版本">-->
<!--              <a-space class="justify ele-text-heading">-->
<!--                {{ form.versionName }}-->
<!--                <a @click="openUrl('/system/version')">更新</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
<!--            <a-divider style="padding-bottom: 20px" />-->
            <a-form-item
              v-if="form.tenantId"
              label="注销"
            >
              <a-button @click="destruction(form.tenantId)" :disabled="true">注销</a-button>
              <div class="ele-text-placeholder">注销后，当前应用的数据将会销毁,且不可恢复，请谨慎操作</div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <Field
      v-model:visible="showEdit"
      :data="form"
      :title="title"
      :field="field"
      :content="content"
      @done="query"
    />
    <Version
      v-model:visible="showVersionForm"
      :data="form"
      title="升级套餐"
      :field="field"
      :content="content"
      @done="query"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, createVNode } from "vue";
import { Form, message, Modal } from "ant-design-vue";
import { useUserStore } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store/modules/theme";
import { getCompany, updateCompany, destructionTenant } from "@/api/system/company";
import Field from "./components/field.vue";
import Version from "./components/version.vue";
import { assignObject } from "ele-admin-pro";
import { getFileSize, openSpmUrl, openUrl } from "@/utils/common";
import { Company } from "@/api/system/company/model";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { logout } from "@/utils/page-tab-util";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { FileRecord } from "@/api/system/file/model";
import { uuid } from 'ele-admin-pro';


const useForm = Form.useForm;

// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
const userStore = useUserStore();
// tab 页选中
const active = ref("info");
// 是否显示裁剪弹窗
const logo = ref<any>([]);
const field = ref("");
const title = ref("");
// 是否显示编辑弹窗
const showEdit = ref(false);
const content = ref("请输入要修改的内容");
const showVersionForm = ref(false);
// 登录用户信息
const loginUser = computed(() => userStore.info ?? {});

// 表单数据
const form = reactive<Company>({
  companyId: undefined,
  shortName: "",
  companyName: "",
  companyType: undefined,
  companyLogo: "",
  domain: "",
  freeDomain: undefined,
  phone: "",
  email: "",
  invoiceHeader: "",
  startTime: "",
  expirationTime: "",
  appType: undefined,
  planId: 0,
  businessEntity: "",
  version: undefined,
  versionName: "",
  versionCode: "",
  members: undefined,
  storage: undefined,
  storageMax: undefined,
  users: undefined,
  departments: undefined,
  country: "",
  province: "",
  city: "",
  region: "",
  address: "",
  comments: "",
  authentication: undefined,
  industryParent: undefined,
  industryChild: undefined,
  status: undefined,
  userId: undefined,
  tenantId: undefined,
  adminUrl: '',
  websiteUrl: '',
  requestUrl: "",
  socketUrl: "",
  serverUrl: "",
  modulesUrl: "",
  createTime: "",
  updateTime: ""
});
// 省市区
// const city = ref<string[]>([
//   String(loginUser.value.province),
//   String(loginUser.value.city),
//   String(loginUser.value.region)
// ]);

// 省市区
// const industry = ref<string[]>([
//   String(loginUser.value.province),
//   String(loginUser.value.city),
//   String(loginUser.value.region)
// ]);

// 表单验证规则
const rules = reactive({
  username: [
    {
      required: true,
      message: "请输入昵称",
      type: "string"
    }
  ],
  phone: [
    {
      required: true,
      message: "请输入昵称",
      type: "string"
    }
  ],
  nickname: [
    {
      required: true,
      message: "请输入昵称",
      type: "string"
    }
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      type: "string"
    }
  ]
});

const onEdit = (label, name, text) => {
  title.value = label;
  field.value = name;
  content.value = text;
  showEdit.value = true;
};

const chooseFile = (data: FileRecord) => {
  logo.value.push({
    uid: data.id,
    url: data.thumbnail,
    status: "done"
  });
  form.companyLogo = data.path;
  updateCompany(form).then(() => {
    message.success("上传成功");
  });
};

const onDeleteItem = (index: number) => {
  logo.value.splice(index, 1);
  form.companyLogo = "";
};

const onUpload = (d: ItemType) => {
  const file = d.file;
  if (file) {
    if (file.size / 1024 > 100) {
      message.error("大小不能超过 100k");
      return;
    }
  }
  uploadFile(<File>d.file)
    .then((result) => {
      form.companyLogo = result.url;
      updateCompany(form).then(res => {
        message.success("上传成功");
      });

    })
    .catch((e) => {
      message.error(e.message);
    });
};

/**
 * 升级套餐
 */
const updateVersion = (version: any) => {
  if(version === 30){
    return ;
  }
  if(version === 20){
    showVersionForm.value = true;
  }
  if(version === 10){
    showVersionForm.value = true;
  }
};

const destruction = (tenantId) => {
  Modal.confirm({
    title: "确定要销毁吗?",
    content: "销毁后，当前租户的相关数据将永久删除,且不可恢复，请谨慎操作！",
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = message.loading("正在销毁相关数据请等待...", 0);
      setTimeout(() => {
        destructionTenant(tenantId).then(() => {
          logout();
        });
      }, 5000);

    }
  });

};

const query = () => {
  logo.value = [];
  getCompany().then((response) => {
    if (response.companyLogo) {
      logo.value.push({
        uid: `${uuid()}`,
        url: response.companyLogo,
        status: "done"
      });
    }
    assignObject(form, response);
  });
};

query();
</script>

<script lang="ts">
export default {
  name: "SystemProfile"
};
</script>
<style>
.justify {
  display: flex !important;
  justify-content: space-between;
}
.cursor-pointer{
  cursor: pointer;
}
</style>
