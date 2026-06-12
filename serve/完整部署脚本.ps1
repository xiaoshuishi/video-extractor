# Video Extractor 部署脚本
# 双击此文件或在终端中运行此脚本

# ==================== 步骤 1: Git 初始化 ====================
Write-Host "`n=== 步骤 1: Git 初始化 ===" -ForegroundColor Cyan

Set-Location "d:\软件\Trae CN\video-extractor-website"

# 初始化 Git
git init
git add .
git commit -m "Video Extractor - 视频链接提取工具"

Write-Host "Git 初始化完成!" -ForegroundColor Green

# ==================== 步骤 2: 创建 GitHub 仓库 ====================
Write-Host "`n=== 步骤 2: 创建 GitHub 仓库 ===" -ForegroundColor Cyan
Write-Host "请在浏览器中打开: https://github.com/new" -ForegroundColor Yellow
Write-Host "1. 仓库名称填写: video-extractor" -ForegroundColor Yellow
Write-Host "2. 选择 Public" -ForegroundColor Yellow
Write-Host "3. 点击 Create repository" -ForegroundColor Yellow

# 等待用户创建仓库
$githubUsername = Read-Host "请输入您的 GitHub 用户名"
$repoUrl = "https://github.com/$githubUsername/video-extractor.git"

# ==================== 步骤 3: 推送到 GitHub ====================
Write-Host "`n=== 步骤 3: 推送到 GitHub ===" -ForegroundColor Cyan

git branch -M main
git remote add origin $repoUrl
git push -u origin main

Write-Host "推送完成!" -ForegroundColor Green

# ==================== 步骤 4: 部署到 Railway ====================
Write-Host "`n=== 步骤 4: 部署到 Railway ===" -ForegroundColor Cyan
Write-Host "请在浏览器中打开: https://railway.app" -ForegroundColor Yellow
Write-Host "1. 点击 Login with GitHub" -ForegroundColor Yellow
Write-Host "2. 点击 New Project -> Deploy from GitHub repo" -ForegroundColor Yellow
Write-Host "3. 选择 video-extractor 仓库" -ForegroundColor Yellow
Write-Host "4. 等待部署完成..." -ForegroundColor Yellow

# 检查 Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "`n安装 Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

Write-Host "`n完成部署后，运行以下命令查看状态:" -ForegroundColor Cyan
Write-Host "  railway status" -ForegroundColor White
Write-Host "  railway domain" -ForegroundColor White

Write-Host "`n=== 所有步骤完成! ===" -ForegroundColor Green
