# 官网后端服务

基于 Node.js 和 Express 的后端服务。

服务端目录: /www/wwwroot/official-website-back-end

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## 环境变量

创建 `.env` 文件：
```env
PORT=3001
NODE_ENV=development
```

## API 接口

### 健康检查
```
GET /health
```

### 白银商品数据
```
GET /silver
```

返回融通金的白银商品数据。

## 许可证

MIT
