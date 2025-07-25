<template>
  <div class="cert-box h-screen">
    <div class="cert-content" v-html="article.content"></div>
    <div class="create-time text-right">
      <span>广西百色中学</span>
      <p>{{ toDateString(form.createTime, "YYYY-MM-dd") }}</p>
    </div>
    <!-- 二维码 -->
    <div class="qrcode mt-10 text-center">
      <ele-qr-code-svg :value="`${qrcode}`" :size="200" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { onMounted, ref,unref, reactive } from 'vue';
  import { assignObject, toDateString } from "ele-admin-pro";
  import {getBszxPay} from '@/api/bszx/bszxPay';
  import type { BszxPay } from '@/api/bszx/bszxPay/model';
  import {getCmsArticle} from "@/api/cms/cmsArticle";
  import {CmsArticle} from "@/api/cms/cmsArticle/model";

  // 二维码内容
  const qrcode = ref('123');
  // 当前编辑数据
  // 是否显示编辑弹窗
  // 是否显示批量移动弹窗
  // 加载状态
  const loading = ref(true);

  // 捐款记录
  const form = reactive<BszxPay>({
    id: undefined,
    age: undefined,
    name: undefined,
    sex: undefined,
    phone: undefined,
    className: undefined,
    gradeName: undefined,
    address: undefined,
    workUnit: undefined,
    position: undefined,
    number: undefined,
    price: undefined,
    extra: undefined,
    dateTime: undefined,
    certificate: undefined,
    formData: undefined,
    formId: undefined,
    userId: undefined,
    comments: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    sortNumber: 100
  });

  // 文章
  const article = reactive<CmsArticle>({
    articleId: undefined,
    content: undefined,
    createTime: undefined
  });


  /* 查询 */
  const query = () => {
    loading.value = true;
    const { currentRoute } = useRouter();
    const { params } = unref(currentRoute);
    console.log(params.id,'query')
    getBszxPay(Number(params?.id)).then(data => {
      assignObject(form, data);
      if(data.formId && data.formId > 0){
        getCmsArticle(data.formId).then(result => {
          if(result.content){
            result.content = result?.content.replace('校友', data?.name + '___校友');
            result.content = result?.content.replace('人民币', '人民币 ' + data?.price);
            qrcode.value = 'https://website.websoft.top/bszx/pay-cert/' + data?.id;
          }
          assignObject(article, result);
        })
      }
    })
  };

onMounted(() => {
  query();
})
</script>

<script lang="ts">
  export default {
    name: 'BszxPay'
  };
</script>

<style lang="less" scoped>
.cert-box{
  width: 500px;
  margin: 10px auto;
  padding: 58px;
  border-bottom: blue 1px solid;
  background: url("https://oss.wsdns.cn/20250127/cb1088c3b1354a118477a0b1a3cdac41.png") no-repeat;
  background-size: 100%;
}
.cert-content{
  margin-top: 250px;
}
</style>
