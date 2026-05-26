# ssr-demo

Vue 3 服务端渲染（SSR）学习演示项目，包含**基础 SSR 渲染**和**同构渲染**两个示例，帮助开发者理解 Vue 3 SSR 的核心原理与实践方式。

## 项目简介

本项目通过两个由浅入深的示例，演示 Vue 3 服务端渲染的关键技术：

- **基础 SSR 示例**（`index.js`）：使用 Express 搭建服务端，通过 Vue 3 的 `createSSRApp` + `renderToString` 将组件渲染为 HTML 字符串并返回给客户端。展示了 SSR 的基本流程，以及为每个请求创建独立 Vue 实例以避免状态污染的重要性。
- **同构渲染示例**（`isomorphic-test.js`）：在基础 SSR 之上，实现了服务端数据预取（`asyncData`）和客户端激活（hydration）。服务端预取的数据通过 `window.__INITIAL_DATA__` 注入到页面中，客户端在 `mounted` 阶段优先读取该数据，避免重复请求，实现真正的同构渲染。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | ^3.5.34 | 前端框架，SSR 渲染 |
| [Express](https://expressjs.com/) | ^5.2.1 | Node.js 服务端框架 |
| ES Module | - | 模块系统（`"type": "module"`） |
| 浏览器原生 ESM (importmap) | - | 客户端 Vue 模块加载 |

## 环境要求

- **Node.js** >= 18.0.0（需支持 ES Module 及 `fetch` API）
- **npm** >= 8.0.0

## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/RedFox-BruceH/ssr-demo.git
cd ssr-demo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动服务

项目包含两个独立示例，可分别运行：

#### 基础 SSR 示例

```bash
node index.js
```

启动后访问 [http://localhost:3000/home](http://localhost:3000/home)

#### 同构渲染示例

```bash
node isomorphic-test.js
```

启动后访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 基础 SSR 示例（index.js）

该示例演示了 Vue 3 SSR 的最基础用法：

- 访问 `/home` — 渲染 Home Page
- 访问 `/about` — 渲染 About Page
- 访问其他路径 — 渲染 404 Page

**核心要点**：

- 每个请求通过 `createApp()` 创建独立的 Vue 实例，避免多请求共享同一实例导致的状态污染
- 使用 `renderToString` 将 Vue 组件渲染为 HTML 字符串，拼接到完整 HTML 页面中返回
- 此示例为纯服务端渲染，页面无客户端交互能力

### 同构渲染示例（isomorphic-test.js）

该示例在基础 SSR 之上增加了客户端激活（hydration）和数据预取能力：

- 访问 `/` — 展示随机狗狗图片列表

**核心要点**：

- **asyncData 数据预取**：`app.js` 中定义的 `asyncData` 方法会在服务端被调用，通过公开 API 获取随机狗狗图片
- **数据注入**：服务端将预取数据序列化为 JSON，通过 `window.__INITIAL_DATA__` 注入到 HTML 中
- **客户端 Hydration**：`client-entry.js` 调用 `createApp().mount("#app")` 对服务端渲染的 HTML 进行激活；组件在 `mounted` 钩子中优先读取 `window.__INITIAL_DATA__`，若不存在则重新调用 `asyncData` 获取数据
- **importmap**：通过浏览器原生 ESM importmap 引入 Vue，无需打包工具即可在客户端使用 ES Module

## 项目结构

```
ssr-demo/
├── app.js              # 共享的 Vue 应用工厂函数，定义组件及 asyncData 数据预取逻辑
├── client-entry.js     # 客户端入口文件，负责挂载 Vue 应用完成 hydration
├── index.js            # 基础 SSR 示例服务端，纯服务端渲染（无客户端激活）
├── isomorphic-test.js  # 同构渲染示例服务端，支持数据预取与客户端 hydration
├── package.json        # 项目配置与依赖声明
└── package-lock.json   # 依赖版本锁定
```

### 文件职责详述

| 文件 | 职责 |
|------|------|
| `app.js` | 导出 `createApp()` 工厂函数，包含狗狗图片列表组件定义、`asyncData` 数据预取方法、客户端 `mounted` 钩子中的数据恢复逻辑。服务端与客户端共享此模块 |
| `client-entry.js` | 客户端入口，调用 `createApp().mount("#app")` 将服务端渲染的静态 HTML 激活为可交互的 Vue 应用 |
| `index.js` | 基础 SSR 服务端，使用 `createSSRApp` + `renderToString` 实现纯服务端渲染，提供 `/home`、`/about` 路由及 404 兜底路由 |
| `isomorphic-test.js` | 同构渲染服务端，调用 `app.js` 的 `createApp` 创建应用，服务端执行 `asyncData` 预取数据，将数据注入 `window.__INITIAL_DATA__`，并通过 `express.static` 提供客户端入口文件 |

## 贡献指南

欢迎对本项目提出改进建议或贡献代码！

### 开发流程

1. **Fork** 本仓库
2. 基于 `main` 分支创建新的功能分支：`git checkout -b feature/your-feature`
3. 完成开发并确保代码可正常运行：`node index.js` 或 `node isomorphic-test.js`
4. 提交代码，编写清晰的 commit message
5. 推送分支并创建 **Pull Request**

### 代码规范

- 使用 ES Module 语法（`import` / `export`）
- 保持代码注释清晰，尤其是 SSR 相关的关键逻辑
- 新增示例应与现有文件结构保持一致

### 问题反馈

如发现 Bug 或有功能建议，请通过 [Issues](../../issues) 提交，并附带：

- 问题描述与复现步骤
- 运行环境（Node.js 版本、操作系统）
- 相关的错误日志或截图

## 许可证

[ISC](https://opensource.org/licenses/ISC)
