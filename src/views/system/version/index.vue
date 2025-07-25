<template>
  <div class="ele-body ele-body-card">
    <a-card
      title="软件更新"
      :bordered="false"
      :body-style="{ paddingTop: '0px', minHeight: '800px' }"
    >
      <template v-if="company.tenantId == 5" #extra>
        <a @click="openEdit()">上传</a>
      </template>
      <a-form
        :label-col="
              styleResponsive
                ? { lg: 3, md: 6, sm: 4, xs: 24 }
                : { flex: '100px' }
            "
        :wrapper-col="styleResponsive ? { offset: 1 } : { offset: 1 }"
        style="margin-top: 20px"
      >
        <a-form-item label="当前版本">
          <a-space class="justify">
            <a-statistic :value="versionName ? versionName : company.versionName" />
          </a-space>
        </a-form-item>
        <a-form-item label="立即更新">
          <div class="ele-text-secondary" v-if="versionName == company.versionName">已是最新版本</div>
          <a-button type="primary" v-else @click="update">立即更新</a-button>
        </a-form-item>
        <a-divider style="padding-bottom: 20px" />
        <a-form-item label="更新日志">
          <a-timeline>
            <a-timeline-item v-for="(item,index) in list" :key="index" :color="index == 0 ? 'blue' : 'gray'">
              <div class="version-name">
                <span class="title ele-text-heading">{{ item.versionName }}</span>
                <span class="time ele-text-placeholder">{{ toDateString(item.createTime, "YYYY-MM-dd") }}</span>
                <a-space :size="12">
                  <template v-if="hasRole('superAdmin') || hasRole('admin')">
                    <a @click="download(item)">下载</a>
                  </template>
                  <template v-if="company.tenantId == 5 && (hasRole('superAdmin') || hasRole('admin'))">
                    <a-divider type="vertical" />
                    <a @click="openEdit(item)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm
                      placement="topRight"
                      title="确定要删除此版本吗？"
                      @confirm="remove(item)"
                    >
                      <a class="ele-text-danger">删除</a>
                    </a-popconfirm>
                  </template>
                </a-space>
              </div>
              <a-typography-text>
                <div class="update-info ele-text-secondary" v-html="item.updateInfo"></div>
<!--                <byte-md-viewer v-if="item" :value="item.updateInfo" :plugins="plugins" />-->
              </a-typography-text>
            </a-timeline-item>
          </a-timeline>
        </a-form-item>
      </a-form>
    </a-card>
    <versionEdit v-model:visible="showEdit" :data="current" @done="query" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store/modules/theme";
import { getCompany, updateCompany } from "@/api/system/company";
import { assignObject, toDateString } from "ele-admin-pro";
import { Company } from "@/api/system/company/model";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { useTenantStore } from "@/store/modules/tenant";
import { listVersion, removeVersion } from "@/api/system/version";
import { Version } from "@/api/system/version/model";
import versionEdit from "./components/version-edit.vue";
import { messageLoading } from "ele-admin-pro/es";
import { openNew } from "@/utils/common";
import { onClone } from "@/utils/plug-uitl";
import { hasRole } from "@/utils/permission";
// 中文语言文件
import zh_Hans from "bytemd/locales/zh_Hans.json";
import zh_HansGfm from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import highlight from "@bytemd/plugin-highlight";
import gfm from "@bytemd/plugin-gfm";
import { uploadOss } from "@/api/system/file";

// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
const tenantStore = useTenantStore();
// tab 页选中
const active = ref("info");
// 保存按钮 loading
const loading = ref(false);
// 是否显示裁剪弹窗
const visible = ref(false);
const title = ref("");
// 是否显示编辑弹窗
const showEdit = ref(false);
// 当前编辑数据
const current = ref<Version | null>(null);
const list = ref<Version[]>([]);
// 当前版本
const versionName = ref<string>("");
// 登录用户信息
const company = computed(() => tenantStore.company ?? {});

// 表单数据
const form = reactive<Company>({
  companyId: undefined,
  shortName: "",
  companyName: "",
  companyType: undefined,
  companyLogo: "",
  domain: "",
  version: undefined,
  versionName: "",
  versionCode: "",
  createTime: "",
  updateTime: ""
});

// 插件
const plugins = ref([
  gfm({
    locale: zh_HansGfm
  }),
  highlight()
]);

const download = (row?: Version) => {
  if (row?.vueDownloadUrl) {
    openNew(row?.vueDownloadUrl);
  }
};

/* 打开编辑弹窗 */
const openEdit = (row?: Version) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 删除单个 */
const remove = (row: Version) => {
  const hide = messageLoading("请求中..", 0);
  removeVersion(row.id)
    .then((msg) => {
      hide();
      message.success(msg);
      query();
    })
    .catch((e) => {
      hide();
      message.error(e.message);
    });
};

const update = () => {
  company.value.tenantId = 5;
  company.value.tenantName = "最新版本";
  onClone(company.value);
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

const query = () => {
  listVersion({}).then(data => {
    if (data) {
      list.value = data;
      list.value.map((d, i) => {
        const tenantId = localStorage.getItem("TenantId");
        if (i == 0) {
          versionName.value = `${d.versionName}`;
        }
      });
    }
  });
  getCompany().then((response) => {
    assignObject(form, response);
  });
};

query();
</script>

<script lang="ts">
export default {
  name: "SystemVersion"
};
</script>
<style>
.justify {
  display: flex !important;
  justify-content: space-between;
}

.update-info {
  max-width: 600px;
}

.version-name {
  .ele-text-heading {
    font-weight: bold;
    font-size: 16px;
    margin-right: 10px;
  }

  margin-bottom: 10px;

  .time {
    margin-right: 20px;
  }
}
</style>
