<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑车辆' : '添加车辆'"
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
      <a-form-item label="车辆图片" name="image" v-if="isUpdate">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="5"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="所属站点" name="organizationId">
        <org-select
          :data="organizations"
          placeholder="请选择所属机构"
          v-model:value="form.organizationId"
          @change="onOrganization"
        />
      </a-form-item>
      <a-form-item label="保险状态" name="insuranceStatus">
        <DictSelect
          dict-code="InsuranceStatus"
          :placeholder="`保险状态`"
          style="width: 200px"
          v-model:value="form.insuranceStatus"
          @done="chooseInsuranceStatus"
        />
      </a-form-item>
      <a-form-item label="电子围栏" name="fenceName">
        <SelectFence
          :placeholder="`选择电子围栏`"
          v-model:value="form.fenceName"
          @done="updateFence"
        />
      </a-form-item>
      <a-form-item label="GPS设备编号" name="gpsNo" v-if="isUpdate">
        <a-input
          allow-clear
          placeholder="请输入GPS设备编号"
          v-model:value="form.gpsNo"
        />
      </a-form-item>
      <a-form-item label="定位" name="location" v-if="isUpdate">
        <div class="flex">
          <a-input
            allow-clear
            placeholder="请选取车辆所在位置"
            v-model:value="form.location"
          />
          <a-button
            class="ele-btn-icon"
            style="margin-left: 10px; width: 137px"
            @click="openMapPicker"
          >
            <AimOutlined />选取
          </a-button>
        </div>
      </a-form-item>
      <a-form-item label="操作员" name="driver" v-if="isUpdate">
        {{ form.driver }} {{ form.driverPhone }}
        <!--        <a-select placeholder="选择绑定的操作员" :options="users" v-model:value="form.driver" @change="chooseDriverId" />-->
      </a-form-item>
      <a-form-item label="接收提醒" name="toUser">
        <a-input
          allow-clear
          placeholder="请输入openId"
          v-model:value="form.toUser"
        />
      </a-form-item>
      <a-form-item label="排序" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="安装状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">未安装</a-radio>
          <a-radio :value="1">已安装</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
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
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addHjmCar, updateHjmCar } from '@/api/hjm/hjmCar';
  import { HjmCar } from '@/api/hjm/hjmCar/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';
  import { AimOutlined } from '@ant-design/icons-vue';
  import { CenterPoint } from 'ele-admin-pro/es/ele-map-picker/types';
  import OrgSelect from '@/views/system/user/components/org-select.vue';
  import { Organization } from '@/api/system/organization/model';
  import { User } from '@/api/system/user/model';
  import { pageUsers } from '@/api/system/user';
  import { listOrganizations } from '@/api/system/organization';
  import { toTreeData } from 'ele-admin-pro/es';
  import { DictData } from '@/api/system/dict-data/model';
  import { HjmFence } from '@/api/hjm/hjmFence/model';

  // 是否是修改
  const isUpdate = ref(false);
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const { darkMode } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: HjmCar | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 提交状态
  const loading = ref(false);
  // 是否显示最大化切换按钮
  const maxable = ref(true);
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const images = ref<ItemType[]>([]);
  // 是否显示地图选择弹窗
  const showMap = ref(false);
  const users = ref<User[]>([]);
  const organizationId = ref<number>();
  const organizations = ref<Organization[]>([]);

  // 用户信息
  const form = reactive<HjmCar>({
    id: undefined,
    name: undefined,
    image: undefined,
    type: undefined,
    kuaidi: undefined,
    kuaidiAdmin: undefined,
    code: undefined,
    driverId: undefined,
    driver: undefined,
    driverPhone: undefined,
    insuranceStatus: undefined,
    gpsNo: undefined,
    fenceId: undefined,
    fenceName: undefined,
    fence: undefined,
    location: undefined,
    longitude: undefined,
    latitude: undefined,
    district: undefined,
    address: undefined,
    organizationId: undefined,
    organizationParentId: undefined,
    userId: undefined,
    toUser: undefined,
    comments: undefined,
    status: 0,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    organizationId: [
      {
        required: true,
        type: 'number',
        message: '请选择车辆所属站点',
        trigger: 'blur'
      }
    ],
    code: [
      {
        required: true,
        type: 'string',
        message: '请填写车辆编号',
        trigger: 'blur'
      }
    ],
    fenceName: [
      {
        required: true,
        type: 'string',
        message: '请选择电子围栏',
        trigger: 'blur'
      }
    ],
    insuranceStatus: [
      {
        required: true,
        type: 'string',
        message: '请选择保险状态',
        trigger: 'blur'
      }
    ],
    sortNumber: [
      {
        required: true,
        type: 'number',
        message: '请填写排序号',
        trigger: 'blur'
      }
    ]
    // driver: [
    //   {
    //     required: true,
    //     type: 'any',
    //     message: '请绑定操作员',
    //     trigger: 'blur'
    //   }
    // ]
  });

  const chooseInsuranceStatus = (item: DictData) => {
    form.insuranceStatus = item.dictDataCode;
  };

  const updateFence = (item: HjmFence) => {
    form.fenceName = item.name;
    form.fenceId = item.id;
  };

  /* 打开位置选择 */
  const openMapPicker = () => {
    showMap.value = true;
  };

  /* 地图选择后回调 */
  const onDone = (location: CenterPoint) => {
    if (location) {
      console.log(location);
      form.location = `${location.lat},${location.lng}`;
      form.longitude = `${location.lng}`;
      form.latitude = `${location.lat}`;
      form.address = `${location.address}`;
      form.district = `${location.city?.district}`;
    }
    showMap.value = false;
  };

  const onOrganization = (index: number) => {
    form.driver = undefined;
    users.value = [];
    organizations.value?.map((item) => {
      if (
        item.children?.map((d) => {
          const find = organizations.value?.find(
            (i) => i.organizationId == d.parentId
          );
          if (find) {
            if (d.value == index) {
              form.code = `${find.organizationCode}`;
              form.organizationParentId = find.organizationId;
              form.organizationId = d.organizationId;
              organizationId.value = find.organizationId;
              getUsers();
            }
          }
        })
      )
        if (index == item.value) {
          form.kuaidi = item.organizationName;
        }
    });
  };

  const getUsers = () => {
    pageUsers({ organizationId: organizationId.value }).then((res) => {
      users.value =
        res?.list.map((d) => {
          d.label = d.realName || d.nickname;
          d.value = d.userId;
          return d;
        }) || [];
    });
  };

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
  };

  const { resetFields } = useForm(form, rules);

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
          image: JSON.stringify(images.value)
        };
        const saveOrUpdate = isUpdate.value ? updateHjmCar : addHjmCar;
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
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        images.value = [];
        // 加载机构
        listOrganizations()
          .then((list) => {
            loading.value = false;
            list.forEach((d) => {
              d.key = d.organizationId;
              d.value = d.organizationId;
              d.title = d.organizationName;
            });
            organizations.value = toTreeData({
              data: list,
              idField: 'organizationId',
              parentIdField: 'parentId'
            });
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
        if (props.data) {
          assignObject(form, props.data);
          if (props.data.image) {
            const arr = JSON.parse(props.data.image);
            arr.map((item) => {
              images.value.push({
                uid: uuid(),
                url: item.url,
                status: 'done'
              });
            });
          }
          if (props.data.organizationParentId) {
            organizationId.value = props.data.organizationParentId;
            getUsers();
          }
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
