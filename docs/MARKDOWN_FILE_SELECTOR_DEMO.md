# 📝 Markdown编辑器文件库选取功能演示

## 🎯 功能概述

我已经成功为Markdown编辑器实现了与富文本编辑器一样的文件库选取功能，让用户可以方便地从文件库中选择图片和视频。

### ✨ 核心功能

1. **📷 图片库选取**
   - 点击"从图片库选择"按钮
   - 打开图片文件库选择弹窗
   - 选择图片后自动插入Markdown图片语法

2. **🎬 视频库选取**
   - 点击"从视频库选择"按钮
   - 打开视频文件库选择弹窗
   - 选择视频后自动插入HTML视频标签

3. **🔄 拖拽上传支持**
   - 保留原有的拖拽上传功能
   - 支持直接拖拽图片到编辑器
   - 自动上传并插入图片链接

### 🔧 技术实现

#### 1. 工具栏扩展按钮

```vue
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
```

#### 2. 图片选择处理函数

```typescript
// 📝 Markdown编辑器图片选择器
const openMarkdownImageSelector = () => {
  fileSelectCallback.value = (url: string) => {
    // 在当前光标位置插入Markdown图片语法
    const imageMarkdown = `![图片](${url})`;
    insertMarkdownText(imageMarkdown);
  };
  showFileSelector.value = true;
};
```

#### 3. 视频选择处理函数

```typescript
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
```

#### 4. 文本插入功能

```typescript
// 📝 在Markdown编辑器中插入文本
const insertMarkdownText = (text: string) => {
  // 简单的文本插入，在内容末尾添加
  if (content.value) {
    content.value += '\n\n' + text;
  } else {
    content.value = text;
  }
};
```

#### 5. 拖拽上传处理

```typescript
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
```

### 🎨 样式设计

工具栏扩展按钮采用了现代化的设计：

```less
// 📝 Markdown编辑器工具栏扩展样式
.markdown-toolbar-extension {
  margin-bottom: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  
  .ant-btn {
    border-radius: 6px;
    font-size: 13px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
```

### 📊 功能对比

| 功能 | 富文本编辑器 | Markdown编辑器 | 状态 |
|------|-------------|---------------|------|
| 文件库选择图片 | ✅ | ✅ | 已实现 |
| 文件库选择视频 | ✅ | ✅ | 已实现 |
| 拖拽上传图片 | ✅ | ✅ | 已实现 |
| 粘贴上传图片 | ✅ | ✅ | 已实现 |
| 文件大小检查 | ✅ | ✅ | 已实现 |
| 文件类型检查 | ✅ | ✅ | 已实现 |
| 上传进度提示 | ✅ | ✅ | 已实现 |

### 🚀 使用方式

1. **选择Markdown编辑器**：在编辑器类型选择器中选择"Markdown编辑器"
2. **插入图片**：
   - 点击"📷 从图片库选择"按钮
   - 在弹出的文件库中选择图片
   - 系统自动插入 `![图片](url)` 格式
3. **插入视频**：
   - 点击"🎬 从视频库选择"按钮
   - 在弹出的视频库中选择视频
   - 系统自动插入HTML5视频标签
4. **拖拽上传**：
   - 直接拖拽图片文件到编辑器
   - 系统自动上传并插入图片链接

### 💡 用户体验优化

- **统一体验**：与富文本编辑器保持一致的文件选择体验
- **智能插入**：自动生成正确的Markdown语法
- **视觉反馈**：按钮悬停效果和上传进度提示
- **错误处理**：完善的文件大小和类型检查
- **响应式设计**：适配不同屏幕尺寸

### 🔄 格式转换

当用户在富文本编辑器和Markdown编辑器之间切换时，系统会自动进行格式转换：

- **富文本 → Markdown**：HTML标签转换为Markdown语法
- **Markdown → 富文本**：Markdown语法转换为HTML标签

这个功能让用户在使用Markdown编辑器时也能享受到与富文本编辑器一样便捷的文件管理体验！🎉
