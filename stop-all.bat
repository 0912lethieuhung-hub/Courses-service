@echo off
title Stop All CRS Microservices
echo Dang dung tat ca cac port 8080, 8081, 8083, 8085, 5173...

for %%p in (8080 8081 8083 8085 5173) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo Da dung tat ca cac service!
pause
