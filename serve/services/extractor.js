const axios = require('axios');

// 视频提取服务
// 主要使用 api.douyin.wtf 免费API（支持抖音、快手、小红书、B站）
// 备用：Invidious 实例（支持YouTube）

const FALLBACK_API_URL = 'https://api.douyin.wtf/api';

// 平台检测
function detectPlatform(url) {
    if (!url) return null;
    
    if (url.includes('douyin.com') || url.includes('iesdouyin') || url.includes('v.douyin')) {
        return 'douyin';
    }
    if (url.includes('bilibili.com') || url.includes('b23.tv')) {
        return 'bilibili';
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
    }
    if (url.includes('xiaohongshu.com') || url.includes('xhslink') || url.includes('redoc')) {
        return 'xiaohongshu';
    }
    if (url.includes('kuaishou.com') || url.includes('gifshow') || url.includes('ksurl')) {
        return 'kuaishou';
    }
    if (url.includes('weibo.com') || url.includes('m.weibo') || url.includes('weibointl')) {
        return 'weibo';
    }
    if (url.includes('instagram.com') || url.includes('instagr.am')) {
        return 'instagram';
    }
    if (url.includes('x.com') || url.includes('twitter.com') || url.includes('t.co')) {
        return 'twitter';
    }
    }
    
    return null;
}

// 主提取函数
async function extract(url) {
    const platform = detectPlatform(url);
    
    if (!platform) {
        throw new Error('暂不支持该平台，请输入抖音、B站、YouTube等平台的链接');
    }

    switch (platform) {
        case 'douyin':
            return await extractDouyin(url);
        case 'bilibili':
            return await extractBilibili(url);
        case 'youtube':
            return await extractYoutube(url);
        case 'xiaohongshu':
            return await extractXiaohongshu(url);
        case 'kuaishou':
            return await extractKuaishou(url);
        case 'weibo':
            return await extractWeibo(url);
        case 'instagram':
            return await extractInstagram(url);
        case 'twitter':
            return await extractTwitter(url);
        default:
            throw new Error(`暂不支持 ${platform} 平台`);
    }
}

// 提取抖音视频
async function extractDouyin(url) {
    try {
        // 规范化URL（处理短链接）
        let finalUrl = url;
        if (url.includes('v.douyin.com')) {
            finalUrl = url;
        } else if (url.includes('douyin.com/share/video/')) {
            // 从分享链接提取视频ID
            const match = url.match(/video\/(\d+)/);
            if (match) {
                finalUrl = `https://www.douyin.com/video/${match[1]}`;
            }
        }

        const response = await axios.get(FALLBACK_API_URL, {
            params: { url: finalUrl },
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data.status === 'success' && response.data.data) {
            const data = response.data.data;
            return {
                success: true,
                platform: 'douyin',
                data: {
                    title: data.title || '抖音视频',
                    author: data.author || '未知作者',
                    thumbnail: data.cover || data.thumbnail || '',
                    hd: {
                        url: data.play || data.hd || data.url || '',
                        quality: 'HD'
                    },
                    sd: {
                        url: data.playwm || data.sd || data.play || '',
                        quality: 'SD'
                    },
                    audio: {
                        url: data.music || data.audio || '',
                        quality: 'Audio'
                    },
                    duration: data.duration || 0
                }
            };
        }

        throw new Error(response.data.message || '解析失败，请检查链接是否正确');
    } catch (error) {
        if (error.response) {
            throw new Error(`抖音API返回错误: ${error.response.status}`);
        }
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            throw new Error('视频解析服务暂时不可用，请稍后重试');
        }
        throw new Error(`抖音视频解析失败: ${error.message}`);
    }
}

