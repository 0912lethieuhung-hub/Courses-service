@echo off
title Stop Course Service (Port 8085)
echo Dang dung Course Service tren port 8085...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8085" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Da dung Course Service (Port 8085)!
pause
