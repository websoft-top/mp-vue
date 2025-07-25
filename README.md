<div align="center">
  <h1>🚀 WebSoftAdmin 管理系统</h1>
  <p><strong>基于 Vue 3 + Vite + Ant Design Vue 的现代化管理后台</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Vue-3.5.3-4FC08D" alt="Vue">
    <img src="https://img.shields.io/badge/Vite-5.4.8-646CFF" alt="Vite">
    <img src="https://img.shields.io/badge/TypeScript-5.6.2-3178C6" alt="TypeScript">
    <img src="https://img.shields.io/badge/Ant%20Design%20Vue-3.2.11-0170FE" alt="Ant Design Vue">
    <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC" alt="TailwindCSS">
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  </p>
</div>

## 📖 项目简介

WebSoftAdmin 是一个基于 **Vue 3 + Vite + Ant Design Vue** 构建的现代化企业级管理后台系统，提供完整的后台管理解决方案：

- **核心框架**：Vue 3.5.3 + Vite 5.4.8 + TypeScript 5.6.2
- **UI组件库**：Ant Design Vue 3.2.11 + Ant Design Icons Vue
- **样式方案**：Less + TailwindCSS 3.4.17
- **状态管理**：Pinia 2.0.21
- **构建工具**：Vite + ESBuild
- **开发工具**：ESLint + Prettier + TypeScript

## 🎯 核心特性

- **🎨 现代化UI**：基于 Ant Design Vue 的精美界面设计
- **📱 响应式布局**：完美适配桌面端、平板和移动端
- **🔐 权限管理**：完整的 RBAC 权限控制体系
- **🌐 国际化**：内置中英文国际化支持
- **📊 数据可视化**：集成 ECharts 图表组件
- **🔧 插件系统**：灵活的插件扩展机制
- **💾 数据管理**：完整的 CRUD 操作和数据导入导出
- **🎯 多租户**：支持多租户架构



## 🌟 项目演示