// 提取小红书视频
async function extractXiaohongshu(url) {
    try {
        // 小红书链接处理
        let finalUrl = url;
        if (url.includes('xhslink.com')) {
            finalUrl = url;
        }

        const response = await axios.get(FALLBACK_API_URL, {
            params: { url: finalUrl },
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data.status === 'success' && response.data.data) {
            const data = response.data.data;
            return {
                success: true,
                platform: 'xiaohongshu',
                data: {
                    title: data.title || '小红书笔记',
                    author: data.author || data.nickname || '未知作者',
                    thumbnail: data.cover || data.thumbnail || '',
                    hd: {
                        url: data.play || data.url || data.hd || '',
                        quality: 'HD'
                    },
                    sd: {
                        url: data.playwm || data.sd || data.play || '',
                        quality: 'SD'
                    },
                    audio: {
                        url: data.music || data.audio || '',
                        quality: 'Audio'
                    }
                }
            };
        }

        throw new Error(response.data.message || '解析失败');
    } catch (error) {
        throw new Error(`小红书视频解析失败: ${error.message}`);
    }
}

// 提取快手视频
async function extractKuaishou(url) {
    try {
        const response = await axios.get(FALLBACK_API_URL, {
            params: { url: url },
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data.status === 'success' && response.data.data) {
            const data = response.data.data;
            return {
                success: true,
                platform: 'kuaishou',
                data: {
                    title: data.title || '快手视频',
                    author: data.author || '未知作者',
                    thumbnail: data.cover || '',
                    hd: {
                        url: data.play || data.hd || '',
                        quality: 'HD'
                    },
                    sd: {
                        url: data.playwm || data.sd || data.play || '',
                        quality: 'SD'
                    },
                    audio: {
                        url: data.music || '',
                        quality: 'Audio'
                    }
                }
            };
        }

        throw new Error(response.data.message || '解析失败');
    } catch (error) {
        throw new Error(`快手视频解析失败: ${error.message}`);
    }
}

// 提取B站视频
async function extractBilibili(url) {
    try {
        // 提取B站视频ID
        let bvid = '';
        let aid = '';
        
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        const aidMatch = url.match(/av(\d+)/);
        const shortMatch = url.match(/b23\.tv\/([a-zA-Z0-9]+)/);
        
        if (bvMatch) {
            bvid = bvMatch[0];
        } else if (aidMatch) {
            aid = aidMatch[1];
        }

        // 获取视频信息
        const videoInfoUrl = bvid 
            ? `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
            : `https://api.bilibili.com/x/web-interface/view?aid=${aid}`;
        
        const infoResponse = await axios.get(videoInfoUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.bilibili.com'
            }
        });

        const infoData = infoResponse.data;
        if (infoData.code !== 0) {
            throw new Error('B站视频信息获取失败');
        }

        const videoInfo = infoData.data;
        
        // 尝试从 api.douyin.wtf 获取下载链接
        try {
            const response = await axios.get(FALLBACK_API_URL, {
                params: { url: url },
                timeout: 15000
            });

            if (response.data.status === 'success' && response.data.data) {
                const data = response.data.data;
                return {
                    success: true,
                    platform: 'bilibili',
                    data: {
                        title: videoInfo.title || data.title || 'B站视频',
                        author: videoInfo.owner?.name || data.author || '未知作者',
                        thumbnail: data.cover || videoInfo.pic ? `https://${videoInfo.pic.replace('//', '')}` : '',
                        hd: {
                            url: data.play || data.hd || '',
                            quality: 'HD'
                        },
                        sd: {
                            url: data.playwm || data.sd || data.play || '',
                            quality: 'SD'
                        },
                        audio: {
                            url: data.music || '',
                            quality: 'Audio'
                        }
                    }
                };
            }
        } catch (e) {
            console.log('B站下载链接获取失败，使用备用方案');
        }

        // 备用方案：返回视频信息和使用说明
        return {
            success: true,
            platform: 'bilibili',
            data: {
                title: videoInfo.title || 'B站视频',
                author: videoInfo.owner?.name || '未知作者',
                thumbnail: videoInfo.pic ? `https://${videoInfo.pic.replace('//', '')}` : '',
                description: videoInfo.desc || '',
                duration: videoInfo.duration || 0,
                hd: {
                    url: `https://www.bilibili.com/video/${bvid || 'av' + aid}`,
                    quality: 'HD'
                },
                sd: {
                    url: `https://www.bilibili.com/video/${bvid || 'av' + aid}`,
                    quality: 'SD'
                },
                audio: {
                    url: '',
                    quality: 'Audio'
                },
                note: 'B站视频建议使用IDM或浏览器扩展下载，或直接点击观看'
            }
        };
    } catch (error) {
        throw new Error(`B站视频解析失败: ${error.message}`);
    }
}

