<!-- 编辑弹窗 -->
<template>
  <a-drawer
    width="70%"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑商品' : '添加商品'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <template #extra>
      <a-button type="primary" style="margin-right: 8px" @click="save">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 24, sm: 24, xs: 24 } : { flex: '1' }
      "
    >
      <a-tabs type="card" v-model:active-key="active" @change="onChange">
        <a-tab-pane tab="基本信息" key="base">
          <a-form-item label="商品名称" name="name">
            <a-input
              allow-clear
              style="width: 558px"
              placeholder="请输入商品名称"
              v-model:value="form.name"
            />
          </a-form-item>
          <a-form-item label="所属栏目" name="categoryId">
            <a-tree-select
              allow-clear
              :tree-data="navigationList"
              tree-default-expand-all
              style="width: 320px"
              placeholder="请选择栏目"
              :value="form.categoryId || undefined"
              :listHeight="700"
              :dropdown-style="{ overflow: 'auto' }"
              @update:value="(value?: number) => (form.categoryId = value)"
              @change="onCategoryId"
            />
          </a-form-item>
          <a-form-item label="商品卖点" name="comments">
            <a-textarea
              :rows="1"
              :maxlength="100"
              style="width: 558px"
              show-count
              placeholder="此款商品美观大方 性价比较高 不容错过"
              v-model:value="form.comments"
            />
          </a-form-item>
          <a-form-item label="单位名称" name="unitName">
            <a-input
              allow-clear
              style="width: 240px"
              placeholder="单位名称，如(个)"
              v-model:value="form.unitName"
            />
          </a-form-item>
          <a-form-item label="商品价格" name="price">
            <a-space>
              <a-input-number
                :placeholder="`商品价格`"
                style="width: 240px"
                :min="0.01"
                v-model:value="form.price"
              />
            </a-space>
          </a-form-item>
          <a-form-item label="团长价" name="originPrice">
            <a-input-number
              :placeholder="`团长价`"
              style="width: 240px"
              :min="0.01"
              v-model:value="form.dealerPrice"
            />
          </a-form-item>
          <a-form-item label="进货价" name="originPrice">
            <a-input-number
              :placeholder="`进货价`"
              style="width: 240px"
              :min="0.01"
              v-model:value="form.buyingPrice"
            />
          </a-form-item>
          <a-form-item label="运费模板" v-if="!merchantId">
            <a-select
              v-model:value="form.expressTemplateId"
              style="width: 240px"
            >
              <a-select-option
                v-for="(item, index) in expressTemplateList"
                :key="index"
                :value="item.id"
              >{{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="商品图片(400x400)" name="image">
            <!--            <SelectFile-->
            <!--              :placeholder="`请选择视频文件`"-->
            <!--              :limit="1"-->
            <!--              :data="images"-->
            <!--              @done="chooseImage"-->
            <!--              @del="onDeleteItem"-->
            <!--            />-->
            <a-image
              width="100px"
              height="100px"
              v-if="form.image"
              :src="form.image"
              style="margin-right: 10px"
            />
            <a-upload
              :show-upload-list="false"
              :customRequest="onUploadImage"
              ref="imageRef"
            >
              <a-button class="ele-btn-icon">
                <template #icon>
                  <UploadOutlined/>
                </template>
                <span>上传图标</span>
              </a-button>
            </a-upload>
            <div class="ele-text-placeholder">
              支持上传视频（mp4格式），视频时长不超过60秒，视频大小不超过200M。
            </div>
          </a-form-item>
          <a-form-item label="轮播图" name="files">
            <div class="flex flex-wrap justify-start items-start">
              <div
                v-for="(item, index) in files"
                :key="index"
                style="margin-right: 10px; margin-bottom: 10px"
                class="relative"
              >
                <img style="width: 100px; height: 100px" :src="item.url"/>
                <div
                  class="absolute right-0 top-0 w-6 h-6 bg-red-400 flex justify-center items-center rounded-bl-lg"
                  @click="onDeleteFile(index)"
                >
                  <delete-outlined style="color: white"/>
                </div>
              </div>
            </div>
            <a-upload
              :show-upload-list="false"
              :customRequest="onUploadSwiper"
              multiple
              :max-count="9"
              ref="swiperRef"
            >
              <a-button class="ele-btn-icon">
                <template #icon>
                  <UploadOutlined/>
                </template>
                <span>上传轮播图</span>
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="状态" name="isShow">
            <a-radio-group v-model:value="form.isShow">
              <a-radio :value="1">上架</a-radio>
              <a-radio :value="0">下架</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="商品规格" key="spec">
          <a-form-item label="规格类型" name="specs">
            <a-radio-group v-model:value="form.specs">
              <a-radio :value="0">单规格</a-radio>
              <a-radio :value="1">多规格</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="multipleSpec" v-if="form.specs == 1">
            <div class="w-[300px] ml-10">
              <SelectSpec
                placeholder="选择规格"
                :width="130"
                v-model:value="form.specName"
                @done="onSpec"
              />
            </div>
          </a-form-item>
          <a-form-item name="specValue" v-if="form.specs == 1">
            <a-space direction="vertical" class="ml-[40px]">
              <template v-for="(item, index) in spec" :key="index">
                <div
                  class="text-left flex items-center leading-10 text-gray-400"
                >
                  <div class="mr-2">{{ item.value }} :</div>
                  <CloseCircleOutlined
                    class="cursor-pointer"
                    @click="onClose(index)"
                  />
                </div>
                <ele-edit-tag
                  v-model:data="item.detail"
                  size="middle"
                  shape="round"
                />
              </template>
              <a-card class="ml-[40px]" v-if="showSpecForm">
                <a-form-item name="name">
                  <a-input
                    allow-clear
                    placeholder="请输入规格"
                    v-model:value="name"
                  />
                </a-form-item>
                <a-form-item name="value">
                  <a-input
                    allow-clear
                    placeholder="请输入规格值"
                    v-model:value="value"
                  />
                </a-form-item>
                <a-space>
                  <a-button type="primary" @click="addSpecValue">确定</a-button>
                  <a-button @click="openSpecForm">取消</a-button>
                </a-space>
              </a-card>
              <a-space v-if="spec.length > 0">
                <a-button type="primary" class="mt-5" @click="openSpecForm"
                >添加新规格
                </a-button>
                <a-button type="primary" class="mt-5" @click="generateSku"
                >生成SKU
                </a-button>
              </a-space>
            </a-space>
          </a-form-item>
          <a-form-item name="oneSpec" v-if="form.specs == 1">
            <div class="w-full">
              <div class="sku-table">
                <a-table
                  :pagination="false"
                  :dataSource="skuList"
                  :columns="columns"
                  :scroll="{ y: 500 }"
                >
                  <template #bodyCell="{ record, column, index }">
                    <template v-if="column.key === 'line'">
                      {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'image'">
                      <SelectFile
                        :placeholder="`请选择商品图片`"
                        :limit="1"
                        :data="record.images || []"
                        :index="index"
                        @done="chooseSkuImage"
                        @del="onDeleteSkuItem"
                      />
                    </template>
                    <template v-if="column.key === 'price'">
                      <a-input
                        :placeholder="`成本价`"
                        v-model:value="skuList[index].price"
                      />
                    </template>
                    <template v-if="column.key === 'salePrice'">
                      <a-input
                        :placeholder="`市场价`"
                        v-model:value="record.salePrice"
                      />
                    </template>
                    <template v-if="column.key === 'buyingPrice'">
                      <a-input
                        :placeholder="`会员店/总仓批发价`"
                        v-model:value="record.buyingPrice"
                      />
                    </template>
                    <template v-if="column.key === 'chainStorePrice'">
                      <a-input
                        :placeholder="`供应价`"
                        v-model:value="record.chainStorePrice"
                      />
                    </template>
                    <template v-if="column.key === 'memberStoreCommission'">
                      <a-input
                        :placeholder="`直推收益分配(元)`"
                        v-model:value="record.memberStoreCommission"
                      />
                    </template>
                    <template v-if="column.key === 'supplierCommission'">
                      <a-input
                        :placeholder="`仓储费(元)`"
                        v-model:value="record.supplierCommission"
                      />
                    </template>
                    <template v-if="column.key === 'stock'">
                      <a-input
                        :placeholder="`库存`"
                        v-model:value="record.stock"
                      />
                    </template>
                    <template v-if="column.key === 'skuNo'">
                      <a-input
                        :placeholder="`编码`"
                        v-model:value="record.skuNo"
                      />
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="商品详情" key="content">
          <!-- 富文本编辑器 -->
          <div v-if="editor == 1">
            <tinymce-editor
              ref="editorRef"
              class="editor-content"
              v-model:value="content"
              :disabled="disabled"
              :init="config"
              placeholder="支持直接粘贴或拖拽图片，也可点击工具栏图片按钮从文件库选择"
            />
            <div class="file-selector-tip">
              💡 提示：工具栏"图片"按钮从图片库选择，"上传"按钮快速上传图片；"视频"按钮从视频库选择，"上传视频"按钮快速上传视频；"一键排版"按钮自动优化文章格式；"首行缩进"按钮切换段落缩进
            </div>
          </div>

          <!-- Markdown编辑器 -->
          <div v-if="editor == 2">
            <!-- 📝 Markdown编辑器工具栏扩展 -->
            <div class="markdown-toolbar-extension">
              <a-button
                type="primary"
                size="small"
                @click="openMarkdownImageSelector"
                style="margin-right: 8px;"
              >
                📷 从图片库选择
              </a-button>
              <a-button
                type="default"
                size="small"
                @click="openMarkdownVideoSelector"
                style="margin-right: 8px;"
              >
                🎬 从视频库选择
              </a-button>
            </div>

            <MdEditor
              v-model="content"
              :disabled="disabled"
              height="500px"
              :placeholder="'请输入Markdown内容...'"
              :toolbars="markdownToolbars"
              :onUploadImg="onMarkdownUploadImg"
            />
            <div class="file-selector-tip">
              💡 提示：支持Markdown语法，可以使用工具栏按钮从文件库选择图片/视频，也可以直接拖拽上传文件
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="营销设置" key="coupon">
          <a-form-item label="商品重量" name="goodsWeight">
            <a-input
              allow-clear
              style="width: 250px"
              placeholder="请输入商品重量"
              v-model:value="form.goodsWeight"
            />
          </a-form-item>
          <a-form-item label="销量" name="sales">
            <a-input-number
              allow-clear
              style="width: 250px"
              placeholder="请输入销量"
              v-model:value="form.sales"
            />
          </a-form-item>
          <a-form-item label="库存" name="stock">
            <a-input-number
              allow-clear
              style="width: 250px"
              placeholder="请输入库存"
              v-model:value="form.stock"
            />
          </a-form-item>
          <a-form-item label="获取积分" name="gainIntegral">
            <a-input-number
              :placeholder="`消费获取的积分`"
              style="width: 250px"
              v-model:value="form.gainIntegral"
            />
          </a-form-item>
          <a-form-item label="库存计算方式" name="deductStockType">
            <a-radio-group v-model:value="form.deductStockType">
              <a-radio :value="20">付款减库存</a-radio>
              <a-radio :value="10">下单减库存</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="货架" name="position">
            <a-input
              allow-clear
              style="width: 250px"
              placeholder="请输入货架"
              v-model:value="form.position"
            />
          </a-form-item>
          <a-form-item label="是否可以快递配送">
            <a-switch
              size="small"
              v-model:checked="form.canExpress"
              :checked-value="1"
              :un-checked-value="0"
            />
          </a-form-item>
          <a-form-item label="是否新品">
            <a-switch
              size="small"
              v-model:checked="form.isNew"
              :checked-value="1"
              :un-checked-value="0"
            />
          </a-form-item>
          <a-form-item label="是否开启分红角色功能" v-if="!merchantId">
            <a-switch
              size="small"
              v-model:checked="form.commissionRole"
              :checked-value="1"
              :un-checked-value="0"
            />
          </a-form-item>
          <a-form-item label="角色分红配置" v-if="form.commissionRole === 1">
            <a-space>
              <a-input
                v-model:value="form.goodsRoleCommission[index].amount"
                v-for="(item, index) in form.goodsRoleCommission"
                :key="index"
              >
                <template #addonBefore>{{ item.roleName }}</template>
                <template #addonAfter>元</template>
              </a-input>
            </a-space>
          </a-form-item>
          <template v-if="form.type === 1 || merchantId">
            <a-form-item label="可用日期">
              <a-select v-model:value="canUseDate" mode="multiple">
                <a-select-option
                  v-for="(item, index) in dayList"
                  :key="index"
                  :value="index"
                >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="服务保障">
              <div>
                <a-space>
                  <a-tag
                    v-for="item in ensureTag"
                    :key="item"
                    closable
                    @close="onDeleteEnsureTag(item)"
                  >{{ item }}
                  </a-tag>
                  <a-input v-model:value="ensureTagItem"></a-input>
                  <a-button @click="addEnsureTag()" :disabled="!ensureTagItem"
                  >添加
                  </a-button
                  >
                </a-space>
              </div>
              <div class="mt-2">
                <a-space>
                  <span @click="addEnsureTag('免预约')">免预约</span>
                  <span @click="addEnsureTag('随时退')">随时退</span>
                  <span @click="addEnsureTag('过期自动退')">过期自动退</span>
                </a-space>
              </div>
            </a-form-item>
            <a-form-item label="有效期限">
              <a-input-number
                :min="0"
                :max="9999"
                style="width: 250px"
                placeholder="请输入有效期限"
                v-model:value="form.expiredDay"
              />
            </a-form-item>
          </template>
          <a-form-item label="排序号" name="sortNumber">
            <a-input-number
              :min="0"
              :max="9999"
              style="width: 250px"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"
            />
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-drawer>
  <!-- 文件库选择弹窗 -->
  <SelectData
    v-model:visible="showFileSelector"
    title="选择图片"
    type="image"
    class="file-selector-modal"
    @done="onFileSelected"
  />

  <!-- 视频库选择弹窗 -->
  <SelectData
    v-model:visible="showVideoSelector"
    title="选择视频"
    type="video"
    class="file-selector-modal"
    @done="onVideoSelected"
  />

</template>

<script lang="ts" setup>
import {
  CloseCircleOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, messageLoading, uuid} from 'ele-admin-pro';
import {addShopGoods, updateShopGoods} from '@/api/shop/shopGoods';
import {ShopGoods} from '@/api/shop/shopGoods/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance, RuleObject} from 'ant-design-vue/es/form';
import {FileRecord} from '@/api/system/file/model';
import {ShopMerchant} from '@/api/shop/shopMerchant/model';
import TinymceEditor from '@/components/TinymceEditor/index.vue';
import {uploadFile, uploadOss} from '@/api/system/file';
import {ShopSpecValue} from '@/api/shop/shopSpecValue/model';
import {ShopSpec} from '@/api/shop/shopSpec/model';
import {ShopGoodsSku} from '@/api/shop/shopGoodsSku/model';
import {ShopGoodsSpec} from '@/api/shop/shopGoodsSpec/model';
import {generateGoodsSku, listShopGoodsSku} from '@/api/shop/shopGoodsSku';
import {listShopGoodsSpec} from '@/api/shop/shopGoodsSpec';
import {ShopGoodsCategory} from '@/api/shop/shopGoodsCategory/model';
import {getMerchantId} from '@/utils/merchant';
import {ShopExpressTemplate} from '@/api/shop/shopExpressTemplate/model';
import {listShopExpressTemplate} from '@/api/shop/shopExpressTemplate';
import {listShopCommissionRole} from '@/api/shop/shopCommissionRole';
import {listShopGoodsRoleCommission} from '@/api/shop/shopGoodsRoleCommission';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import SelectData from "@/components/SelectFile/components/select-data.vue";

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: ShopGoods | null;
  // 栏目数据
  navigationList?: CmsNavigation[];
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
const content = ref('');
// 编辑器类型
const editor = ref<number>(1);
const disabled = ref(false);
// 当前选项卡
const active = ref('base');

const spec = ref<ShopSpecValue[]>([]);
const showSpecForm = ref(false);
const name = ref();
const value = ref();
const skuList = ref<ShopGoodsSku[]>([]);
const files = ref<ItemType[]>([]);
const goodsSpec = ref<ShopGoodsSpec>();
const category = ref<string[]>([]);
const takeaway = ref<ShopGoodsCategory[]>([]);
const merchantId = getMerchantId();

const columns = [
  {
    title: '图片',
    dataIndex: 'image',
    key: 'image',
    align: 'center'
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    align: 'center'
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    key: 'price',
    align: 'center'
  },
  {
    title: '进货价',
    dataIndex: 'buyingPrice',
    key: 'buyingPrice',
    align: 'center'
  },
  {
    title: '团长价',
    dataIndex: 'dealerPrice',
    key: 'dealerPrice',
    align: 'center'
  },
  {
    title: '直推收益分配(元)',
    dataIndex: 'memberStoreCommission',
    key: 'memberStoreCommission',
    align: 'center'
  },
  {
    title: '仓储费(元)',
    dataIndex: 'supplierCommission',
    key: 'supplierCommission',
    align: 'center'
  },
  {
    title: '商品编号',
    dataIndex: 'skuNo',
    key: 'skuNo',
    align: 'center'
  }
];

const dayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const canUseDate = ref([]);
const ensureTag = ref<string[]>([]);
const ensureTagItem = ref('');
const addEnsureTag = (item = '') => {
  const tag = item || ensureTagItem.value;
  if (ensureTag.value.findIndex((item) => item === tag) !== -1)
    return message.error('请勿重复添加');
  ensureTag.value.push(tag);
  ensureTagItem.value = '';
};

// 选择栏目
const onCategoryId = (id: number) => {
  form.categoryId = id;
  // 💾 在新增模式下，用户手动选择栏目时也保存到本地存储
  if (!isUpdate.value && id) {
    saveLastCategory(id);
  }
};

// �💾 保存和恢复栏目选择的功能
const LAST_CATEGORY_KEY = 'cms_article_last_category';

// 保存最后选择的栏目到本地存储
const saveLastCategory = (categoryId: number | undefined) => {
  if (categoryId) {
    localStorage.setItem(LAST_CATEGORY_KEY, categoryId.toString());
  }
};

// 从本地存储获取最后选择的栏目
const getLastCategory = (): number | undefined => {
  const saved = localStorage.getItem(LAST_CATEGORY_KEY);
  return saved ? parseInt(saved) : undefined;
};

const onDeleteEnsureTag = (tag: string) => {
  const index = ensureTag.value.findIndex((item) => item === tag);
  ensureTag.value.splice(index, 1);
};

// 从文件库选择图片的回调
const onFileSelected = (data: FileRecord) => {
  if (fileSelectCallback.value) {
    // 使用文件的完整URL，确保有值
    const imageUrl = data.url || data.path || '';
    if (imageUrl) {
      fileSelectCallback.value(imageUrl);
      message.success('图片插入成功');
    }
    fileSelectCallback.value = null;
  }
  showFileSelector.value = false;
};

// 从视频库选择视频的回调
const onVideoSelected = (data: FileRecord) => {
  if (videoSelectCallback.value) {
    // 使用文件的完整URL，确保有值
    const videoUrl = data.path || data.downloadUrl || '';
    if (videoUrl) {
      videoSelectCallback.value(videoUrl);
      message.success('视频插入成功');
    }
    videoSelectCallback.value = null;
  }
  showVideoSelector.value = false;
};

// 🎨 智能一键排版 - 人性化设计
const handleAutoFormat = (editor: any) => {
  try {
    // 1. 检查内容
    const content = editor.getContent();
    if (!content || content.trim() === '' || content === '<p><br></p>' || content === '<p></p>') {
      message.warning({
        content: '📝 请先输入一些内容，然后再使用一键排版功能',
        duration: 3
      });
      return;
    }

    // 2. 显示友好的加载提示
    const loadingMsg = message.loading({
      content: '✨ 正在为您的文章进行智能排版优化...',
      duration: 0
    });

    // 3. 延迟执行，让用户看到加载效果
    setTimeout(() => {
      try {
        const optimizedContent = smartFormatContent(content);
        editor.setContent(optimizedContent);

        loadingMsg();

        // 4. 显示成功提示
        message.success({
          content: '🎉 排版优化完成！您的文章现在看起来更专业了',
          duration: 4
        });

        // 5. 可选：显示优化统计
        showOptimizationStats(content, optimizedContent);

      } catch (error) {
        loadingMsg();
        console.error('排版优化失败:', error);
        message.error({
          content: '😅 排版优化遇到了问题，请检查文章内容后重试',
          duration: 4
        });
      }
    }, 800); // 给用户一个良好的反馈体验

  } catch (error) {
    console.error('一键排版功能错误:', error);
    message.error({
      content: '🔧 功能暂时不可用，请刷新页面后重试',
      duration: 4
    });
  }
};

// 📊 显示优化统计信息
const showOptimizationStats = (originalContent: string, optimizedContent: string) => {
  const stats = analyzeOptimization(originalContent, optimizedContent);

  if (stats.optimizations.length > 0) {
    message.info({
      content: `📈 本次优化: ${stats.optimizations.join('、')}`,
      duration: 6
    });
  }
};

// 🔍 分析优化效果
const analyzeOptimization = (original: string, optimized: string) => {
  const optimizations: string[] = [];

  // 检查各种优化项目
  if ((optimized.match(/<h[1-6][^>]*style/g) || []).length > (original.match(/<h[1-6][^>]*style/g) || []).length) {
    optimizations.push('标题样式');
  }

  if ((optimized.match(/<p[^>]*style/g) || []).length > (original.match(/<p[^>]*style/g) || []).length) {
    optimizations.push('段落格式');
  }

  if ((optimized.match(/<img[^>]*style/g) || []).length > (original.match(/<img[^>]*style/g) || []).length) {
    optimizations.push('图片布局');
  }

  if ((optimized.match(/<ul[^>]*style|<ol[^>]*style/g) || []).length > (original.match(/<ul[^>]*style|<ol[^>]*style/g) || []).length) {
    optimizations.push('列表格式');
  }

  return {optimizations};
};

// 🎨 智能排版核心函数 - 简单而强大
const smartFormatContent = (content: string): string => {
  let optimized = content;

  // 1. 🏷️ 标题优化 - 让标题更有层次感
  optimized = optimized.replace(/<h1([^>]*)>/g, '<h1$1 style="font-size: 28px; font-weight: 700; margin: 24px 0 16px 0; line-height: 1.3; color: #1a1a1a; border-bottom: 2px solid #e8e8e8; padding-bottom: 10px;">');
  optimized = optimized.replace(/<h2([^>]*)>/g, '<h2$1 style="font-size: 24px; font-weight: 600; margin: 20px 0 14px 0; line-height: 1.4; color: #2c2c2c;">');
  optimized = optimized.replace(/<h3([^>]*)>/g, '<h3$1 style="font-size: 20px; font-weight: 600; margin: 18px 0 12px 0; line-height: 1.4; color: #3c3c3c;">');
  optimized = optimized.replace(/<h4([^>]*)>/g, '<h4$1 style="font-size: 16px; font-weight: 600; margin: 14px 0 8px 0; line-height: 1.4; color: #4c4c4c;">');
  optimized = optimized.replace(/<h5([^>]*)>/g, '<h5$1 style="font-size: 14px; font-weight: 600; margin: 12px 0 6px 0; line-height: 1.4; color: #5c5c5c;">');
  optimized = optimized.replace(/<h6([^>]*)>/g, '<h6$1 style="font-size: 13px; font-weight: 600; margin: 10px 0 5px 0; line-height: 1.4; color: #6c6c6c;">');

  // 2. 📝 段落优化 - 让阅读更舒适
  optimized = optimized.replace(/<p([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('style=')) {
      return `<p${attrs} style="line-height: 1.8; margin: 16px 0; text-indent: 2em; color: #333;">`;
    }
    return match;
  });

  // 3. 🖼️ 图片优化 - 让图片更美观
  optimized = optimized.replace(/<img([^>]*?)>/g, (match, attrs) => {
    if (!attrs.includes('style=')) {
      const hasAlt = attrs.includes('alt=');
      return `<img${attrs} style="max-width: 100%; height: auto; margin: 20px auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"${!hasAlt ? ' alt="图片"' : ''}>`;
    }
    return match;
  });

  // 4. 📋 列表优化 - 让列表更清晰
  optimized = optimized.replace(/<ul([^>]*)>/g, '<ul$1 style="margin: 16px 0; padding-left: 24px; line-height: 1.6;">');
  optimized = optimized.replace(/<ol([^>]*)>/g, '<ol$1 style="margin: 16px 0; padding-left: 24px; line-height: 1.6;">');
  optimized = optimized.replace(/<li([^>]*)>/g, '<li$1 style="margin: 8px 0; color: #333;">');

  // 5. 💬 引用优化 - 让引用更突出
  optimized = optimized.replace(/<blockquote([^>]*)>/g, '<blockquote$1 style="margin: 20px 0; padding: 16px 20px; border-left: 4px solid #1890ff; background: linear-gradient(90deg, #f6f8fa 0%, #ffffff 100%); font-style: italic; color: #555;">');

  // 6. 💻 代码优化 - 让代码更专业
  optimized = optimized.replace(/<code([^>]*)>/g, '<code$1 style="background-color: #f1f3f4; padding: 2px 6px; border-radius: 4px; font-family: \'Fira Code\', Consolas, Monaco, monospace; font-size: 0.9em; color: #d73a49;">');
  optimized = optimized.replace(/<pre([^>]*)>/g, '<pre$1 style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; overflow-x: auto; font-family: \'Fira Code\', Consolas, Monaco, monospace; font-size: 14px; line-height: 1.5;">');

  // 7. 📊 表格优化 - 让表格更美观
  optimized = optimized.replace(/<table([^>]*)>/g, '<table$1 style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">');
  optimized = optimized.replace(/<th([^>]*)>/g, '<th$1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; text-align: left; font-weight: 600;">');
  optimized = optimized.replace(/<td([^>]*)>/g, '<td$1 style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">');

  // 8. 🔗 链接优化 - 让链接更友好
  optimized = optimized.replace(/<a([^>]*)>/g, '<a$1 style="color: #1890ff; text-decoration: none; border-bottom: 1px solid transparent; transition: border-bottom 0.2s ease;" onmouseover="this.style.borderBottom=\'1px solid #1890ff\'" onmouseout="this.style.borderBottom=\'1px solid transparent\'">');

  // 9. ➖ 分隔线优化 - 让分隔线更优雅
  optimized = optimized.replace(/<hr([^>]*)>/g, '<hr$1 style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #e8e8e8, transparent); margin: 30px 0;">');

  // 10. 🧹 清理多余空白
  optimized = optimized.replace(/\s+/g, ' '); // 清理多余空格
  optimized = optimized.replace(/<p[^>]*>\s*<\/p>/g, ''); // 清理空段落
  optimized = optimized.replace(/(<\/[^>]+>)\s+(<[^>]+>)/g, '$1$2'); // 清理标签间空白

  return optimized;
};

// 🔄 段落首行缩进切换功能
const toggleParagraphIndent = (editor: any) => {
  try {
    const content = editor.getContent();

    if (!content || content.trim() === '' || content === '<p><br></p>' || content === '<p></p>') {
      message.warning({
        content: '📝 请先输入一些段落内容，然后再切换首行缩进',
        duration: 3
      });
      return;
    }

    // 检查当前是否有首行缩进
    const hasIndent = content.includes('text-indent: 2em') || content.includes('text-indent:2em');

    let newContent: string;
    let actionText: string;

    if (hasIndent) {
      // 移除首行缩进
      newContent = removeIndentFromParagraphs(content);
      actionText = '已移除段落首行缩进';
    } else {
      // 添加首行缩进
      newContent = addIndentToParagraphs(content);
      actionText = '已添加段落首行缩进';
    }

    editor.setContent(newContent);

    message.success({
      content: `📐 ${actionText}`,
      duration: 3
    });

  } catch (error) {
    console.error('首行缩进切换失败:', error);
    message.error({
      content: '🔧 首行缩进切换失败，请重试',
      duration: 3
    });
  }
};

// 为段落添加首行缩进
const addIndentToParagraphs = (content: string): string => {
  return content.replace(/<p([^>]*)>/g, (match, attrs) => {
    // 如果已经有 style 属性
    if (attrs.includes('style=')) {
      // 检查是否已经有 text-indent
      if (attrs.includes('text-indent')) {
        // 更新现有的 text-indent
        return match.replace(/text-indent:\s*[^;]+;?/g, 'text-indent: 2em;');
      } else {
        // 在现有 style 中添加 text-indent
        return match.replace(/style="([^"]*)"/, 'style="$1 text-indent: 2em;"');
      }
    } else {
      // 添加新的 style 属性
      return `<p${attrs} style="text-indent: 2em;">`;
    }
  });
};

// 从段落移除首行缩进
const removeIndentFromParagraphs = (content: string): string => {
  return content.replace(/<p([^>]*)>/g, (match, attrs) => {
    if (attrs.includes('text-indent')) {
      // 移除 text-indent 属性
      let newAttrs = attrs.replace(/text-indent:\s*[^;]+;?\s*/g, '');

      // 如果 style 属性变空了，移除整个 style 属性
      newAttrs = newAttrs.replace(/style="\s*"/g, '');
      newAttrs = newAttrs.replace(/style=''\s*/g, '');

      return `<p${newAttrs}>`;
    }
    return match;
  });
};

// 用户信息
const form = reactive<ShopGoods>({
  goodsId: undefined,
  type: 1,
  code: undefined,
  name: undefined,
  goodsName: undefined,
  image: undefined,
  video: undefined,
  content: undefined,
  canExpress: 1,
  unitName: '',
  categoryId: undefined,
  parentName: undefined,
  categoryName: undefined,
  specs: 0,
  commissionRole: 0,
  position: undefined,
  price: undefined,
  originPrice: undefined,
  salePrice: undefined,
  buyingPrice: undefined,
  dealerPrice: undefined,
  priceGift: undefined,
  dealerGift: undefined,
  priceGiftNum: undefined,
  priceGiftName: undefined,
  dealerGiftNum: undefined,
  files: undefined,
  sales: 0,
  isNew: 0,
  gainIntegral: 0,
  goodsWeight: undefined,
  recommend: undefined,
  merchantId: undefined,
  merchantName: undefined,
  supplierMerchantId: undefined,
  supplierName: undefined,
  chainStorePrice: undefined,
  memberStorePrice: undefined,
  memberMarketPrice: undefined,
  chainStoreRate: undefined,
  memberStoreRate: undefined,
  memberMarketRate: undefined,
  memberStoreCommission: undefined,
  supplierCommission: undefined,
  coopCommission: undefined,
  expressTemplateId: undefined,
  canUseDate: undefined,
  ensureTag: undefined,
  expiredDay: undefined,
  stock: 1000,
  deductStockType: 20,
  isShow: undefined,
  status: 0,
  comments: '',
  sortNumber: 100,
  specName: '',
  goodsRoleCommission: []
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
      message: '请选择商品类型',
      type: 'number',
      trigger: 'blur'
    }
  ],
  image: [
    {
      required: true,
      message: '请上传图片',
      type: 'string',
      trigger: 'blur'
    }
  ],
  files: [
    {
      required: true,
      message: '请上传轮播图',
      type: 'string',
      trigger: 'blur',
      validator: async (_rule: RuleObject, value: string) => {
        if (form.files?.length == 0) {
          return Promise.reject('选择上传轮播图');
        }
        return Promise.resolve();
      }
    }
  ],
  specs: [
    {
      required: true,
      message: '请选择规格类型',
      type: 'number',
      trigger: 'blur'
    }
  ],
  price: [
    {
      required: true,
      message: '请填写会员价',
      type: 'number',
      trigger: 'blur'
    }
  ],
  salePrice: [
    {
      required: true,
      message: '请填写市场价',
      type: 'number',
      trigger: 'blur'
    }
  ],
  buyingPrice: [
    {
      required: true,
      message: '请填写会员店/总仓批发价',
      type: 'number',
      trigger: 'blur'
    }
  ],
  stock: [
    {
      required: true,
      message: '请填写商品库存',
      type: 'number',
      trigger: 'blur'
    }
  ],
  // supplierMerchantId: [
  //   {
  //     required: true,
  //     message: '请选择供应商',
  //     type: 'number',
  //     trigger: 'blur'
  //   }
  // ],
  // categoryId: [
  //   {
  //     required: true,
  //     type: 'string',
  //     message: '选择商品分类',
  //     trigger: 'blur',
  //     validator: async (_rule: RuleObject, value: string) => {
  //       if (!form.categoryId) {
  //         return Promise.reject('选择商品分类');
  //       }
  //       return Promise.resolve();
  //     }
  //   }
  // ],
  name: [
    {
      required: true,
      message: '请选择商品名称',
      type: 'string',
      trigger: 'blur'
    }
  ],
  goodsName: [
    {
      required: true,
      message: '请选择商品名称',
      type: 'string',
      trigger: 'blur'
    }
  ],
  sortNumber: [
    {
      required: true,
      message: '请输入排序号',
      type: 'number',
      trigger: 'blur'
    }
  ],
  chainStorePrice: [
    {
      required: true,
      message: '请输入供应价',
      type: 'number',
      trigger: 'blur'
    }
  ],
  memberStorePrice: [
    {
      required: true,
      message: '请输入会员店价格',
      type: 'number',
      trigger: 'blur'
    }
  ],
  memberMarketPrice: [
    {
      required: true,
      message: '请输入会员超市价格',
      type: 'number',
      trigger: 'blur'
    }
  ],
  memberStoreCommission: [
    {
      required: true,
      message: '请输入直推收益分配',
      type: 'number',
      trigger: 'blur'
    }
  ],
  supplierCommission: [
    {
      required: true,
      message: '请输入仓储费',
      type: 'number',
      trigger: 'blur'
    }
  ]
});

