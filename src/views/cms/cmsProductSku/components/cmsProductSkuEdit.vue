<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑商品sku列表' : '添加商品sku列表'"
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
      <a-form-item label="商品ID" name="goodsId">
        <a-input
          allow-clear
          placeholder="请输入商品ID"
          v-model:value="form.goodsId"
        />
      </a-form-item>
      <a-form-item label="商品属性索引值 (attr_value|attr_value[|....])" name="sku">
        <a-input
          allow-clear
          placeholder="请输入商品属性索引值 (attr_value|attr_value[|....])"
          v-model:value="form.sku"
        />
      </a-form-item>
        <a-form-item
          label="商品图片"
          name="image">
          <SelectFile
            :placeholder="`请选择图片`"
            :limit="1"
            :data="images"
            @done="chooseImage"
            @del="onDeleteItem"
          />
        </a-form-item>
      <a-form-item label="商品价格" name="price">
        <a-input
          allow-clear
          placeholder="请输入商品价格"
          v-model:value="form.price"
        />
      </a-form-item>
      <a-form-item label="市场价格" name="salePrice">
        <a-input
          allow-clear
          placeholder="请输入市场价格"
          v-model:value="form.salePrice"
        />
      </a-form-item>
      <a-form-item label="成本价" name="cost">
        <a-input
          allow-clear
          placeholder="请输入成本价"
          v-model:value="form.cost"
        />
      </a-form-item>
      <a-form-item label="库存" name="stock">
        <a-input
          allow-clear
          placeholder="请输入库存"
          v-model:value="form.stock"
        />
      </a-form-item>
      <a-form-item label="sku编码" name="skuNo">
        <a-input
          allow-clear
          placeholder="请输入sku编码"
          v-model:value="form.skuNo"
        />
      </a-form-item>
      <a-form-item label="商品条码" name="barCode">
        <a-input
          allow-clear
          placeholder="请输入商品条码"
          v-model:value="form.barCode"
        />
      </a-form-item>
      <a-form-item label="重量" name="weight">
        <a-input
          allow-clear
          placeholder="请输入重量"
          v-model:value="form.weight"
        />
      </a-form-item>
      <a-form-item label="体积" name="volume">
        <a-input
          allow-clear
          placeholder="请输入体积"
          v-model:value="form.volume"
        />
      </a-form-item>
      <a-form-item label="唯一值" name="uuid">
        <a-input
          allow-clear
          placeholder="请输入唯一值"
          v-model:value="form.uuid"
        />
      </a-form-item>
      <a-form-item label="状态, 0正常, 1异常" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsProductSku, updateCmsProductSku } from '@/api/cms/cmsProductSku';
  import { CmsProductSku } from '@/api/cms/cmsProductSku/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';

  // 是否是修改
  const isUpdate = ref(false);
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: CmsProductSku | null;
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

  // 用户信息
  const form = reactive<CmsProductSku>({
    id: undefined,
    goodsId: undefined,
    sku: undefined,
    image: undefined,
    price: undefined,
    salePrice: undefined,
    cost: undefined,
    stock: undefined,
    skuNo: undefined,
    barCode: undefined,
    weight: undefined,
    volume: undefined,
    uuid: undefined,
    status: undefined,
    comments: undefined,
    tenantId: undefined,
    createTime: undefined,
    cmsProductSkuId: undefined,
    cmsProductSkuName: '',
    status: 0,
    comments: '',
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsProductSkuName: [
      {
        required: true,
        type: 'string',
        message: '请填写商品sku列表名称',
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
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateCmsProductSku : addCmsProductSku;
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
        if (props.data) {
          assignObject(form, props.data);
          if(props.data.image){
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
            })
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