// 提取YouTube视频
async function extractYoutube(url) {
    try {
        const videoId = extractYoutubeId(url);
        if (!videoId) {
            throw new Error('无法解析YouTube视频ID');
        }

        // 使用 Invidious 公共实例
        const instances = [
            'https://yewtu.be',
            'https://invidious.nerdcat.xyz',
            'https://vid.puffyan.us'
        ];

        for (const instance of instances) {
            try {
                const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, {
                    timeout: 10000
                });

                const data = response.data;
                const formats = data.formatStreams || [];
                
                formats.sort((a, b) => {
                    const resA = parseInt(a.resolution) || 0;
                    const resB = parseInt(b.resolution) || 0;
                    return resB - resA;
                });

                const hd = formats.find(f => f.resolution.includes('1080')) 
                    || formats.find(f => f.resolution.includes('720')) 
                    || formats[0];
                const sd = formats.find(f => f.resolution.includes('480')) 
                    || formats.find(f => f.resolution.includes('360')) 
                    || formats[1];

                return {
                    success: true,
                    platform: 'youtube',
                    data: {
                        title: data.title || 'YouTube视频',
                        author: data.author || 'Unknown',
                        thumbnail: data.videoThumbnails?.[0]?.url || '',
                        hd: {
                            url: hd?.url || '',
                            quality: hd?.resolution || 'HD'
                        },
                        sd: {
                            url: sd?.url || hd?.url || '',
                            quality: sd?.resolution || 'SD'
                        },
                        audio: {
                            url: '',
                            quality: 'Audio'
                        },
                        duration: data.lengthSeconds || 0
                    }
                };
            } catch (e) {
                continue;
            }
        }

        throw new Error('YouTube镜像都不可用，请稍后重试');
    } catch (error) {
        throw new Error(`YouTube视频解析失败: ${error.message}`);
    }
}

// 提取YouTube视频ID
function extractYoutubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}



async function extractTwitter(url) {
    try {
        const r = await axios.get("https://publish.twitter.com/oembed?url="+encodeURIComponent(url), {timeout:10000});
        return {success:true,platform:"twitter",data:{title:r.data.author_name+"的推文",author:r.data.author_name||"用户",thumbnail:r.data.thumbnail_url||"",hd:{url:url,quality:"HD"},sd:{url:url,quality:"SD"},audio:{url:"",quality:"Audio"}}};
    } catch(e) { throw new Error("X/Twitter解析失败: "+e.message); }
}


async function extractWeibo(url) {
    try {
        var res = await axios.get(url, {timeout:15000,headers:{"User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/537.36"}});
        var html = res.data;
        var title = "微博视频";
        var match = html.match(/stream_url[\s]*:[\s]*["']([^"']+)["']/);
        var videoUrl = match ? match[1] : url;
        return {success:true,platform:"weibo",data:{title:title,author:"微博用户",thumbnail:"",hd:{url:videoUrl,quality:"HD"},sd:{url:videoUrl,quality:"SD"},audio:{url:"",quality:"Audio"}}};
    } catch(e) { throw new Error("微博解析失败: " + e.message); }
}

async function extractInstagram(url) {
    try {
        var r = await axios.get("https://api.instagram.com/oembed?url="+encodeURIComponent(url), {timeout:10000});
        return {success:true,platform:"instagram",data:{title:r.data.title||"Instagram",author:r.data.author_name||"用户",thumbnail:r.data.thumbnail_url||"",hd:{url:url,quality:"HD"},sd:{url:url,quality:"SD"},audio:{url:"",quality:"Audio"}}};
    } catch(e) { throw new Error("Instagram解析失败: " + e.message); }
}

async function extractTwitter(url) {
    try {
        var r = await axios.get("https://publish.twitter.com/oembed?url="+encodeURIComponent(url), {timeout:10000});
        return {success:true,platform:"twitter",data:{title:(r.data.author_name||"用户")+"的推文",author:r.data.author_name||"用户",thumbnail:r.data.thumbnail_url||"",hd:{url:url,quality:"HD"},sd:{url:url,quality:"SD"},audio:{url:"",quality:"Audio"}}};
    } catch(e) { throw new Error("X/Twitter解析失败: " + e.message); }
}

module.exports = { extract, detectPlatform };
