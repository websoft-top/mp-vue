<template>
  <div class="ele-body ele-body-card">
    <a-card
      :bordered="false"
      :body-style="{ paddingTop: '0px', minHeight: '800px' }"
    >
      <a-tabs v-model:active-key="active" size="large">
        <a-tab-pane tab="网站设置" key="info">
          <a-form
            :label-col="
              styleResponsive
                ? { lg: 3, md: 6, sm: 4, xs: 24 }
                : { flex: '100px' }
            "
            :wrapper-col="styleResponsive ? { offset: 1 } : { offset: 1 }"
            style="margin-top: 20px"
          >
            <a-form-item labelAlign="right" label="网站Logo" extra="浅色模式/深浅模式">
              <a-space>
                <SelectFile
                  :placeholder="`请选择图片`"
                  :limit="1"
                  :data="logo"
                  @done="chooseFile"
                  @del="onDeleteItem"
                />
<!--                <ele-image-upload-->
<!--                  v-model:value="logo"-->
<!--                  :accept="'image/*'"-->
<!--                  :item-style="{ minWidth: '98px', minHeight: '98px', width: 'auto' }"-->
<!--                  :limit="1"-->
<!--                  @upload="onUpload"-->
<!--                />-->
<!--                <ele-image-upload-->
<!--                  v-model:value="darkLogo"-->
<!--                  :accept="'image/*'"-->
<!--                  :item-style="{ minWidth: '98px', minHeight: '98px', width: 'auto' }"-->
<!--                  :limit="1"-->
<!--                  @upload="onUpload2"-->
<!--                />-->
              </a-space>
            </a-form-item>
            <a-form-item label="网站名称">
              <a-space class="justify">
                <span>{{ form.websiteName }}</span>
                <a @click="onEdit('网站名称', 'websiteName', form.websiteName)"
                  >修改</a
                >
              </a-space>
            </a-form-item>
            <a-form-item label="Keywords">
              <a-space class="justify">
                <div style="max-width: 600px">{{ form.keywords ? form.keywords : '-' }}</div>
                <a @click="onEdit('网站关键词', 'keywords', form.keywords)"
                >修改</a
                >
              </a-space>
            </a-form-item>
            <a-form-item label="Description">
              <a-space class="justify">
                <div style="max-width: 600px">{{ form.comments ? form.comments : '-' }}</div>
                <a @click="onEdit('网站描述', 'comments', form.comments)"
                >修改</a
                >
              </a-space>
            </a-form-item>
<!--            <a-form-item label="应用类型">-->
<!--              <a-space class="justify">-->
<!--                <a-tag>{{ form.websiteType }}</a-tag>-->
<!--                <a @click="onEdit('主体类型', 'websiteType', form.websiteType)">修改</a>-->
<!--              </a-space>-->
<!--            </a-form-item>-->
            <a-form-item label="网站域名">
              <a-space class="justify">
                <a @click="openPreview(`${form.domain}`)">{{ form.domain }}</a>
                <a @click="onEdit('网站域名', 'domain', form.domain)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="模板ID">
              <a-space class="justify">
                <span>{{ form.templateId }}000</span>
                <a @click="onEdit('模板ID', 'templateId', form.templateId)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="网站状态">
              <a-tag v-if="form.status == 0" color="green">运行中</a-tag>
              <a-tag v-if="form.status == 1" color="orange">开发中</a-tag>
              <a-tag v-if="form.status == 2" color="error">维护中</a-tag>
              <a-tag v-if="form.status == 3" color="error">已欠费</a-tag>
            </a-form-item>
            <a-divider style="padding-bottom: 20px" />
            <a-form-item label="公司地址">
              <a-space class="justify">
                <span>{{ form.address ? form.address : '-' }}</span>
                <a @click="onEdit('企业地址', 'address', form.address)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="联系电话">
              <a-space class="justify">
                <span>{{ form.phone ? form.phone : '-' }}</span>
                <a @click="onEdit('联系电话', 'phone', form.phone)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="电子邮箱">
              <a-space class="justify">
                <span>{{ form.email ? form.email : '-' }}</span>
                <a @click="onEdit('电子邮箱', 'email', form.email)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="ICP备案号">
              <a-space class="justify">
                <span>{{ form.icpNo ? form.icpNo : '-' }}</span>
                <a @click="onEdit('ICP备案号', 'icpNo', form.icpNo)">修改</a>
              </a-space>
            </a-form-item>
            <a-form-item label="公安备案">
              <a-space class="justify">
                <span>{{ form.policeNo ? form.policeNo : '-' }}</span>
                <a @click="onEdit('公安备案', 'policeNo', form.policeNo)">修改</a>
              </a-space>
            </a-form-item>
