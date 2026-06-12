const express = require('express');
const cors = require('cors');
const path = require('path');
const videoExtractor = require('./services/extractor');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API路由
app.post('/api/extract', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                error: '请提供视频链接' 
            });
        }

        const result = await videoExtractor.extract(url);
        res.json(result);
    } catch (error) {
        console.error('提取失败:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message || '解析失败，请稍后重试' 
        });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🎬 Video Extractor 服务已启动: http://localhost:${PORT}`);
});
