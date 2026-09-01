# Script kiem thu 7 kich ban bao mat & tich hop Buoi 10
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

function Run-Security-Test {
    param(
        [int]$Id,
        [string]$Name,
        [string]$Uri,
        [string]$Method,
        [hashtable]$Headers,
        [string]$Body,
        [int]$ExpectedStatus,
        [string]$Note
    )
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host "[Kịch bản $Id] $Name" -ForegroundColor Yellow
    Write-Host "Request: $Method $Uri"
    if ($Body) { Write-Host "Body: $Body" }
    
    $statusCode = 0
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            UseBasicParsing = $true
        }
        if ($Headers) { $params.Headers = $Headers }
        if ($Body) { 
            $params.Body = $Body
            $params.ContentType = "application/json; charset=utf-8"
        }
        $response = Invoke-WebRequest @params
        $statusCode = [int]$response.StatusCode
    } catch [System.Net.WebException] {
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        } else {
            Write-Host "Lỗi kết nối: $_" -ForegroundColor Red
            return
        }
    } catch {
        Write-Host "Lỗi không xác định: $_" -ForegroundColor Red
        return
    }

    Write-Host "HTTP Status Code thực tế: $statusCode (Kỳ vọng: $ExpectedStatus)"
    if ($statusCode -eq $ExpectedStatus) {
        Write-Host "=> KẾT QUẢ: PASS [ĐẠT YÊU CẦU]" -ForegroundColor Green
    } else {
        Write-Host "=> KẾT QUẢ: FAIL [CHƯA ĐẠT]" -ForegroundColor Red
    }
    if ($Note) { Write-Host "Ý nghĩa: $Note" -ForegroundColor Gray }
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   CRS MICROSERVICES - KIỂM THỬ BẢO MẬT & TÍCH HỢP     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 0. Dang nhap lay Token moi
Write-Host "`nDang dang nhap de lay token..." -ForegroundColor DarkGray
try {
    $bodyStudent = @{ username = "student1"; password = "student123" } | ConvertTo-Json
    $resStudent = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $bodyStudent -ContentType "application/json"
    $studentToken = $resStudent.token

    $bodyAdmin = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $resAdmin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $bodyAdmin -ContentType "application/json"
    $adminToken = $resAdmin.token
} catch {
    Write-Host "KHONG THE DANG NHAP! Hay chac chan ca 4 service Spring Boot va Gateway dang chay." -ForegroundColor Red
    return
}

# 1. Kich ban 1
Run-Security-Test -Id 1 -Name "Không có token, gọi API cần đăng nhập" `
                  -Uri "http://localhost:8080/api/registrations" `
                  -Method "Post" `
                  -Body '{"studentId":2,"courseId":2}' `
                  -ExpectedStatus 401 `
                  -Note "Chặn tại AuthHeaderFilter ở API Gateway"

# 2. Kich ban 2
Run-Security-Test -Id 2 -Name "Có token STUDENT, gọi API của ADMIN (POST /api/courses)" `
                  -Uri "http://localhost:8080/api/courses" `
                  -Method "Post" `
                  -Headers @{ "Authorization" = "Bearer $studentToken" } `
                  -Body '{"tenMonHoc":"Toan Cao Cap","soTinChi":3,"soChoToiDa":40}' `
                  -ExpectedStatus 403 `
                  -Note "Chặn tại course-service qua SecurityConfig hasRole('ADMIN')"

# 3. Kich ban 3
$randCourse = "Mon Hoc Sec " + (Get-Random -Minimum 1000 -Maximum 9999)
Run-Security-Test -Id 3 -Name "Có token ADMIN, gọi đúng API ADMIN" `
                  -Uri "http://localhost:8080/api/courses" `
                  -Method "Post" `
                  -Headers @{ "Authorization" = "Bearer $adminToken" } `
                  -Body "{`"tenMonHoc`":`"$randCourse`",`"soTinChi`":3,`"soChoToiDa`":30}" `
                  -ExpectedStatus 201 `
                  -Note "Tạo môn học thành công cho ADMIN"

# 4. Kich ban 4
$fakeToken = $studentToken.Substring(0, $studentToken.Length - 6) + "XXXXXX"
Run-Security-Test -Id 4 -Name "Token giả mạo (sửa 1 ký tự bất kỳ trong JWT)" `
                  -Uri "http://localhost:8080/api/registrations/my" `
                  -Method "Get" `
                  -Headers @{ "Authorization" = "Bearer $fakeToken" } `
                  -ExpectedStatus 401 `
                  -Note "Chữ ký sai, JwtAuthFilter từ chối xác thực"

# 5. Kich ban 5
Run-Security-Test -Id 5 -Name "Route đối tác không có API Key" `
                  -Uri "http://localhost:8080/api/public/courses" `
                  -Method "Get" `
                  -ExpectedStatus 403 `
                  -Note "Chặn tại ApiKeyFilter ở Gateway"

# 6. Kich ban 6
Run-Security-Test -Id 6 -Name "Route đối tác có API Key đúng" `
                  -Uri "http://localhost:8080/api/public/courses" `
                  -Method "Get" `
                  -Headers @{ "X-API-KEY" = "crs-partner-key-2026" } `
                  -ExpectedStatus 200 `
                  -Note "Truy cập public partner thành công"

# 7. Kich ban 7
Run-Security-Test -Id 7 -Name "Gọi thẳng API nội bộ cổng 8085 (bỏ qua Gateway)" `
                  -Uri "http://localhost:8085/internal/courses/2/reserve-seat" `
                  -Method "Patch" `
                  -ExpectedStatus 200 `
                  -Note "Bảo mật mạng nội bộ dựa trên Network Isolation (permitAll)"

# Re-release slot de giu nguyen data
Invoke-WebRequest -Uri "http://localhost:8085/internal/courses/2/release-seat" -Method Patch -UseBasicParsing | Out-Null

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "                HOÀN TẤT KIỂM THỬ                       " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