const onType = (index: number) => {
  form.type = index;
};

/* 搜索 */
const chooseMerchantId = (item: ShopMerchant) => {
  form.merchantName = item.merchantName;
  form.merchantId = item.merchantId;
};

const clearMerchant = () => {
  form.merchantName = '';
  form.merchantId = 0;
};

const chooseSupplier = (item: ShopMerchant) => {
  form.supplierName = item.merchantName;
  form.supplierMerchantId = item.merchantId;
};

const chooseGoodsCategory = (item: ShopGoodsCategory, value: any) => {
  form.categoryId = value[1].value;
  form.parentName = value[0].label;
  form.categoryName = value[1].label;
};
const chooseTakeawayCategory = (item: ShopGoodsCategory, value: any) => {
  form.categoryParent = '店铺分类';
  form.categoryChildren = value[0].label;
  form.categoryId = item[0];
};

const chooseImage = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.image = data.path;
};

const chooseSkuImage = (data: FileRecord) => {
  const index = data?.index;
  skuList.value[index].images?.push({
    uid: uuid(),
    url: data.path,
    status: 'done'
  });
  skuList.value[index].image = data.path;
};

const onDeleteSkuItem = (index: number) => {
  images.value.splice(index, 1);
};

const videos = ref<ItemType[]>([]);
const chooseVideo = (data: FileRecord) => {
  videos.value = [
    {
      uid: uuid(),
      url: data.path,
      status: 'done'
    }
  ];
  form.video = data.path;
};

