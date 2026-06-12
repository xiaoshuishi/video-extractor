# Video Extractor 部署指南

## 快速部署到 Railway

### 前提条件
1. [Railway](https://railway.app) 账号（可用 GitHub 登录）
2. GitHub 账号（用于存储代码）

### 步骤 1: 将代码推送到 GitHub

```bash
cd "d:\软件\Trae CN\video-extractor-website"
git init
git add .
git commit -m "Initial commit - Video Extractor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/video-extractor.git
git push -u origin main
```

### 步骤 2: 部署到 Railway

1. 访问 [https://railway.app](https://railway.app) 并登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择刚才创建的仓库
4. Railway 会自动检测 Node.js 项目并部署

### 步骤 3: 配置自定义域名

1. 部署成功后，在项目页面点击 "Settings"
2. 找到 "Networking" → "Custom Domains"
3. 添加您的域名: `videoextractor.bqx.com`
4. 根据提示在您的 DNS 服务商添加 CNAME 记录:
   - **主机记录**: `videoextractor`
   - **记录类型**: `CNAME`
   - **记录值**: `your-railway-app.railway.app`（Railway 提供的域名）

> **注意**: `videoextractor.bqx.com` 域名需要您先在域名服务商（如阿里云、腾讯云）注册并拥有，才能配置 DNS。

### 本地运行

```bash
cd "d:\软件\Trae CN\video-extractor-website"
npm install
npm start
```

访问 http://localhost:3000

---

## 支持的平台

| 平台 | 状态 | 说明 |
|------|------|------|
| 抖音 | ✅ | 支持提取视频/音频 |
| 小红书 | ✅ | 支持提取视频/图集 |
| B站 | ✅ | 支持获取视频信息 |
| 快手 | ✅ | 支持提取视频 |
| YouTube | ✅ | 支持提取多种画质 |
| 微博 | ✅ | 支持提取视频 |

---

## API 接口

### 提取视频
```
POST /api/extract
Content-Type: application/json

{"url": "https://v.douyin.com/xxxxx"}
```

### 响应示例
```json
{
  "success": true,
  "platform": "douyin",
  "data": {
    "title": "视频标题",
    "author": "作者名",
    "thumbnail": "封面URL",
    "hd": { "url": "高清视频URL", "quality": "HD" },
    "sd": { "url": "标清视频URL", "quality": "SD" },
    "audio": { "url": "音频URL", "quality": "Audio" }
  }
}
```

### 健康检查
```
GET /api/health
```
