# 广州咖啡手册

一个围绕广州咖啡馆的探店手册站点，采用手绘风格，展示不同街区的咖啡馆，并提供完整的 HTTP API 进行数据管理。

**线上地址**：https://guangzhou-cafe-guide.pages.dev

---

## 项目简介

广州咖啡手册最初是一份写死在代码里的咖啡馆数据，后来逐步被改造为：

1. 数据与代码分离
2. 提供可视化数据管理后台
3. 提供实时 HTTP API
4. 后端接入 Supabase PostgreSQL 数据库
5. 部署到 Cloudflare Pages + Pages Functions

现在它既是一个可浏览的咖啡探店站点，也是一个可线上访问的 API 服务。

---

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS |
| 后端 API | Hono + Cloudflare Pages Functions |
| 数据库 | Supabase PostgreSQL |
| 部署 | Cloudflare Pages + wrangler CLI |

---

## 项目结构

```
guangzhou-cafe-guide/
├── src/                    # 前端 React 页面与组件
│   ├── pages/              # 页面：首页、探店、详情、管理、API 文档、作业、部署
│   └── components/         # 公共组件
├── api/                    # 本地 Express 后端（开发环境可选）
│   ├── lib/db.ts           # Supabase 数据层工厂函数
│   ├── routes/cafes.ts     # Express 路由
│   └── data/seed.json      # 默认种子数据
├── functions/              # Cloudflare Pages Functions
│   ├── api/[[route]].ts    # Hono API 入口
│   ├── lib/db.ts           # Cloudflare 复用的数据层
│   └── data/seed.json      # Cloudflare 使用的种子数据
├── supabase/               # 数据库迁移文件
├── shared/types.ts         # 共享类型定义
└── dist/                   # Vite 构建输出（被 .gitignore 忽略）
```

---

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入你的 Supabase 项目信息：

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> 注意：`SUPABASE_SERVICE_ROLE_KEY` 是服务端密钥，不要提交到代码仓库，也不要暴露给前端。

### 3. 启动开发环境

```bash
# 只跑前端（Vite dev server，会代理 /api 到 localhost:3001）
npm run dev

# 只跑本地 Express 后端
export $(cat .env | xargs)
npm run server

# 前后端一起跑
npm run dev:all
```

开发时前端默认地址：http://localhost:5173  
本地后端默认地址：http://localhost:3001

---

## 部署到 Cloudflare

### 1. 安装 wrangler 并登录

```bash
npm install -D wrangler
npx wrangler login
```

### 2. 构建前端

```bash
npm run build
```

### 3. 部署到 Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name guangzhou-cafe-guide --branch main
```

### 4. 设置环境变量

在 Cloudflare 中配置 Supabase 连接信息：

```bash
npx wrangler pages secret put SUPABASE_URL --project-name guangzhou-cafe-guide
npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name guangzhou-cafe-guide
```

---

## API 端点

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/districts` | 获取所有街区 |
| GET | `/api/cafes` | 获取所有咖啡馆 |
| GET | `/api/cafes/:slug` | 获取单个咖啡馆详情 |
| POST | `/api/cafes` | 新增咖啡馆 |
| PUT | `/api/cafes/:id` | 更新咖啡馆 |
| DELETE | `/api/cafes/:id` | 删除咖啡馆 |
| POST | `/api/reset` | 重置为默认种子数据 |

详细请求/响应格式请参考站点内的 **API 文档** 页面。

---

## 为什么使用数据库而不是 JSON 文件？

本地开发时，用 JSON 文件保存数据完全可以，Express 读取文件并返回 JSON 就是一套完整的 API。

但部署到 Cloudflare、Vercel、Netlify 等 Serverless 平台时，JSON 文件写入会失败，因为：

- **文件系统只读**：部署包被视为只读产物，运行时不能修改。
- **无状态多实例**：平台可能同时运行多个实例，A 实例写入的本地文件，B 实例看不到。
- **生命周期短**：函数实例用完后会被销毁，即使允许写入，数据也留不住。

因此，广州咖啡手册选择使用 **Supabase PostgreSQL** 作为持久化数据库。学生作业仍然可以只用本地 JSON 文件，但广州咖啡手册本身要能上线，必须使用数据库。

---

## 课程作业

本项目同时作为课程作业模板。学生需要：

1. 使用 API 新增一条带自己姓名的数据
2. 调用 GET API 获取数据并完成分析/可视化/推荐
3. 基于 5 个主题之一构建自己的 API 站点（至少 3 个端点 + API 文档）

具体要求请参考站点内的 **作业** 页面。

---

## 许可证

MIT