<!--            <a-divider style="padding-bottom: 20px" />-->
<!--            <template v-for="(item,index) in form.fields" :key="index">-->
<!--              <a-form-item :label="item.name">-->
<!--                {{ item.comments }}-->
<!--              </a-form-item>-->
<!--            </template>-->
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
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed} from 'vue';
  import {Form, message} from "ant-design-vue";
  import { useUserStore } from '@/store/modules/user';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
import {removeSiteInfoCache, updateCmsWebsite} from "@/api/cms/cmsWebsite";
  import Field from './components/field.vue';
  import WebsiteFieldForm from './components/website-field.vue';
  import { Website } from '@/api/cms/website/model';
  import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
  import { uploadFile } from "@/api/system/file";
  import useFormData from "@/utils/use-form-data";
import {
  getDomain,
  getDomainPart1,
  getOriginDomain,
  getProductCode,
  getRootDomain,
  getSubDomainPath,
  navSubDomain
} from "@/utils/domain";
import {openNew, openPreview} from "@/utils/common";
import {FileRecord} from "@/api/system/file/model";
import {getSiteInfo} from "@/api/layout";


  const useForm = Form.useForm;

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const userStore = useUserStore();
  // 当前开发环境
  const env = import.meta.env.MODE;
  // tab 页选中
  const active = ref('info');
  // 保存按钮 loading
  const loading = ref(false);
  // 是否显示裁剪弹窗
  const visible = ref(false);
  const logo = ref<any>([]);
  const darkLogo = ref<any>([]);
  const field = ref('');
  const title = ref('');
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  const content = ref('请输入要修改的内容');
  const markdown = ref('请输入网站介绍');
  const showMarkdown = ref(false);
  // 登录用户信息
  const loginUser = computed(() => userStore.info ?? {});

  // 表单数据
  const { form,assignFields } = useFormData<Website>({
    websiteId: undefined,
    websiteName: '',
    websiteType: undefined,
    websiteLogo: '',
    websiteDarkLogo: '',
    keywords: '',
    domain: '',
    phone: '',
    email: '',
    address: '',
    expirationTime: '',
    templateId: '',
    country: '',
    province: '',
    city: '',
    region: '',
    comments: '',
    industryParent: undefined,
    industryChild: undefined,
    icpNo: '',
    policeNo: '',
    status: 0,
    fields: undefined,
    tenantId: undefined,
    createTime: ''
  });

  // 表单验证规则
  const rules = reactive({
    username: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    phone: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    nickname: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        type: 'string'
      }
    ]
  });

  const onEdit = (label, name, text) => {
    title.value = label;
    field.value = name;
    content.value = text;
    showEdit.value = true;
  };

  const onUpload = (d: ItemType) => {
    const file = d.file;
    if(file){
      if (file.size / 1024 > 200) {
        message.error('大小不能超过200k');
        return;
      }
    }
    uploadFile(<File>d.file)
      .then((result) => {
        form.websiteLogo = result.url;
        updateCmsWebsite(form).then(res => {
          // 清除缓存
          removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
          message.success('上传成功');
        })

      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  const onUpload2 = (d: ItemType) => {
    const file = d.file;
    if(file){
      if (file.size / 1024 > 200) {
        message.error('大小不能超过 200k');
        return;
      }
    }
    uploadFile(<File>d.file)
      .then((result) => {
        form.websiteDarkLogo = result.url;
        updateCmsWebsite(form).then(res => {
          // 清除缓存
          removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
          message.success('上传成功');
        })

      })
      .catch((e) => {
        message.error(e.message);
      });
  };

const chooseFile = (data: FileRecord) => {
  logo.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.websiteLogo = data.path;
  updateCmsWebsite(form).then(res => {
    // 清除缓存
    removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
    message.success('上传成功');
  })
}

const onDeleteItem = (index: number) => {
  logo.value.splice(index,1)
  form.websiteLogo = '';
}

  const query = () => {
    logo.value = [];
    getSiteInfo().then(data => {
      assignFields(data)
      logo.value.push({
        uid: 1,
        url: data.websiteLogo,
        status: 'done'
      });
      darkLogo.value.push({
        uid: 1,
        url: data.websiteDarkLogo,
        status: 'done'
      })
    })
  };

  query();
</script>

<script lang="ts">
  export default {
    name: 'CmsWebsite'
  };
</script>
<style>
  .justify{
    display: flex !important;
    justify-content: space-between;
  }
</style>