| 项目信息 | 链接/说明 |
|---------|-----------|
| 🌐 **在线演示** | [https://mp.websoft.top](https://mp.websoft.top) |
| 👤 **演示账号** | 请联系开发者获取演示账号 |
| 🎯 **正式账号** | [立即注册](https://mp.websoft.top/register/?inviteCode=github) |
| 📱 **关注公众号** | ![WebSoft公众号](https://oss.wsdns.cn/20240327/f1175cc5aae741d3af05484747270bd5.jpeg?x-oss-process=image/resize,m_fixed,w_150/quality,Q_90) |

## 🛠️ 技术栈

### 核心框架
| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.3 | 渐进式 JavaScript 框架 |
| Vite | 5.4.8 | 下一代前端构建工具 |
| TypeScript | 5.6.2 | 类型安全的 JavaScript |
| Pinia | 2.0.21 | Vue 状态管理库 |
| Vue Router | 4.4.5 | Vue 官方路由管理器 |

### UI 组件库
| 技术 | 版本 | 说明 |
|------|------|------|
| Ant Design Vue | 3.2.11 | 企业级 UI 设计语言 |
| Ant Design Icons Vue | 6.1.0 | Ant Design 图标库 |
| EleAdminPro | 1.10.1 | 管理后台组件库 |

### 样式方案
| 技术 | 版本 | 说明 |
|------|------|------|
| Less | 4.2.0 | CSS 预处理器 |
| TailwindCSS | 3.4.17 | 原子化 CSS 框架 |
| PostCSS | 8.4.49 | CSS 后处理器 |

### 功能组件
- **Axios** - HTTP 请求库
- **Day.js** - 日期时间处理
- **ECharts** - 数据可视化图表
- **ByteMD** - Markdown 编辑器
- **TinyMCE** - 富文本编辑器
- **CryptoJS** - 加密解密工具
- **Socket.io** - 实时通信
- **QRCode** - 二维码生成
- **ExcelJS** - Excel 文件处理

## 📋 环境要求

### 基础环境
- 📦 **Node.js 16+** (推荐使用 Node.js 18+)
- 🌐 **现代浏览器** (Chrome 88+, Firefox 78+, Safari 14+)
- 💻 **操作系统** (Windows 10+, macOS 10.15+, Linux)

### 包管理器
- **npm** / **yarn** / **pnpm** (推荐使用 pnpm)

### 开发工具
- **推荐 IDE**：VS Code / WebStorm / IntelliJ IDEA
- **VS Code 插件**：
  - Vue Language Features (Volar)
  - TypeScript Vue Plugin (Volar)
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/websoft-top/mp-vue.git
cd mp-vue
```

### 2. 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置
复制环境配置文件并根据需要修改：
```bash
cp .env.example .env.development
```

编辑 `.env.development` 文件：
```bash
# 应用名称
VITE_APP_NAME=WebSoftAdmin

# API 配置
VITE_API_URL=https://your-api.com/api
VITE_SERVER_API_URL=https://your-server.com/api
VITE_DOMAIN=https://your-domain.com
VITE_FILE_SERVER=https://your-file-server.com

# 租户配置
VITE_TENANT_ID=your_tenant_id
VITE_TEMPLATE_ID=10258

# 应用密钥
VITE_APP_SECRET=your_app_secret

# 高德地图配置
VITE_MAP_KEY=your_map_key
VITE_MAP_CODE=your_map_security_code

# WebSoftAdmin 授权码
VITE_LICENSE_CODE=your_license_code

# 阿里云OSS配置
VUE_APP_OSS_ACCESS_KEY_ID=your_access_key_id
VUE_APP_OSS_ACCESS_KEY_SECRET=your_access_key_secret
```

### 4. 启动开发服务器
```bash
# 启动开发服务器
npm run dev

# 或使用其他包管理器
pnpm dev
yarn dev
```

访问 `http://localhost:5173` 查看应用

## ⚙️ 配置说明

### 项目配置文件
```
├── .env.example          # 环境变量示例文件
├── .env.development      # 开发环境配置
├── .env.production       # 生产环境配置
├── vite.config.ts        # Vite 构建配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.js    # TailwindCSS 配置
├── postcss.config.js     # PostCSS 配置
└── .eslintrc.js         # ESLint 配置
```

### 环境变量配置
项目使用 Vite 的环境变量系统，所有环境变量都以 `VITE_` 开头：

```bash
# API 配置
VITE_API_URL=https://api.example.com/api
VITE_SERVER_API_URL=https://server.example.com/api

# 应用配置
VITE_APP_NAME=WebSoftAdmin
VITE_TENANT_ID=your_tenant_id
VITE_TEMPLATE_ID=10258

# 第三方服务配置
VITE_MAP_KEY=your_amap_key
VITE_LICENSE_CODE=your_license_code
```

### 路径别名配置
项目已配置路径别名，可以使用以下方式导入：
```typescript
import Component from '@/components/Component'
import { request } from '@/utils/request'
import { useUserStore } from '@/store/modules/user'
import type { User } from '@/api/system/user/model'
```

### 样式配置
- **Less**: CSS 预处理器，支持嵌套、变量、混入等特性
- **TailwindCSS**: 原子化 CSS 框架，配置文件为 `tailwind.config.js`
- **PostCSS**: 自动处理 CSS 兼容性，配置文件为 `postcss.config.js`

## 🎯 核心功能

### 🔐 用户认证与权限管理
- **多种登录方式**：账号密码、手机验证码、微信扫码登录
- **RBAC 权限控制**：基于角色的访问控制，支持细粒度权限管理
- **组织架构管理**：支持多级组织架构和部门管理
- **用户管理**：用户信息管理、角色分配、状态控制
- **菜单权限**：动态菜单生成，按权限显示功能模块

### 📝 内容管理系统 (CMS)
- **文章管理**：支持富文本编辑、Markdown 编辑、文章分类
- **媒体管理**：图片、视频、文档等文件上传和管理
- **模板管理**：页面模板设计和管理
- **导航管理**：网站导航菜单配置
- **表单管理**：自定义表单创建和数据收集
- **多语言支持**：内容多语言管理

### 🛒 电商管理系统
- **商品管理**：商品信息、规格、库存、价格管理
- **订单管理**：订单处理、状态跟踪、发货管理
- **用户管理**：会员信息、等级、积分管理
- **营销工具**：优惠券、促销活动、推荐系统
- **数据统计**：销售数据、用户行为分析

### 🏢 企业应用模块
- **办公管理**：考勤、请假、审批流程
- **项目管理**：项目进度、任务分配、团队协作
- **财务管理**：收支记录、报表统计
- **客户管理**：客户信息、跟进记录、销售机会

### 📊 数据可视化与报表
- **仪表盘**：可自定义的数据仪表盘
- **图表组件**：基于 ECharts 的丰富图表类型
- **报表生成**：支持 Excel、PDF 等格式导出
- **实时数据**：WebSocket 实时数据更新

### 🔧 系统管理
- **系统设置**：基础配置、参数管理
- **日志管理**：操作日志、登录日志、系统日志
- **缓存管理**：Redis 缓存管理和清理
- **文件管理**：文件上传、存储、CDN 配置
- **数据字典**：系统字典数据管理
- **定时任务**：计划任务配置和监控

## 🏗️ 项目结构

```
├── public/                    # 静态资源目录
│   ├── favicon.ico           # 网站图标
│   ├── logo.png             # 应用 Logo
│   ├── tinymce/             # TinyMCE 编辑器资源
│   └── json/                # 静态 JSON 数据
├── src/                      # 源代码目录
│   ├── App.vue              # 根组件
│   ├── main.ts              # 应用入口文件
│   ├── api/                 # API 接口定义
│   │   ├── system/          # 系统管理相关 API
│   │   ├── cms/             # 内容管理相关 API
│   │   ├── shop/            # 商城管理相关 API
│   │   ├── user/            # 用户管理相关 API
│   │   ├── passport/        # 认证相关 API
│   │   └── index.ts         # API 统一导出
│   ├── assets/              # 静态资源
│   │   ├── icon/            # 图标文件
│   │   ├── img/             # 图片文件
│   │   └── logo.svg         # Logo 文件
│   ├── components/          # 公共组件
│   │   ├── SelectUser/      # 用户选择组件
│   │   ├── SelectFile/      # 文件选择组件
│   │   ├── TinymceEditor/   # 富文本编辑器
│   │   ├── ByteMdEditor/    # Markdown 编辑器
│   │   ├── QrCode/          # 二维码组件
│   │   └── ...              # 其他业务组件
│   ├── layout/              # 布局组件
│   │   ├── index.vue        # 主布局
│   │   └── components/      # 布局子组件
│   ├── router/              # 路由配置
│   │   ├── index.ts         # 路由实例
│   │   └── routes.ts        # 路由配置
│   ├── store/               # 状态管理 (Pinia)
│   │   ├── index.ts         # Store 入口
│   │   └── modules/         # Store 模块
│   │       ├── user.ts      # 用户状态
│   │       ├── theme.ts     # 主题状态
│   │       └── setting.ts   # 设置状态
│   ├── styles/              # 样式文件
│   │   ├── index.less       # 全局样式
│   │   ├── component.less   # 组件样式
│   │   └── transition/      # 过渡动画
│   ├── utils/               # 工具函数
│   │   ├── request.ts       # HTTP 请求封装
│   │   ├── common.ts        # 通用工具函数
│   │   ├── token-util.ts    # Token 处理工具
│   │   ├── permission.ts    # 权限处理工具
│   │   └── oss.js           # 文件上传工具
│   ├── views/               # 页面组件
│   │   ├── system/          # 系统管理页面
│   │   │   ├── user/        # 用户管理
│   │   │   ├── role/        # 角色管理
│   │   │   ├── menu/        # 菜单管理
│   │   │   └── setting/     # 系统设置
│   │   ├── cms/             # 内容管理页面
│   │   │   ├── cmsArticle/  # 文章管理
│   │   │   ├── cmsProduct/  # 产品管理
│   │   │   └── dashboard/   # CMS 仪表盘
│   │   ├── shop/            # 商城管理页面
│   │   │   ├── shopGoods/   # 商品管理
│   │   │   └── shopOrder/   # 订单管理
│   │   ├── passport/        # 认证页面
│   │   │   ├── login/       # 登录页面
│   │   │   └── register/    # 注册页面
│   │   └── user/            # 用户中心页面
│   ├── config/              # 配置文件
│   │   ├── menu.ts          # 菜单配置
│   │   └── setting.ts       # 应用设置
│   └── i18n/                # 国际化
│       ├── index.ts         # i18n 配置
│       └── lang/            # 语言包
├── .env.example             # 环境变量示例
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.js       # TailwindCSS 配置
├── postcss.config.js        # PostCSS 配置
├── .eslintrc.js            # ESLint 配置
└── package.json            # 项目依赖配置
```

## 🔧 开发规范

### 代码结构规范
- **Views**：页面组件，负责页面逻辑和 UI 展示
- **Components**：公共组件，可复用的 UI 组件
- **Composables**：组合式函数，封装业务逻辑
- **Utils**：工具函数，通用的功能函数
- **API**：接口定义，与后端 API 的交互
- **Store**：状态管理，全局状态和业务状态

### 命名规范
- **组件名**：使用大驼峰命名法（PascalCase）
- **文件名**：使用短横线命名法（kebab-case）
- **变量名**：使用小驼峰命名法（camelCase）
- **常量**：使用全大写，下划线分隔（CONSTANT_CASE）
- **CSS 类名**：使用短横线命名法（kebab-case）
- **接口名**：使用大驼峰命名法，以 I 开头（IUserInfo）

### Vue 3 开发规范
- 优先使用 Composition API
- 使用 `<script setup>` 语法糖
- 合理使用 `ref` 和 `reactive`
- 组件 props 使用 TypeScript 类型定义
- 使用 `defineEmits` 和 `defineProps`

### TypeScript 规范
- 优先使用接口（interface）定义类型
- 为函数参数和返回值添加类型注解
- 使用泛型提高代码复用性
- 避免使用 `any` 类型，使用 `unknown` 替代
- 使用类型断言时要谨慎

## 📚 构建与部署

### 构建命令
```bash
# 开发环境启动
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run serve

# 代码检查
npm run lint:eslint

# 清理缓存
npm run clean:cache

# 清理依赖
npm run clean:lib
```

### API 模块说明
项目 API 按功能模块组织，主要包括：

- **用户认证**：`src/api/passport/` - 登录、注册、权限验证
- **系统管理**：`src/api/system/` - 用户、角色、菜单、权限管理
- **内容管理**：`src/api/cms/` - 文章、产品、媒体文件管理
- **商城管理**：`src/api/shop/` - 商品、订单、用户管理
- **用户中心**：`src/api/user/` - 个人信息、余额、反馈管理

## 🚀 部署指南

### 生产环境构建
1. 配置生产环境变量：
   ```bash
   # 编辑 .env.production 文件
   VITE_API_URL=https://your-production-api.com/api
   VITE_SERVER_API_URL=https://your-production-server.com/api
   VITE_DOMAIN=https://your-production-domain.com
   ```

2. 构建生产版本：
   ```bash
   npm run build
   ```

3. 构建产物位于 `dist` 目录

### Nginx 部署配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理（可选）
    location /api {
        proxy_pass https://your-api-server.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 环境变量配置
生产环境需要配置以下关键环境变量：
- `VITE_API_URL`：后端 API 地址
- `VITE_TENANT_ID`：租户 ID
- `VITE_LICENSE_CODE`：授权码
- `VUE_APP_OSS_ACCESS_KEY_ID`：OSS 访问密钥
- `VUE_APP_OSS_ACCESS_KEY_SECRET`：OSS 访问密钥

## 🔧 常见问题

### 开发环境问题
1. **Node.js 版本问题**：确保使用 Node.js 16+ 版本
2. **依赖安装失败**：尝试清除缓存后重新安装
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```
3. **编译错误**：检查 TypeScript 配置和代码语法
4. **端口占用**：修改 `vite.config.ts` 中的端口配置

### 生产环境问题
1. **白屏问题**：检查路由配置和 Nginx 配置
2. **API 请求失败**：确认后端服务正常运行，检查跨域配置
3. **静态资源 404**：检查 `base` 配置和资源路径
4. **权限问题**：确认用户角色和菜单权限配置正确

### 性能优化建议
1. **代码分割**：使用动态导入进行路由懒加载
2. **图片优化**：使用 WebP 格式，启用图片懒加载
3. **请求优化**：合并 API 请求，使用缓存机制
4. **打包优化**：启用 Gzip 压缩，配置 CDN 加速

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

### 贡献方式
- 🐛 **Bug 报告**：发现问题请提交 Issue
- 💡 **功能建议**：有好的想法请提交 Feature Request
- 📝 **文档改进**：帮助完善项目文档
- 🔧 **代码贡献**：提交 Pull Request

### 贡献流程
1. **Fork 本仓库**到你的 GitHub 账号
2. **创建特性分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m 'feat: add amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **创建 Pull Request**

### 提交规范
请遵循 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 🌐 **官网**：[https://websoft.top](https://websoft.top)
- 📧 **邮箱**：170083662@qq.com
- 💬 **QQ群**：479713884
- 📱 **微信群**：扫描上方公众号二维码，回复"加群"

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Ant Design Vue](https://antdv.com/) - 企业级 UI 设计语言
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架

---

<div align="center">
  <p>⭐ 如果这个项目对您有帮助，请给我们一个星标！</p>
  <p>🚀 让我们一起构建更好的管理系统！</p>
</div>