const onDeleteVideo = (index: number) => {
  images.value.splice(index, 1);
  form.video = undefined;
};

const onChange = (text: string) => {
  // 加载商品多规格
  if (text == 'spec') {
    const goodsId = props.data?.goodsId;
    if (goodsId) {
      listShopGoodsSpec({goodsId}).then((data) => {
        if (data.length > 0) {
          const specValue = data[0].specValue;
          if (specValue) {
            spec.value = JSON.parse(specValue).map((d) => {
              console.log(d);
              return {
                value: d.value,
                detail: d.detail
              };
            });
          }
          console.log(spec.value);
        }
      });
      listShopGoodsSku({goodsId}).then((data) => {
        skuList.value = data;
      });
    }
  }
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.image = '';
};

const onClose = (index) => {
  spec.value.splice(index, 1);
};

const openSpecForm = () => {
  showSpecForm.value = !showSpecForm.value;
};

const onSpec = (row: ShopSpec) => {
  form.specName = row.specName;
  goodsSpec.value = row;
  if (row.specValue) {
    spec.value = JSON.parse(row?.specValue);
  }
};

// 新增规格
const addSpecValue = () => {
  if (!name.value || !value.value) {
    message.error(`请输入规格和规格值`);
    return false;
  }
  const findIndex = spec.value.findIndex((d) => d.value == name.value);
  if (findIndex == 0) {
    message.error(`${name.value}已存在)`);
    return false;
  }
  spec.value.push({
    value: name.value,
    detail: [value.value]
  });
  name.value = '';
  value.value = '';
  openSpecForm();
};

