@echo off
title CRS Microservices - Security & Integration Test Suite
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0test-security.ps1"
pause
