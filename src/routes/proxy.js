import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * 通用代理端点 - GET请求
 * 使用方式: /proxy?url=https://example.com/api/data
 */
router.get('/', async (req, res) => {
  try {
    const { url, ...params } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: '缺少目标URL参数' });
    }

    console.log(`转发GET请求到: ${url}`);
    
    const response = await axios.get(url, {
      params,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Request-Proxy-Server'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    handleProxyError(error, res);
  }
});

/**
 * 通用代理端点 - POST请求
 * 使用方式: /proxy?url=https://example.com/api/data
 */
router.post('/', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: '缺少目标URL参数' });
    }

    console.log(`转发POST请求到: ${url}`);
    
    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Request-Proxy-Server'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    handleProxyError(error, res);
  }
});

/**
 * 高级代理端点 - 支持自定义headers和方法
 */
router.all('/advanced', async (req, res) => {
  try {
    const { url, method = 'GET', customHeaders } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: '缺少目标URL参数' });
    }

    console.log(`转发${method}请求到: ${url}`);
    
    const headers = {
      'User-Agent': req.headers['user-agent'] || 'Request-Proxy-Server',
      ...customHeaders
    };

    const config = {
      method: method.toLowerCase(),
      url,
      headers,
      data: req.body.data || null,
      params: req.body.params || {}
    };

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleProxyError(error, res);
  }
});

/**
 * 错误处理函数
 */
function handleProxyError(error, res) {
  if (error.response) {
    // 目标服务器响应了错误状态码
    console.error(`代理错误 (${error.response.status}):`, error.response.data);
    res.status(error.response.status).json({
      error: '目标服务器错误',
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // 请求已发送但没有收到响应
    console.error('代理错误: 无响应', error.message);
    res.status(504).json({ error: '目标服务器无响应', message: error.message });
  } else {
    // 设置请求时出错
    console.error('代理错误:', error.message);
    res.status(500).json({ error: '代理请求失败', message: error.message });
  }
}

export default router;