const chooseFile = (data: FileRecord) => {
  files.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
};

const onDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

/**
 * 生成商品SKU列表
 */
const generateSku = () => {
  generateGoodsSku(spec.value).then((data) => {
    if (data) {
      skuList.value = data;
    }
  });
};


const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);

// 文件库选择弹窗状态
const showFileSelector = ref(false);
const fileSelectCallback = ref<((url: string) => void) | null>(null);

// 视频库选择弹窗状态
const showVideoSelector = ref(false);
const videoSelectCallback = ref<((url: string) => void) | null>(null);

// 📝 Markdown编辑器配置
const markdownToolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog'
] as any;

// 📝 Markdown编辑器图片上传处理
const onMarkdownUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  try {
    const uploadPromises = files.map(async (file) => {
      // 检查文件大小（限制为10MB）
      if (file.size > 10 * 1024 * 1024) {
        message.error(`图片 ${file.name} 大小超过10MB，请选择更小的文件`);
        return null;
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        message.error(`文件 ${file.name} 不是有效的图片格式`);
        return null;
      }

      try {
        const result = await uploadOss(file);
        return result.url || result.path;
      } catch (error) {
        console.error('图片上传失败:', error);
        message.error(`图片 ${file.name} 上传失败`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successUrls = results.filter(url => url !== null) as string[];

    if (successUrls.length > 0) {
      callback(successUrls);
      message.success(`成功上传 ${successUrls.length} 张图片`);
    }
  } catch (error) {
    console.error('批量上传失败:', error);
    message.error('图片上传失败，请重试');
  }
};

// 📝 Markdown编辑器图片选择器
const openMarkdownImageSelector = () => {
  fileSelectCallback.value = (url: string) => {
    // 在当前光标位置插入Markdown图片语法
    const imageMarkdown = `![图片](${url})`;
    insertMarkdownText(imageMarkdown);
  };
  showFileSelector.value = true;
};

// 📝 Markdown编辑器视频选择器
const openMarkdownVideoSelector = () => {
  videoSelectCallback.value = (url: string) => {
    // 在当前光标位置插入Markdown视频语法（使用HTML标签）
    const videoMarkdown = `<video controls style="max-width: 100%; height: auto;">
  <source src="${url}" type="video/mp4">
  您的浏览器不支持视频播放。
</video>`;
    insertMarkdownText(videoMarkdown);
  };
  showVideoSelector.value = true;
};

// 📝 在Markdown编辑器中插入文本
const insertMarkdownText = (text: string) => {
  // 简单的文本插入，在内容末尾添加
  if (content.value) {
    content.value += '\n\n' + text;
  } else {
    content.value = text;
  }
};
const config = ref({
  height: 650,
  paste_data_images: true,
  automatic_uploads: true,

  // 自定义工具栏，移除默认的image和media按钮，添加自定义按钮
  toolbar: [
    'fullscreen preview code codesample emoticons custom_image_selector quick_upload custom_video_selector quick_video_upload auto_format toggle_indent',
    'undo redo | forecolor backcolor',
    'bold italic underline strikethrough',
    'alignleft aligncenter alignright alignjustify',
    'outdent indent | numlist bullist',
    'formatselect fontselect fontsizeselect',
    'link charmap anchor pagebreak | ltr rtl'
  ].join(' | '),

  // 图片上传处理器 - 支持拖拽和粘贴上传
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      error('图片大小不能超过10MB');
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      error('只能上传图片文件');
      return;
    }

    // 显示上传进度提示
    const loadingMsg = message.loading('图片上传中...', 0);

    uploadOss(file)
      .then((res) => {
        loadingMsg();
        success(res.url || res.path);
        message.success('图片上传成功');
      })
      .catch((msg) => {
        loadingMsg();
        error(msg || '图片上传失败');
        message.error('图片上传失败：' + msg);
      });
  },

  // 图片工具栏
  image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',

  // 图片标题
  image_title: true,

  // 图片描述
  image_description: true,

  // 图片尺寸
  image_dimensions: true,

  // 图片类别
  image_class_list: [
    {title: '无样式', value: ''},
    {title: '响应式图片', value: 'img-responsive'},
    {title: '圆角图片', value: 'img-rounded'},
    {title: '圆形图片', value: 'img-circle'}
  ],

  // 自定义按钮设置
  setup: (editor: any) => {
    // 添加自定义图片选择按钮
    editor.ui.registry.addButton('custom_image_selector', {
      text: '图片',
      icon: 'image',
      tooltip: '插入图片（从文件库选择或上传）',
      onAction: () => {
        // 打开文件库选择弹窗
        fileSelectCallback.value = (url: string) => {
          editor.insertContent(`<img src="${url}" alt="图片" style="max-width: 100%;" />`);
        };
        showFileSelector.value = true;
      }
    });

    // 添加快速上传按钮
    editor.ui.registry.addButton('quick_upload', {
      text: '上传',
      icon: 'upload',
      tooltip: '快速上传图片',
      onAction: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            // 检查文件大小
            if (file.size > 10 * 1024 * 1024) {
              message.error('图片大小不能超过10MB');
              return;
            }

            const loadingMsg = message.loading('图片上传中...', 0);
            uploadOss(file)
              .then((res) => {
                loadingMsg();
                const imageUrl = res.url || res.path;
                editor.insertContent(`<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%;" />`);
                message.success('图片上传成功');
              })
              .catch((msg) => {
                loadingMsg();
                message.error('图片上传失败：' + msg);
              });
          }
        };
        input.click();
      }
    });

    // 添加自定义视频选择按钮
    editor.ui.registry.addButton('custom_video_selector', {
      text: '视频',
      icon: 'embed',
      tooltip: '插入视频（从视频库选择）',
      onAction: () => {
        // 打开视频库选择弹窗
        videoSelectCallback.value = (url: string) => {
          // 插入视频标签，使用HTML5 video元素
          editor.insertContent(`
              <video controls style="max-width: 100%; height: auto;">
                <source src="${url}" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            `);
        };
        showVideoSelector.value = true;
      }
    });

    // 添加快速视频上传按钮
    editor.ui.registry.addButton('quick_video_upload', {
      text: '上传视频',
      icon: 'upload',
      tooltip: '快速上传视频',
      onAction: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            // 检查文件大小（限制为100MB）
            if (file.size > 100 * 1024 * 1024) {
              message.error('视频大小不能超过100MB');
              return;
            }

            const loadingMsg = message.loading('视频上传中...', 0);
            uploadOss(file)
              .then((res) => {
                loadingMsg();
                const videoUrl = res.path || res.downloadUrl;
                editor.insertContent(`
                    <video controls style="max-width: 100%; height: auto;">
                      <source src="${videoUrl}" type="video/mp4">
                      您的浏览器不支持视频播放。
                    </video>
                  `);
                message.success('视频上传成功');
              })
              .catch((msg) => {
                loadingMsg();
                message.error('视频上传失败：' + msg);
              });
          }
        };
        input.click();
      }
    });

    // 添加一键排版按钮
    editor.ui.registry.addButton('auto_format', {
      text: '一键排版',
      icon: 'template',
      tooltip: '智能优化文章格式和排版',
      onAction: () => {
        // 直接在这里处理排版，因为此时编辑器肯定已经初始化完成
        handleAutoFormat(editor);
      }
    });

    // 添加段落首行缩进切换按钮
    editor.ui.registry.addButton('toggle_indent', {
      text: '首行缩进',
      icon: 'indent',
      tooltip: '切换段落首行缩进（适合中文排版）',
      onAction: () => {
        toggleParagraphIndent(editor);
      }
    });
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
          content.value = content.value + addPath;
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
};

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
      if (form.priceGift && !form.priceGiftNum)
        return message.error('请输入会员赠品数量');
      if (ensureTag.value.length) form.ensureTag = ensureTag.value.join();
      if (canUseDate.value.length) form.canUseDate = canUseDate.value.join();

      // if (form.dealerGift && !form.dealerGiftNum) return message.error('请输入经销商赠品数量');
      if (form.commissionRole === 1) {
        for (let i = 0; i < form.goodsRoleCommission.length; i++) {
          if (
            form.goodsRoleCommission[i].amount === undefined ||
            form.goodsRoleCommission[i].amount === '' ||
            form.goodsRoleCommission[i].amount === null
          ) {
            return message.error(
              '请输入' + form.goodsRoleCommission[i].roleName + '的分红金额'
            );
          }
        }
      }
      const formData = {
        ...form,
        content: content.value,
        category: JSON.stringify(category.value),
        files: JSON.stringify(files.value),
        goodsSpec: goodsSpec.value,
        goodsSkus: skuList.value,
        type: getMerchantId() ? 1 : 0
      };
      if (isUpdate.value) {
        formData.type = props.data.type;
      }
      const saveOrUpdate = isUpdate.value ? updateShopGoods : addShopGoods;
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

