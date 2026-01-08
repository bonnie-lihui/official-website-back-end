import express from 'express';
import axios from 'axios';

const router = express.Router();

// 允许访问的源列表
const allowedOrigins = [
  'http://172.18.188.116:8080',
  'http://172.18.188.116:8081',
  'https://funny.baoyisi.com'
];

// CORS中间件函数
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
};

/**
 * 处理OPTIONS预检请求
 */
router.options('/', (req, res) => {
  setCorsHeaders(req, res);
  res.sendStatus(200);
});

/**
 * 白银商品数据接口
 * 获取融通金的白银商品数据
 */
router.get('/', async (req, res) => {
  // 设置CORS响应头
  setCorsHeaders(req, res);
  
  try {
    console.log('请求白银商品数据...');
    const response = await axios.get('https://app.rtjzj.com/api/m10432/64184ac1cafc3');
    
    const originalData = response.data;
    
    if (originalData && originalData.data && Array.isArray(originalData.data.data)) {
      // 过滤条件：gold_type === "3" 或 gold_type === 3（白银类）
      const filteredData = originalData.data.data.filter(item => 
        item.gold_type === "3" || item.gold_type === 3
      );
      
      // 优化返回结构，只保留指定字段
      const optimizedData = filteredData.map(item => ({
        stock: item.stock,                  // 库存
        sales_sum: item.sales_sum,          // 商品销量
        shop_price: item.shop_price,        // 商城价格
        cost_price: item.cost_price,        // 成本价
        price: item.price,                  // 实际售价
        discounts: item.discounts,          // 折扣信息
        weight: item.weight,                // 重量（克）
        labor_costs: item.labor_costs       // 工费
      }));
      
      // 字段说明对象
      const fieldDescriptions = {
        stock: "库存数量",
        sales_sum: "商品销量",
        shop_price: "商城价格",
        cost_price: "成本价",
        price: "实际售价",
        discounts: "折扣信息",
        weight: "商品重量（克）",
        labor_costs: "工费"
      };
      
      // 构建优化后的返回结构
      const result = {
        code: originalData.code,
        msg: originalData.msg,
        field_descriptions: fieldDescriptions,
        data: {
          total: optimizedData.length,
          data: optimizedData
        },
        time: originalData.time
      };
      
      res.json(result);
    } else {
      res.json(originalData);
    }
  } catch (error) {
    console.error('获取白银数据失败:', error.message);
    if (error.response) {
      // 目标服务器响应了错误
      res.status(error.response.status).json({
        error: '获取白银数据失败',
        status: error.response.status,
        data: error.response.data
      });
    } else {
      // 网络错误或其他错误
      res.status(500).json({
        error: '获取白银数据失败',
        message: error.message
      });
    }
  }
});

export default router;

