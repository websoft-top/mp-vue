<div align="center">
  <h1>🌐 WebSoftAdmin</h1>
  <p><strong>基于 Vue 3 + Ant Design Vue 的企业级后台管理系统</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Vue-3.x-4FC08D" alt="Vue">
    <img src="https://img.shields.io/badge/Ant%20Design%20Vue-3.x-1890FF" alt="Ant Design Vue">
    <img src="https://img.shields.io/badge/TypeScript-4.x-3178C6" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-4.x-646CFF" alt="Vite">
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  </p>
</div>

## 📖 项目简介

WebSoftAdmin 是一个基于 **Vue 3 + Ant Design Vue** 构建的现代化企业级后台管理系统，采用最新的前端技术栈：

- **前端框架**：Vue 3 + TypeScript + Vite
- **UI 组件库**：Ant Design Vue 3.x
- **富文本编辑器**：TinyMCE（支持图片/视频上传、一键排版）
- **图表库**：ECharts + G2
- **工具库**：Lodash、Day.js、CryptoJS



## 项目演示
| 后台管理系统     | https://mp.websoft.top                                                                                                              |
|--------|-------------------------------------------------------------------------------------------------------------------------------------|
| 账号密码   | [立即注册](https://mp.websoft.top/register/?inviteCode=github)                                                                          |
| 关注公众号  | ![输入图片说明](https://oss.wsdns.cn/20240327/f1175cc5aae741d3af05484747270bd5.jpeg?x-oss-process=image/resize,m_fixed,w_150/quality,Q_90) |




## 🛠️ 技术栈

### 核心技术
| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.x | 渐进式 JavaScript 框架 |
| TypeScript | 4.x | JavaScript 的超集 |
| Vite | 4.x | 下一代前端构建工具 |
| Ant Design Vue | 3.2.11 | 企业级 UI 设计语言 |
| EleAdmin Pro | 1.10.1 | 企业级组件库 |

### 功能组件
- **TinyMCE** - 富文本编辑器，支持图片/视频上传
- **ECharts** - 数据可视化图表库
- **CropperJS** - 图片裁剪组件
- **ExcelJS** - Excel 文件处理
- **Ali OSS** - 阿里云对象存储

## 📋 环境要求

### 基础环境
- 🟢 **Node.js 16+**
- 📦 **npm 8+ / yarn 1.22+**
- 🌐 **现代浏览器**（Chrome 63+、Firefox、Safari、Edge）

### 开发工具
- **推荐**：VS Code / WebStorm
- **插件**：Vetur / Volar（Vue 3 支持）

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/websoft-top/mp-vue.git
cd mp-vue
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入您的配置信息
# 注意：请不要将 .env 文件提交到版本控制系统
```

### 4. 启动开发服务器
```bash
# 开发模式
npm run dev

# 或
yarn dev
```

访问 `http://localhost:3000` 即可看到管理后台。

### 5. 构建生产版本
```bash
# 生产构建
npm run build

# 预览构建结果
npm run serve
```

## ⚙️ 环境变量配置

项目使用环境变量来管理敏感信息和配置。请按照以下步骤配置：

### 必需配置
```bash
# API 配置
VITE_API_URL=https://your-api.com/api          # 后端 API 地址
VITE_SERVER_API_URL=https://your-server.com/api # 服务端 API 地址
VITE_FILE_SERVER=https://your-file-server.com   # 文件服务器地址

# 应用配置
VITE_APP_SECRET=your_app_secret                 # 应用密钥
VITE_TENANT_ID=your_tenant_id                  # 租户 ID
```

### 可选配置
```bash
# 高德地图 (如需使用地图功能)
VITE_MAP_KEY=your_map_key                      # 高德地图 Key
VITE_MAP_CODE=your_map_security_code           # 高德地图安全密钥

# WebSoftAdmin 授权 (商业版功能)
VITE_LICENSE_CODE=your_license_code            # 授权码
```

### 获取配置信息
- **高德地图密钥**：访问 [高德开放平台](https://lbs.amap.com/) 申请
- **WebSoftAdmin 授权码**：联系 [官方网站](https://websoft.top/) 获取
- **其他 API 配置**：根据您的后端服务配置

## 🎯 核心功能

### 📝 内容管理系统
- **文章管理**：支持富文本编辑、图片/视频上传
- **一键排版**：智能文章格式优化，包含10种专业排版样式
- **媒体库**：图片/视频文件管理，支持分组和搜索
- **首行缩进**：中文段落格式智能切换

### 🛒 商城管理
- **商品管理**：商品信息编辑、规格设置
- **订单管理**：订单流程跟踪
- **库存管理**：商品库存监控

### 👥 用户权限
- **用户管理**：用户信息维护
- **角色权限**：基于角色的访问控制
- **菜单管理**：动态菜单配置

## 🎨 富文本编辑器特色功能

### 📸 媒体上传
- **图片上传**：支持拖拽、粘贴、文件选择
- **视频上传**：支持多种视频格式
- **媒体库**：统一的媒体文件管理
- **OSS 存储**：阿里云对象存储集成

### ✨ 智能排版
- **一键排版**：10种专业排版优化
- **首行缩进**：中文段落格式切换
- **样式优化**：标题、段落、列表、表格等元素美化
- **响应式**：适配不同屏幕尺寸

## 🏗️ 项目结构

```
src/
├── components/          # 公共组件
├── views/              # 页面组件
│   ├── cms/           # 内容管理
│   ├── shop/          # 商城管理
│   └── system/        # 系统管理
├── router/            # 路由配置
├── store/             # 状态管理
├── utils/             # 工具函数
└── assets/            # 静态资源
```