const expressTemplateList = ref<ShopExpressTemplate[]>([]);
const getExpressTemplateList = async () => {
  expressTemplateList.value = await listShopExpressTemplate();
};

const getRoleList = async () => {
  const roleList = await listShopCommissionRole();
  form.goodsRoleCommission = [];
  roleList.forEach((d) => {
    form.goodsRoleCommission.push({
      roleId: d.id,
      roleName: d.title,
      amount: 0
    });
  });
  if (props?.data?.goodsId) {
    const commissionList = await listShopGoodsRoleCommission({
      goodsId: props?.data?.goodsId
    });
    form.goodsRoleCommission = form.goodsRoleCommission.map((d) => {
      const find = commissionList.find((c) => c.roleId == d.roleId);
      return {
        ...d,
        amount: find?.amount || 0
      };
    });
  }
};

const onUploadImage = (item) => {
  const {file} = item;
  if (file.size / 1024 / 1024 > 10) {
    message.error('大小不能超过 10MB');
    return;
  }
  const hide = messageLoading({
    content: '上传中..',
    duration: 0,
    mask: true
  });
  uploadOss(file)
    .then((res) => {
      hide();
      form.image = res.path;
    })
    .catch((e) => {
      message.error(e.message);
      hide();
    });
};
const onUploadSwiper = (item) => {
  const {file} = item;
  if (file.size / 1024 / 1024 > 10) {
    message.error('大小不能超过 10MB');
    return;
  }
  const hide = messageLoading({
    content: '上传中..',
    duration: 0,
    mask: true
  });
  uploadOss(file)
    .then((data) => {
      hide();
      files.value.push({
        uid: data.id,
        url: data.path,
        status: 'done'
      });
      setPicker();
    })
    .catch((e) => {
      message.error(e.message);
      hide();
    });
};

