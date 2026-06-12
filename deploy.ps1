# Video Extractor 部署脚本
# 自动完成所有部署步骤

Write-Host "=== Video Extractor 部署脚本 ===" -ForegroundColor Cyan

# 检查是否安装 Git
Write-Host "`n[1/5] 检查 Git..." -ForegroundColor Yellow
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "Git 未安装，正在安装..." -ForegroundColor Red
    Write-Host "请下载 Git: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "安装后请重新运行此脚本" -ForegroundColor Cyan
    exit 1
}
Write-Host "Git 已安装: $($gitPath.Source)" -ForegroundColor Green

# 检查是否安装 Railway CLI
Write-Host "`n[2/5] 检查 Railway CLI..." -ForegroundColor Yellow
$railwayPath = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayPath) {
    Write-Host "Railway CLI 未安装，正在安装..." -ForegroundColor Red
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Railway CLI 安装失败，请手动运行: npm install -g @railway/cli" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Railway CLI 已安装" -ForegroundColor Green

# 登录 Railway
Write-Host "`n[3/5] 登录 Railway..." -ForegroundColor Yellow
Write-Host "请在浏览器中完成登录授权" -ForegroundColor Cyan
railway login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Railway 登录失败" -ForegroundColor Red
    exit 1
}

# 初始化项目
Write-Host "`n[4/5] 初始化 Railway 项目..." -ForegroundColor Yellow
Set-Location "d:\软件\Trae CN\video-extractor-website"
railway init
if ($LASTEXITCODE -ne 0) {
    Write-Host "Railway 初始化失败" -ForegroundColor Red
    exit 1
}

# 部署
Write-Host "`n[5/5] 部署到 Railway..." -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -ne 0) {
    Write-Host "部署失败" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== 部署成功！===" -ForegroundColor Green
Write-Host "运行 'railway status' 查看部署状态" -ForegroundColor Cyan
Write-Host "运行 'railway domain' 查看访问域名" -ForegroundColor Cyan
