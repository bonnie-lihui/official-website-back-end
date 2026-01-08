# 请求代理服务器 (Request Proxy Server)

[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

一个基于 Node.js 和 Express 的轻量级 HTTP 请求代理服务器，用于处理和转发各类 HTTP 请求，支持跨域请求、自定义请求头等功能。

## 📑 目录

- [功能特点](#功能特点)
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [API接口](#api接口)
- [使用示例](#使用示例)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [注意事项](#注意事项)
- [常见问题](#常见问题)
- [许可证](#许可证)

## ✨ 功能特点

- ✅ 支持所有 HTTP 方法（GET、POST、PUT、DELETE 等）
- ✅ 支持跨域请求 (CORS)
- ✅ 实时请求日志记录
- ✅ 完善的错误处理机制
- ✅ 支持自定义请求头
- ✅ 支持查询参数转发
- ✅ 环境变量配置
- ✅ 简单和高级两种代理模式
- ✅ 健康检查端点

## 🔧 系统要求

### Node.js 版本
- **最低要求**: Node.js >= 16.0.0
- **推荐版本**: Node.js 18.x 或更高
- **原因**: 项目使用 ES Module (type: "module")

### 检查 Node.js 版本
```bash
node --version
```

如果版本低于 16.0.0，请前往 [Node.js 官网](https://nodejs.org/) 下载最新的 LTS 版本。

### 依赖包
- Express ^4.18.2 - Web 应用框架
- Axios ^1.6.0 - HTTP 客户端
- dotenv ^16.3.1 - 环境变量管理
- cors ^2.8.5 - 跨域资源共享

### 开发依赖
- nodemon ^3.1.11 - 开发时自动重启服务器

## 🚀 快速开始

### 1. 克隆或下载项目
```bash
git clone <repository-url>
cd request-proxy-server
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量（可选）
创建 `.env` 文件：
```bash
# 复制模板文件
cp env.example.txt .env

# 或手动创建
touch .env
```

然后编辑 `.env` 文件并添加以下内容：
```env
PORT=3000
NODE_ENV=development
```

### 4. 启动服务

#### 开发模式（推荐）
使用 nodemon 自动监控文件变化并重启服务器：
```bash
npm run dev
```
> nodemon 会监控 `src/` 目录下的所有 `.js` 和 `.json` 文件，文件修改后自动重启

#### 生产模式
```bash
npm start
```

### 5. 验证服务
访问健康检查端点：
```bash
curl http://localhost:3000/health
```

成功响应：
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T10:00:00.000Z"
}
```

## ⚙️ 配置说明

### 环境变量

在项目根目录创建 `.env` 文件进行配置：

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `PORT` | 服务器监听端口 | 3000 | 3000 |
| `NODE_ENV` | 运行环境 | development | production |

### .env 示例
```env
# 服务器端口
PORT=3000

# 运行环境: development 或 production
NODE_ENV=development
```

## 📡 API接口

### 1. 健康检查

**端点**: `GET /health`

**描述**: 检查服务器运行状态

**请求示例**:
```bash
curl http://localhost:3000/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T10:00:00.000Z"
}
```

---

### 2. 简单代理 - GET 请求

**端点**: `GET /proxy`

**描述**: 转发 GET 请求到目标 URL

**参数**:
- `url` (必需): 目标 URL
- 其他查询参数会自动转发到目标 URL

**请求示例**:
```bash
# 基础请求
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1"

# 带查询参数
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts&userId=1"
```

**响应**: 返回目标服务器的响应内容

---

### 3. 简单代理 - POST 请求

**端点**: `POST /proxy`

**描述**: 转发 POST 请求到目标 URL

**参数**:
- `url` (必需): 目标 URL（通过查询参数传递）
- 请求体会原样转发到目标 URL

**请求示例**:
```bash
curl -X POST "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试标题",
    "body": "测试内容",
    "userId": 1
  }'
```

---

### 4. 高级代理（自定义配置）

**端点**: `POST /proxy/advanced`

**描述**: 支持完全自定义的代理请求，可指定 HTTP 方法、自定义请求头等

**请求体参数**:
```typescript
{
  url: string,           // 必需：目标 URL
  method: string,        // 可选：HTTP 方法 (GET/POST/PUT/DELETE等)，默认 GET
  customHeaders: object, // 可选：自定义请求头
  data: object,          // 可选：请求体数据
  params: object         // 可选：查询参数
}
```

**请求示例**:

#### 带自定义请求头的 POST 请求
```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.example.com/data",
    "method": "POST",
    "customHeaders": {
      "Authorization": "Bearer your-token-here",
      "X-Custom-Header": "custom-value"
    },
    "data": {
      "key": "value"
    }
  }'
```

#### PUT 请求示例
```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "PUT",
    "data": {
      "id": 1,
      "title": "更新的标题",
      "body": "更新的内容",
      "userId": 1
    }
  }'
```

#### DELETE 请求示例
```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "DELETE"
  }'
```

## 💡 使用示例

### 测试 JSONPlaceholder API

```bash
# 获取单篇文章
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1"

# 获取所有文章
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts"

# 创建新文章
curl -X POST "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新文章",
    "body": "文章内容",
    "userId": 1
  }'
```

### 使用 GitHub API

```bash
# 获取 GitHub 用户信息
curl "http://localhost:3000/proxy?url=https://api.github.com/users/github"
```

### 更多示例

查看 [EXAMPLES.md](./EXAMPLES.md) 文件获取更多详细示例。

## 📂 项目结构

```
request-proxy-server/
├── src/
│   ├── index.js              # 主入口文件，Express 服务器配置
│   └── routes/
│       └── proxy.js          # 代理路由处理逻辑
├── node_modules/             # 依赖包目录（自动生成）
├── .env                      # 环境变量配置文件（需手动创建）
├── .gitignore               # Git 忽略文件配置
├── package.json             # 项目配置和依赖声明
├── package-lock.json        # 依赖版本锁定文件
├── README.md                # 项目说明文档（本文件）
└── EXAMPLES.md              # 详细使用示例
```

### 核心文件说明

- **src/index.js**: 
  - Express 应用初始化
  - 中间件配置 (CORS、JSON 解析、日志)
  - 路由注册
  - 错误处理

- **src/routes/proxy.js**:
  - 简单代理逻辑 (GET/POST)
  - 高级代理逻辑 (自定义配置)
  - 请求转发和响应处理

## 🛠️ 开发指南

### 开发环境设置

1. **安装 Node.js**
   - 访问 [Node.js 官网](https://nodejs.org/)
   - 下载并安装 LTS 版本（推荐 18.x 或 20.x）

2. **验证安装**
   ```bash
   node --version  # 应显示 v16.0.0 或更高
   npm --version   # 应显示 npm 版本
   ```

3. **克隆并设置项目**
   ```bash
   git clone <repository-url>
   cd request-proxy-server
   npm install
   ```

### 开发流程

1. **启动开发服务器**
   ```bash
   npm run dev
   ```
   > 使用 nodemon，代码修改后自动重启

2. **测试 API**
   - 使用 curl、Postman 或浏览器测试接口
   - 查看控制台日志了解请求状态

3. **代码修改**
   - 修改 `src/index.js` 或 `src/routes/proxy.js`
   - 服务器自动重启，无需手动操作

### npm 脚本说明

```json
{
  "start": "node src/index.js",           // 生产模式启动
  "dev": "nodemon src/index.js",          // 开发模式（使用 nodemon 自动重启）
  "test": "node src/index.js"             // 测试模式
}
```

### nodemon 配置

项目包含 `nodemon.json` 配置文件：
- **监控目录**: `src/`
- **监控文件**: `.js`, `.json`
- **忽略文件**: 测试文件和 `node_modules`
- **重启延迟**: 1秒

### 日志说明

服务器会自动记录以下信息：
```
[2026-01-05T10:00:00.000Z] GET /health
[2026-01-05T10:00:05.000Z] GET /proxy?url=https://api.example.com
代理请求到: https://api.example.com
```

## ⚠️ 注意事项

### 安全提示

1. **不要在生产环境直接使用**
   - 本项目是一个基础的代理服务器
   - 缺少身份验证和授权机制
   - 缺少请求速率限制
   - 可能被滥用作为开放代理

2. **敏感信息保护**
   - 不要在 URL 或请求头中暴露 API 密钥
   - 建议在服务器端配置敏感凭证
   - 使用环境变量管理敏感配置

3. **目标 URL 验证**
   - 确保目标 URL 是可信的
   - 建议添加 URL 白名单机制
   - 防止 SSRF（服务器端请求伪造）攻击

### 生产环境建议

如需在生产环境使用，建议添加：

- ✅ **身份验证**: 如 JWT、API Key
- ✅ **速率限制**: 使用 `express-rate-limit`
- ✅ **请求验证**: 验证和清理输入
- ✅ **日志持久化**: 使用 `winston` 或 `pino`
- ✅ **监控和告警**: 集成 APM 工具
- ✅ **HTTPS**: 使用反向代理（如 Nginx）
- ✅ **错误追踪**: 如 Sentry
- ✅ **URL 白名单**: 限制可访问的目标域名

### 常见问题

#### 1. 服务器无法启动

**错误**: `Error: Cannot find module 'express'`

**解决方案**:
```bash
npm install
```

---

#### 2. Node 版本过低

**错误**: `SyntaxError: Cannot use import statement outside a module`

**解决方案**:
升级 Node.js 到 16.0.0 或更高版本

---

#### 3. 端口被占用

**错误**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
- 修改 `.env` 文件中的 `PORT` 值
- 或者关闭占用端口的进程

查找占用进程（macOS/Linux）:
```bash
lsof -i :3000
kill -9 <PID>
```

查找占用进程（Windows）:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

#### 4. CORS 错误

如果从浏览器访问时遇到 CORS 错误，本服务已经配置了 CORS 中间件，应该不会出现此问题。如果仍有问题，请检查：
- 目标服务器是否支持 CORS
- 是否需要特定的请求头

---

#### 5. 目标 API 返回 401/403

确保：
- API 密钥或令牌正确
- 使用 `/proxy/advanced` 端点传递 Authorization 请求头
- 检查目标 API 的认证要求

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 📚 相关资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [Express 官方文档](https://expressjs.com/)
- [Axios 官方文档](https://axios-http.com/)
- [CORS 说明](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

## 🔗 相关链接

- 项目详细示例: [EXAMPLES.md](./EXAMPLES.md)

---

**最后更新**: 2026-01-05

如有问题或建议，欢迎联系维护者。