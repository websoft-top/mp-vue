<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-button
      danger
      type="primary"
      class="ele-btn-icon"
      :disabled="selection?.length === 0"
      @click="removeBatch"
    >
      <template #icon>
        <DeleteOutlined />
      </template>
      <span>批量删除</span>
    </a-button>
    <org-select
      :data="organizationList"
      placeholder="请选择所属机构"
      style="width: 220px"
      v-model:value="where.organizationId"
      @change="reload"
    />
    <a-input-search
      allow-clear
      placeholder="请输入搜索关键词"
      style="width: 280px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button type="text" :icon="h(UploadOutlined)" @click="openImport"
      >导入xls</a-button
    >
    <a-button
      type="text"
      :icon="h(QrcodeOutlined)"
      @click="handleExport"
      :loading="exportLoading"
      >导出二维码</a-button
    >
    <!--    <span class="text-red-500" v-if="where.organizationId">{{ where.organizationParentName }}(ID：{{where.organizationParentId}})</span>-->
    <!--    <span class="text-red-500" v-if="where.organizationId">{{ where }}(ID：{{where.organizationId}})</span>-->
  </a-space>

  <!-- 导入弹窗 -->
  <import v-model:visible="showImport" @done="reload" />
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { GradeParam } from '@/api/user/grade/model';
  import { watch, ref } from 'vue';
  import { h } from 'vue';
  import { UploadOutlined, QrcodeOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import useSearch from '@/utils/use-search';
  import { HjmCarParam, HjmCar } from '@/api/hjm/hjmCar/model';
  import { listHjmCar } from '@/api/hjm/hjmCar';
  import {
    Document,
    Packer,
    Paragraph,
    ImageRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType
  } from 'docx';
  import { saveAs } from 'file-saver';
  import QRCode from 'qrcode';
  import OrgSelect from '@/views/system/admin/components/org-select.vue';
  import type { Organization } from '@/api/system/organization/model';
  import Import from './Import.vue';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      // 全部部门
      organizationList: Organization[];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: GradeParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<HjmCarParam>({
    id: undefined,
    keywords: '',
    userId: undefined
  });

  // 导出加载状态
  const exportLoading = ref(false);
  const showImport = ref(false);

  // 新增
  const add = () => {
    emit('add');
  };

  const reload = () => {
    const isParent = props.organizationList.find(d => d.organizationId == where.organizationId);
    if(isParent){
      where.organizationParentId = isParent.organizationId;
      where.organizationId = undefined;
      emit('search', where);
    }else {
      emit('search', where);
    }
  };

  // 批量删除
  const removeBatch = () => {
    emit('remove');
  };

  /* 打开编辑弹窗 */
  const openImport = () => {
    showImport.value = true;
  };

  // 批量导出二维码到Word文档
  const handleExport = async () => {
    try {
      exportLoading.value = true;
      message.loading('正在生成二维码文档，请稍候...', 0);

      // 获取所有车辆数据
      const carList = await listHjmCar(where);

      if (!carList || carList.length === 0) {
        message.error('没有车辆数据可导出');
        return;
      }

      // 生成二维码图片
      const qrCodeImages: { dataUrl: string; carInfo: HjmCar }[] = [];

      for (const car of carList) {
        try {
          // 生成二维码（使用车辆ID作为内容，与现有功能保持一致）
          const qrCodeDataUrl = await QRCode.toDataURL(String(car.code), {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });

          qrCodeImages.push({ dataUrl: qrCodeDataUrl, carInfo: car });
        } catch (error) {
          console.error(`生成车辆 ${car.code} 的二维码失败:`, error);
        }
      }

      if (qrCodeImages.length === 0) {
        message.error('二维码生成失败');
        return;
      }

      // 尝试创建Word文档，如果失败则使用HTML方式
      try {
        await createWordDocument(qrCodeImages);
        message.destroy();
        message.success(`成功导出 ${qrCodeImages.length} 个车辆二维码`);
      } catch (docError) {
        console.warn('Word文档生成失败，使用HTML方式:', docError);
        createHtmlDocument(qrCodeImages);
        message.destroy();
        message.success(
          `成功生成 ${qrCodeImages.length} 个车辆二维码（HTML格式，可直接打印）`
        );
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.destroy();
      message.error('导出失败，请重试');
    } finally {
      exportLoading.value = false;
    }
  };

  // 创建Word文档
  const createWordDocument = async (
    qrCodeImages: { dataUrl: string; carInfo: HjmCar }[]
  ) => {
    const children: (Paragraph | Table)[] = [];

    // 添加标题
    children.push(
      new Paragraph({
        text: '车辆二维码清单',
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // 每行放置3个二维码，保持适当间距
    const itemsPerRow = 3;
    const rows = Math.ceil(qrCodeImages.length / itemsPerRow);

    for (let row = 0; row < rows; row++) {
      const startIndex = row * itemsPerRow;
      const endIndex = Math.min(startIndex + itemsPerRow, qrCodeImages.length);
      const rowItems = qrCodeImages.slice(startIndex, endIndex);

      // 创建表格行来放置二维码
      const qrCodeCells: TableCell[] = [];
      const infoCells: TableCell[] = [];

      for (let i = 0; i < itemsPerRow; i++) {
        if (i < rowItems.length) {
          const item = rowItems[i];

          // 将DataURL转换为Buffer
          const base64Data = item.dataUrl.split(',')[1];
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let j = 0; j < binaryData.length; j++) {
            bytes[j] = binaryData.charCodeAt(j);
          }

          qrCodeCells.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    // @ts-ignore
                    new ImageRun({
                      data: bytes,
                      transformation: {
                        width: 150,
                        height: 150
                      }
                    })
                  ],
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 33, type: WidthType.PERCENTAGE }
            })
          );

          infoCells.push(
            new TableCell({
              children: [
                new Paragraph({
                  // text: `车辆编号: ${item.carInfo.code || '未设置'}`,
                  text: `${item.carInfo.code || '未设置'}`,
                  alignment: AlignmentType.CENTER
                })
              ],
              width: { size: 33, type: WidthType.PERCENTAGE }
            })
          );
        } else {
          // 空单元格
          qrCodeCells.push(
            new TableCell({
              children: [new Paragraph({ text: '' })],
              width: { size: 33, type: WidthType.PERCENTAGE }
            })
          );
          infoCells.push(
            new TableCell({
              children: [new Paragraph({ text: '' })],
              width: { size: 33, type: WidthType.PERCENTAGE }
            })
          );
        }
      }

      // 添加表格
      children.push(
        new Table({
          rows: [
            new TableRow({
              children: qrCodeCells
            }),
            new TableRow({
              children: infoCells
            })
          ],
          width: { size: 100, type: WidthType.PERCENTAGE }
        })
      );

      // 添加行间距
      children.push(
        new Paragraph({
          text: '',
          spacing: { after: 400 }
        })
      );
    }

    // 创建文档
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: 'portrait',
                width: 11906, // A4宽度 (210mm)
                height: 16838 // A4高度 (297mm)
              },
              margin: {
                top: 1134, // 2cm
                right: 1134, // 2cm
                bottom: 1134, // 2cm
                left: 1134 // 2cm
              }
            }
          },
          children
        }
      ]
    });

    // 生成并下载文档
    try {
      const buffer = await Packer.toBlob(doc);
      const fileName = `车辆二维码清单_${new Date()
        .toISOString()
        .slice(0, 10)}.docx`;
      saveAs(buffer, fileName);
    } catch (error) {
      console.error('文档生成失败:', error);
      // 如果Packer.toBlob失败，尝试使用toBuffer
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const fileName = `车辆二维码清单_${new Date()
        .toISOString()
        .slice(0, 10)}.docx`;
      saveAs(blob, fileName);
    }
  };

  // 创建HTML文档（备用方案）
  const createHtmlDocument = (
    qrCodeImages: { dataUrl: string; carInfo: HjmCar }[]
  ) => {
    const itemsPerRow = 3;
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>车辆二维码清单</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(${itemsPerRow}, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .qr-item {
            text-align: center;
            page-break-inside: avoid;
          }
          .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 10px;
          }
          .qr-info {
            font-size: 12px;
            line-height: 1.4;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="title">车辆二维码清单</div>
        <div class="qr-grid">
    `;

    qrCodeImages.forEach((item) => {
      htmlContent += `
        <div class="qr-item">
          <img src="${item.dataUrl}" alt="QR Code" class="qr-code">
          <div class="qr-info">
            <div>车辆编号: ${item.carInfo.code || '未设置'}</div>
            <div>ID: ${item.carInfo.id}</div>
          </div>
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">打印文档</button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">关闭</button>
        </div>
      </body>
      </html>
    `;

    // 在新窗口中打开HTML文档
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } else {
      // 如果弹窗被阻止，创建下载链接
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const fileName = `车辆二维码清单_${new Date()
        .toISOString()
        .slice(0, 10)}.html`;
      saveAs(blob, fileName);
    }
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
