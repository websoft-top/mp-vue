# 📝 编辑器切换功能演示

## 🎯 功能概述

我已经成功为文章编辑组件实现了Markdown和富文本编辑器的切换功能，具有以下特点：

### ✨ 核心功能

1. **编辑器类型选择器**
   - 富文本编辑器（TinyMCE）：所见即所得，支持图片、视频、格式化
   - Markdown编辑器：轻量级标记语言，支持代码高亮

2. **智能切换机制**
   - 有内容时会提示用户确认切换
   - 自动进行基本的格式转换
   - 保存用户的编辑器偏好设置

3. **数据持久化**
   - 编辑器类型保存到数据库（editor字段：1=富文本，2=Markdown）
   - 本地存储用户偏好设置
   - 编辑时自动恢复用户选择的编辑器类型

### 🔧 技术实现

#### 1. 编辑器选择器UI
```vue
<div class="editor-selector-container">
  <div class="editor-selector">
    <span class="selector-label">编辑器类型：</span>
    <a-radio-group 
      v-model:value="editor" 
      @change="onEditorTypeChange"
      class="editor-radio-group"
    >
      <a-radio :value="1" class="editor-radio">
        <span class="radio-content">
          <span class="radio-icon">📝</span>
          <span class="radio-text">富文本编辑器</span>
          <span class="radio-desc">所见即所得，支持图片、视频、格式化</span>
        </span>
      </a-radio>
      <a-radio :value="2" class="editor-radio">
        <span class="radio-content">
          <span class="radio-icon">📋</span>
          <span class="radio-text">Markdown编辑器</span>
          <span class="radio-desc">轻量级标记语言，支持代码高亮</span>
        </span>
      </a-radio>
    </a-radio-group>
  </div>
</div>
```

#### 2. 切换处理逻辑
```typescript
const onEditorTypeChange = (e: any) => {
  const newEditorType = e.target.value;
  const oldEditorType = editor.value;
  
  // 如果有内容，提示用户确认切换
  if (content.value && content.value.trim() !== '' && content.value !== '<p><br></p>') {
    Modal.confirm({
      title: '🔄 切换编辑器类型',
      content: '切换编辑器类型可能会影响内容格式，是否继续？',
      okText: '确认切换',
      cancelText: '取消',
      onOk: () => {
        performEditorSwitch(newEditorType, oldEditorType);
      },
      onCancel: () => {
        editor.value = oldEditorType;
      }
    });
  } else {
    performEditorSwitch(newEditorType, oldEditorType);
  }
};
```

#### 3. 格式转换功能
```typescript
const convertContentFormat = (fromType: number, toType: number) => {
  if (fromType === 1 && toType === 2) {
    // 富文本转Markdown
    let markdownContent = content.value
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      // ... 更多转换规则
    content.value = markdownContent;
  } else if (fromType === 2 && toType === 1) {
    // Markdown转富文本
    let htmlContent = content.value
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // ... 更多转换规则
    content.value = htmlContent;
  }
};
```

#### 4. 偏好设置管理
```typescript
const initEditorPreference = () => {
  // 优先使用数据库中保存的编辑器类型
  if (form.editor && (form.editor === 1 || form.editor === 2)) {
    editor.value = form.editor;
  } else {
    // 使用本地存储的偏好
    const savedPreference = localStorage.getItem('cms_article_editor_preference');
    if (savedPreference && (savedPreference === '1' || savedPreference === '2')) {
      editor.value = parseInt(savedPreference);
    } else {
      editor.value = 1; // 默认富文本
    }
  }
};
```

### 🎨 样式设计

编辑器选择器采用了现代化的卡片设计：
- 渐变背景和阴影效果
- 清晰的图标和描述文字
- 响应式交互效果
- 与现有UI风格保持一致

### 📊 数据库字段

在CmsArticle模型中，`editor`字段用于保存编辑器类型：
- `1`: 富文本编辑器
- `2`: Markdown编辑器

### 🚀 使用方式

1. **新建文章**：系统会根据用户偏好自动选择编辑器类型
2. **编辑文章**：自动恢复文章创建时使用的编辑器类型
3. **切换编辑器**：用户可以随时切换，系统会智能处理格式转换
4. **保存文章**：编辑器类型会自动保存到数据库

### 💡 用户体验优化

- **智能提示**：切换前会提示可能的格式影响
- **格式转换**：自动进行基本的HTML↔Markdown转换
- **偏好记忆**：记住用户的编辑器选择偏好
- **无缝切换**：保持内容的连续性和一致性

这个功能让用户可以根据自己的习惯和需求选择最适合的编辑器，提供了更加灵活和人性化的编辑体验！
