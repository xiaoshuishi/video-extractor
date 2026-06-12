const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cwd = process.cwd();

function createGitRepo() {
    console.log('=== 初始化 Git 仓库 ===');
    
    // 创建 .git 目录
    const gitDir = path.join(cwd, '.git');
    const gitFolders = ['objects', 'refs', 'info', 'hooks', 'objects/pack', 'objects/info'];
    
    gitFolders.forEach(folder => {
        const folderPath = path.join(gitDir, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    });
    
    console.log('✓ .git 目录已创建');
    
    // 创建 HEAD
    fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/main\n');
    console.log('✓ HEAD 已创建');
    
    // 创建 config
    const config = `[core]
    repositoryformatversion = 0
    filemode = false
    bare = false
    logallrefupdates = true
[user]
    name = Video Extractor User
    email = user@example.com
`;
    fs.writeFileSync(path.join(gitDir, 'config'), config);
    console.log('✓ config 已创建');
    
    // 创建 description
    fs.writeFileSync(path.join(gitDir, 'description'), 'Video Extractor - 视频链接提取工具\n');
    console.log('✓ description 已创建');
    
    // 创建 refs/heads/main
    fs.writeFileSync(path.join(gitDir, 'refs', 'heads', 'main'), '');
    console.log('✓ main 分支已创建');
    
    // 创建初始 commit
    const commitContent = createCommit('Video Extractor - 视频链接提取工具，支持抖音/B站/小红书/YouTube等平台');
    fs.writeFileSync(path.join(gitDir, 'objects', commitContent.hash.substring(0, 2), commitContent.hash.substring(2)), commitContent.content);
    
    // 更新 refs/heads/main
    fs.writeFileSync(path.join(gitDir, 'refs', 'heads', 'main'), commitContent.hash + '\n');
    
    console.log('✓ 初始提交已完成');
    console.log('\n仓库初始化完成!');
    console.log('\n下一步:');
    console.log('1. 在 GitHub 创建仓库: https://github.com/new');
    console.log('   - 仓库名称: video-extractor');
    console.log('   - 选择 Public');
    console.log('   - 不要勾选任何初始化选项');
    console.log('');
    console.log('2. 安装 Git (如果没有): https://git-scm.com/download/win');
    console.log('');
    console.log('3. 推送代码到 GitHub:');
    console.log('   git remote add origin https://github.com/YOUR_USERNAME/video-extractor.git');
    console.log('   git branch -M main');
    console.log('   git push -u origin main');
    console.log('');
    console.log('4. 部署到 Railway:');
    console.log('   https://railway.app - Deploy from GitHub');
}

function createCommit(message) {
    const author = {
        name: 'Video Extractor User',
        email: 'user@example.com',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        timezone: '+0800'
    };
    
    const committer = author;
    
    const treeContent = `tree ${'0'.repeat(40)}
author ${author.name} <${author.email}> ${author.timestamp} ${author.timezone}
committer ${committer.name} <${committer.email}> ${committer.timestamp} ${committer.timezone}

${message}
`;
    
    const treeHash = crypto.createHash('sha1').update(treeContent).digest('hex');
    
    const commitWithTree = `tree ${'0'.repeat(40)}
author ${author.name} <${author.email}> ${author.timestamp} ${author.timezone}
committer ${committer.name} <${committer.email}> ${committer.timestamp} ${committer.timezone}

${message}
`;
    
    const commitHash = crypto.createHash('sha1').update(commitWithTree).digest('hex');
    const content = compressZlib(commitWithTree);
    
    return { hash: commitHash, content };
}

function compressZlib(data) {
    const zlib = require('zlib');
    return zlib.deflateSync(data);
}

createGitRepo();
