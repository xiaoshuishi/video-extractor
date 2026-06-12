@echo off
chcp 65001 >nul
echo ========================================
echo   Video Extractor 一键部署脚本
echo ========================================
echo.

cd /d "%~dp0"

REM 检查是否安装 Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/5] 正在检查 Git...
    echo Git 未安装，正在下载安装...
    
    if not exist "%USERPROFILE%\Downloads\Git-2.45.1-64-bit.exe" (
        echo 下载 Git...
        powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/Git-2.45.1-64-bit.exe' -OutFile '%USERPROFILE%\Downloads\Git-2.45.1-64-bit.exe'"
    )
    
    echo.
    echo 请在弹出的窗口中完成 Git 安装
    echo 安装选项:
    echo   1. 选择 "Use Git from the Windows Command Prompt"
    echo   2. 选择 "Checkout Windows-style, commit Unix-style"
    echo   3. 其他选项保持默认
    echo.
    start "" "%USERPROFILE%\Downloads\Git-2.45.1-64-bit.exe" /SILENT
    echo 按任意键继续（安装完成后）...
    pause >nul
    
    REM 刷新 PATH
    set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin
)

echo [2/5] 初始化 Git 仓库...
git init
git add .
git commit -m "Video Extractor - 视频链接提取工具，支持抖音/B站/小红书/YouTube等平台"
echo ✓ Git 仓库初始化完成
echo.

echo [3/5] 创建 GitHub 仓库...
echo 请在浏览器中打开: https://github.com/new
echo   - 仓库名称: video-extractor
echo   - 选择 Public
echo   - 不要勾选任何初始化选项
echo.
set /p GH_USERNAME="请输入您的 GitHub 用户名: "

git remote remove origin 2>nul
git remote add origin https://github.com/%GH_USERNAME%/video-extractor.git
git branch -M main

echo.
echo [4/5] 推送代码到 GitHub...
git push -u origin main
echo.

echo [5/5] 部署到 Railway...
echo 请在浏览器中打开: https://railway.app
echo   1. 点击 Login with GitHub
echo   2. 点击 New Project -^> Deploy from GitHub repo
echo   3. 选择 video-extractor 仓库
echo   4. 等待部署完成
echo.
echo ========================================
echo   部署准备完成！
echo ========================================
echo.
echo 下一步:
echo   1. 在 Railway 获取分配的域名
echo   2. 在域名服务商添加 CNAME 记录:
echo      - 主机记录: videoextractor
echo      - 记录类型: CNAME
echo      - 记录值: [您的Railway域名]
echo.
echo   完成后访问: https://videoextractor.bqx.com
echo.
pause