const swiperRef = ref();
const imageRef = ref();
const setPicker = () => {
  const swiperEl = swiperRef.value?.$el?.querySelector('input[type="file"]');
  if (swiperEl) {
    swiperEl.removeAttribute('accept'); // 移除 accept 属性
    swiperEl.removeAttribute('capture'); // 移除 capture 属性
    swiperEl.setAttribute('name', 'file'); // 添加 name 属性
  }
  const imageEl = imageRef.value?.$el?.querySelector('input[type="file"]');
  if (imageEl) {
    imageEl.removeAttribute('accept'); // 移除 accept 属性
    imageEl.removeAttribute('capture'); // 移除 capture 属性
    imageEl.setAttribute('name', 'file'); // 添加 name 属性
  }
};
watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await getExpressTemplateList();

      images.value = [];
      category.value = [];
      files.value = [];
      videos.value = [];
      canUseDate.value = [];
      ensureTag.value = [];
      ensureTagItem.value = '';
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.image) {
          images.value.push({
            uid: uuid(),
            url: props.data.image,
            status: 'done'
          });
        }
        if (props.data.files) {
          files.value = JSON.parse(props.data.files);
        }
        if (props.data.goodsSpecs) {
          goodsSpec.value = props.data.goodsSpecs[0];
          if (props.data.specs == 1) {
            form.specName = props.data.goodsSpecs[0].specName;
          }
        }
        if (props.data.goodsSkus) {
          skuList.value = props.data.goodsSkus.map((d) => {
            d.images = [];
            d.images.push({
              uid: uuid(),
              url: d.image,
              status: 'done'
            });
            return d;
          });
        }
        if (props.data.video) {
          videos.value = [
            {
              uid: uuid(),
              url: props.data.video,
              status: 'done'
            }
          ];
        }
        // 商品分类
        if (props.data.parentName) {
          category.value.push(props.data.parentName);
        }
        if (props.data.category) {
          category.value = JSON.parse(props.data.category);
        }
        if (props.data.content) {
          content.value = props.data.content;
        }

        isUpdate.value = true;
        if (form.ensureTag) {
          ensureTag.value = form.ensureTag.split(',');
        }
        // 🎯 优先级设置栏目：
        // 1. 如果传入了 categoryId（从栏目页面点击添加），使用传入的
        // 2. 否则使用上次保存的栏目
        if (props.data.categoryId) {
          form.categoryId = props.data?.categoryId;
        } else {
          const lastCategory = getLastCategory();
          if (lastCategory) {
            form.categoryId = lastCategory;
          }
        }
        await getRoleList();
      } else {
        await getRoleList();
        spec.value = [];
        goodsSpec.value = undefined;
        skuList.value = [];
        isUpdate.value = false;
      }
      setPicker();
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
