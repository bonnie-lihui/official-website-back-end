# 请求示例 (Request Examples)

本文档提供了详细的使用示例，帮助您快速了解如何使用代理服务器。

## 目录

1. [健康检查](#1-健康检查)
2. [GET 请求代理示例](#2-get请求代理示例)
3. [POST 请求代理示例](#3-post请求代理示例)
4. [高级代理示例](#4-高级代理示例自定义配置)
5. [实际 API 使用示例](#5-实际api使用示例)
6. [JavaScript/Node.js 示例](#6-javascriptnodejs-示例)
7. [Python 示例](#7-python-示例)

---

## 1. 健康检查

检查服务器是否正常运行。

```bash
curl http://localhost:3000/health
```

**预期响应**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T10:00:00.000Z"
}
```

---

## 2. GET请求代理示例

### 2.1 获取单个资源

```bash
# 获取单个文章
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1"
```

**预期响应**:
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident...",
  "body": "quia et suscipit..."
}
```

---

### 2.2 获取所有资源

```bash
# 获取所有文章
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts"
```

---

### 2.3 带查询参数的请求

```bash
# 根据 userId 筛选文章
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts&userId=1"
```

> **说明**: `userId=1` 会被自动转发到目标 URL

---

## 3. POST请求代理示例

### 3.1 创建新文章

```bash
curl -X POST "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试标题",
    "body": "这是测试内容",
    "userId": 1
  }'
```

**预期响应**:
```json
{
  "title": "测试标题",
  "body": "这是测试内容",
  "userId": 1,
  "id": 101
}
```

---

### 3.2 创建评论

```bash
curl -X POST "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "name": "测试用户",
    "email": "test@example.com",
    "body": "这是一条测试评论"
  }'
```

---

## 4. 高级代理示例（自定义配置）

高级代理端点允许您完全控制请求的各个方面。

### 4.1 带自定义请求头的 POST 请求

```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "POST",
    "customHeaders": {
      "Authorization": "Bearer your-token-here",
      "X-Custom-Header": "custom-value"
    },
    "data": {
      "title": "带授权的文章",
      "body": "这篇文章通过自定义请求头发送",
      "userId": 1
    }
  }'
```

---

### 4.2 PUT 请求示例

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

**预期响应**:
```json
{
  "id": 1,
  "title": "更新的标题",
  "body": "更新的内容",
  "userId": 1
}
```

---

### 4.3 DELETE 请求示例

```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "DELETE"
  }'
```

**预期响应**: 空对象 `{}`

---

### 4.4 带查询参数的 GET 请求

```bash
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "params": {
      "userId": 1,
      "_limit": 5
    }
  }'
```

---

## 5. 实际API使用示例

### 5.1 GitHub API

#### 获取用户信息
```bash
curl "http://localhost:3000/proxy?url=https://api.github.com/users/github"
```

#### 获取仓库信息
```bash
curl "http://localhost:3000/proxy?url=https://api.github.com/repos/nodejs/node"
```

---

### 5.2 天气 API 示例

```bash
# 注意：需要替换为实际的 API key
curl -X POST "http://localhost:3000/proxy/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.openweathermap.org/data/2.5/weather",
    "method": "GET",
    "params": {
      "q": "Beijing",
      "appid": "YOUR_API_KEY",
      "units": "metric",
      "lang": "zh_cn"
    }
  }'
```

---

### 5.3 REST Countries API

```bash
# 获取中国的信息
curl "http://localhost:3000/proxy?url=https://restcountries.com/v3.1/name/china"

# 获取所有国家
curl "http://localhost:3000/proxy?url=https://restcountries.com/v3.1/all"
```

---

## 6. JavaScript/Node.js 示例

### 6.1 使用 fetch (浏览器或 Node.js 18+)

```javascript
// 简单 GET 请求
async function simpleGet() {
  const response = await fetch(
    'http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1'
  );
  const data = await response.json();
  console.log(data);
}

// 简单 POST 请求
async function simplePost() {
  const response = await fetch(
    'http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '新文章',
        body: '文章内容',
        userId: 1,
      }),
    }
  );
  const data = await response.json();
  console.log(data);
}

// 高级代理请求
async function advancedRequest() {
  const response = await fetch('http://localhost:3000/proxy/advanced', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://api.github.com/users/github',
      method: 'GET',
      customHeaders: {
        'User-Agent': 'My-App/1.0',
      },
    }),
  });
  const data = await response.json();
  console.log(data);
}
```

---

### 6.2 使用 axios

```javascript
const axios = require('axios');

// 简单 GET 请求
async function simpleGet() {
  const response = await axios.get('http://localhost:3000/proxy', {
    params: {
      url: 'https://jsonplaceholder.typicode.com/posts/1',
    },
  });
  console.log(response.data);
}

// 高级代理请求
async function advancedRequest() {
  const response = await axios.post('http://localhost:3000/proxy/advanced', {
    url: 'https://api.github.com/users/github',
    method: 'GET',
    customHeaders: {
      'User-Agent': 'My-App/1.0',
    },
  });
  console.log(response.data);
}
```

---

## 7. Python 示例

### 7.1 使用 requests 库

```python
import requests
import json

# 简单 GET 请求
def simple_get():
    response = requests.get(
        'http://localhost:3000/proxy',
        params={
            'url': 'https://jsonplaceholder.typicode.com/posts/1'
        }
    )
    print(response.json())

# 简单 POST 请求
def simple_post():
    response = requests.post(
        'http://localhost:3000/proxy',
        params={
            'url': 'https://jsonplaceholder.typicode.com/posts'
        },
        json={
            'title': '新文章',
            'body': '文章内容',
            'userId': 1
        }
    )
    print(response.json())

# 高级代理请求
def advanced_request():
    payload = {
        'url': 'https://api.github.com/users/github',
        'method': 'GET',
        'customHeaders': {
            'User-Agent': 'My-App/1.0'
        }
    }
    
    response = requests.post(
        'http://localhost:3000/proxy/advanced',
        json=payload
    )
    print(response.json())

# 带认证的请求
def authenticated_request():
    payload = {
        'url': 'https://api.example.com/protected',
        'method': 'GET',
        'customHeaders': {
            'Authorization': 'Bearer your-token-here'
        }
    }
    
    response = requests.post(
        'http://localhost:3000/proxy/advanced',
        json=payload
    )
    print(response.json())

if __name__ == '__main__':
    simple_get()
    simple_post()
    advanced_request()
```

---

## 8. 错误处理示例

### 8.1 无效的 URL

```bash
curl "http://localhost:3000/proxy?url=not-a-valid-url"
```

**错误响应**:
```json
{
  "error": "代理请求失败",
  "details": "Invalid URL"
}
```

---

### 8.2 缺少 URL 参数

```bash
curl "http://localhost:3000/proxy"
```

**错误响应**:
```json
{
  "error": "缺少目标URL参数"
}
```

---

### 8.3 目标服务器不可达

```bash
curl "http://localhost:3000/proxy?url=https://non-existent-domain-12345.com"
```

**错误响应**:
```json
{
  "error": "代理请求失败",
  "details": "getaddrinfo ENOTFOUND non-existent-domain-12345.com"
}
```

---

## 9. 性能测试示例

### 9.1 使用 Apache Bench (ab)

```bash
# 测试健康检查端点
ab -n 1000 -c 10 http://localhost:3000/health

# 测试代理端点
ab -n 100 -c 5 "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1"
```

---

### 9.2 使用 wrk

```bash
# 安装 wrk (macOS)
brew install wrk

# 基准测试
wrk -t4 -c100 -d30s http://localhost:3000/health
```

---

## 10. 调试技巧

### 10.1 查看详细响应头

```bash
curl -v "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1"
```

---

### 10.2 保存响应到文件

```bash
curl "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1" \
  -o response.json
```

---

### 10.3 格式化 JSON 输出 (使用 jq)

```bash
# 安装 jq (macOS)
brew install jq

# 格式化输出
curl -s "http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/posts/1" | jq
```

---

## 总结

本文档涵盖了代理服务器的各种使用场景：

1. ✅ 基础的 GET/POST 请求
2. ✅ 高级自定义配置
3. ✅ 实际 API 集成
4. ✅ 多语言客户端示例
5. ✅ 错误处理
6. ✅ 性能测试
7. ✅ 调试技巧

如需更多帮助，请参考 [README.md](./README.md) 或提交 Issue。
