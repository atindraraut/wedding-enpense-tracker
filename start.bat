@echo off
REM Wedding Expense Calculator - Next.js Startup Script for Windows

echo ================================================
echo    Wedding Expense Calculator (Next.js)
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed
    echo.
) else (
    echo Dependencies already installed
    echo.
)

echo ================================================
echo    Starting Next.js Development Server...
echo ================================================
echo.

REM Start Next.js development server
call npm run dev
