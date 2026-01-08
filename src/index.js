import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proxyRouter from './routes/proxy.js';
import silverRouter from './routes/silver/index.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.set('port', PORT);

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 白银商品路由
app.use('/silver', silverRouter);

// 代理路由
app.use('/proxy', proxyRouter);

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '路由不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误', 
    message: err.message 
  });
});


// 启动服务器 - 自动获取IP以支持局域网访问
const server = app.listen(app.get('port'), '0.0.0.0', function() {
  const actualPort = server.address().port;
  console.log(`🚀 服务器运行在:`);
  console.log(`   - 本地访问: http://localhost:${actualPort}`);
});