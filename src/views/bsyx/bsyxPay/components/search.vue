<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-select
      show-search
      v-model:value="where.gradeName"
      style="width: 240px"
      placeholder="选择年级"
      :options="gradeList"
      @change="onGrade"
    ></a-select>
    <a-select
      v-if="where.gradeName"
      show-search
      v-model:value="where.className"
      style="width: 240px"
      placeholder="选择年级"
      :options="classList"
      @change="onClass"
    ></a-select>
    <a-range-picker
      v-model:value="dateRange"
      @change="search"
      value-format="YYYY-MM-DD"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 220px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button @click="handleExport">导出</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {utils, writeFile} from 'xlsx';
import dayjs from 'dayjs';
import {message} from 'ant-design-vue';
import useSearch from "@/utils/use-search";
import {BszxPayParam} from "@/api/bszx/bszxPay/model";
import {BszxBm} from "@/api/bszx/bszxBm/model";
import {listBszxPay} from "@/api/bszx/bszxPay";
import {BszxClassParam} from "@/api/bszx/bszxClass/model";
import {listBszxGrade} from "@/api/bszx/bszxGrade";
import {listBszxClass} from "@/api/bszx/bszxClass";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'search', where?: BszxPayParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const {where} = useSearch<BszxPayParam>({
  id: undefined,
  keywords: '',
  gradeName: undefined,
  className: undefined,
  createTimeStart: undefined,
  createTimeEnd: undefined,
  userId: undefined
});

const reload = () => {
  emit('search', where);
};

/* 搜索 */
const search = () => {
  const [d1, d2] = dateRange.value ?? [];
  where.createTimeStart = d1 ? d1 + ' 00:00:00' : undefined;
  where.createTimeEnd = d2 ? d2 + ' 23:59:59' : undefined;
  emit('search', {
    ...where
  });
};


const dateRange = ref<[string, string]>(['', '']);
// 变量
const loading = ref(false);
const bmList = ref<BszxBm[]>([])
const xlsFileName = ref<string>();
const branchId = ref<number>();
const gradeId = ref<number>();
const gradeList = ref<BszxClassParam[]>([]);
const classList = ref<BszxClassParam[]>([]);


const getGradeList = () => {
  listBszxGrade({branch: branchId.value}).then(res => {
    gradeList.value = res.map(d => {
      d.value = Number(d.id);
      d.label = d.name;
      return d;
    });
  })
};

const getClassList = () => {
  listBszxClass({gradeId: gradeId.value}).then(res => {
    classList.value = res.map(d => {
      d.value = Number(d.id);
      d.label = d.name;
      return d;
    });
  })
}

const onGrade = (gradeName: number, item: any) => {
  where.gradeName = item.name;
  if (gradeName) {
    console.log(item)
    gradeId.value = item.id;
    getClassList();
  }
  emit('search', where);
}

const onBranchId = () => {
  getGradeList();
}

const onClass = (classId, item) => {
  console.log(classId);
  where.className = item.name;
  reload();
}

// 导出
const handleExport = async () => {
  loading.value = true;
  const array: (string | number)[][] = [
    [
      '订单编号',
      '姓名',
      '手机号码',
      '捐款金额',
      '性别',
      '年级',
      '班级',
      '居住地址',
      '工作单位',
      '职务',
      '捐款时间'
    ]
  ];

  // 按搜索结果导出
  where.sceneType = 'Content';
  await listBszxPay(where)
    .then((list) => {
      bmList.value = list;
      list?.forEach((d: BszxBm) => {
        array.push([
          `${d.orderNo}`,
          `${d.name}`,
          `${d.mobile}`,
          `${d.price}`,
          `${d.sex == 1 ? '男' : ''}${d.sex == 2 ? '女' : '-'}`,
          `${d.gradeName ? d.gradeName : '-'}`,
          `${d.className ? d.className : '-'}`,
          `${d.address ? d.address : '-'}`,
          `${d.workUnit ? d.workUnit : '-'}`,
          `${d.position ? d.position : '-'}`,
          `${d.createTime}`
        ]);
      });
      const sheetName = `导出捐款记录${dayjs(new Date()).format('YYYYMMDD')}`;
      const workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      const sheet = utils.aoa_to_sheet(array);
      workbook.Sheets[sheetName] = sheet;
      // 设置列宽
      sheet['!cols'] = [
        {wch: 10},
        {wch: 40},
        {wch: 20},
        {wch: 20},
        {wch: 60},
        {wch: 15},
        {wch: 10},
        {wch: 10},
        {wch: 20},
        {wch: 10},
        {wch: 20}
      ];
      message.loading('正在导出...');
      setTimeout(() => {
        writeFile(
          workbook,
          `${
            where.createTimeEnd ? xlsFileName.value + '_' : ''
          }${sheetName}.xlsx`
        );
        loading.value = false;
      }, 1000);
    })
    .catch((msg) => {
      message.error(msg);
      loading.value = false;
    })
    .finally(() => {
    });

};

getGradeList();

watch(
  () => props.totalPriceAmount,
  (totalPriceAmount) => {
    console.log(totalPriceAmount, 'totalPriceAmount')
  }
);
</script>
