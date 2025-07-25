<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-radio-group v-model:value="where.branch" @change="onBranch">
      <a-radio-button :value="1">初中部</a-radio-button>
      <a-radio-button :value="2">高中部</a-radio-button>
<!--      <a-radio-button :value="8">教职员工</a-radio-button>-->
<!--      <a-radio-button :value="9">其他</a-radio-button>-->
    </a-radio-group>
    <a-select
      show-search
      v-model:value="where.gradeId"
      style="width: 240px"
      placeholder="选择年级"
      :options="gradeList"
      @change="onGrade"
    ></a-select>
    <a-select
      v-if="where.gradeId"
      show-search
      v-model:value="where.name"
      style="width: 240px"
      placeholder="选择年级"
      :options="classList"
      @change="onClass"
    ></a-select>
<!--    <a-input-search-->
<!--      allow-clear-->
<!--      placeholder="请输入关键词"-->
<!--      style="width: 280px"-->
<!--      v-model:value="where.keywords"-->
<!--      @search="reload"-->
<!--    />-->
<!--    <a-button type="text" @click="handleExport">导出</a-button>-->
  </a-space>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {utils, writeFile} from 'xlsx';
import dayjs from 'dayjs';
import {message} from 'ant-design-vue';
import {BszxBm} from "@/api/bszx/bszxBm/model";
import useSearch from "@/utils/use-search";
import {listBszxBm} from "@/api/bszx/bszxBm";
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
  (e: 'search', where?: BszxClassParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const {where} = useSearch<BszxClassParam>({
  id: undefined,
  keywords: '',
  name: undefined,
  branch: undefined,
  userId: undefined
});

// 变量
const loading = ref(false);
const bmList = ref<BszxBm[]>([])
const xlsFileName = ref<string>();
const gradeId = ref<number>();
const gradeList = ref<BszxClassParam[]>([]);
const classList = ref<BszxClassParam[]>([]);

const reload = () => {
  emit('search', where);
};

const getGradeList = () => {
  listBszxGrade({branch: where.branch}).then(res => {
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

const onBranch = () => {
  getGradeList();
  reload();
}

const onGrade = (gradeName: number, item: any) => {
  where.gradeId = item.id;
  if(gradeName){
    console.log(item)
    gradeId.value = item.id;
    getClassList();
  }
  emit('search', where);
}

const onClass = (classId,item) => {
  console.log(classId);
  where.name = item.name;
  reload();
}

// 导出
const handleExport = async () => {
  loading.value = true;
  const array: (string | number)[][] = [
    [
      '用户ID',
      '姓名',
      '性别',
      '手机号码',
      '班级',
      '年级',
      '居住地址',
      '工作单位',
      '职务',
      '是否能到场',
      '邀请函',
      '报名时间'
    ]
  ];

  // 按搜索结果导出
  where.sceneType = 'Content';
  await listBszxBm(where)
    .then((list) => {
      bmList.value = list;
      list?.forEach((d: BszxBm) => {
        array.push([
          `${d.userId}`,
          `${d.name}`,
          `${d.sex}`,
          `${d.phone}`,
          `${d.className}`,
          `${d.gradeName}`,
          `${d.address}`,
          `${d.workUnit}`,
          `${d.position}`,
          `${d.present}`,
          `${d.certificate}`,
          `${d.createTime}`
        ]);
      });
      const sheetName = `导出报名列表${dayjs(new Date()).format('YYYYMMDD')}`;
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
  () => props.selection,
  () => {
  }
);
</script>
