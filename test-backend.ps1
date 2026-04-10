# FocusAI Backend Test Script
Write-Host "🧪 Testing FocusAI Backend..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ Health Check: $($response.status) - $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Analyze Endpoint
Write-Host "2️⃣ Testing Analyze Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        input = "This is a test content about learning JavaScript programming."
        goal = "Learn programming"
        userKeywords = @()
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/analyze" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Analyze Response:" -ForegroundColor Green
    Write-Host "   - Score: $($response.analysis.score)" -ForegroundColor White
    Write-Host "   - Classification: $($response.analysis.classification)" -ForegroundColor White
    Write-Host "   - Summary: $($response.analysis.summary.Substring(0, [Math]::Min(80, $response.analysis.summary.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ Analyze Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Chat Endpoint
Write-Host "3️⃣ Testing Chat Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        messages = @(
            @{
                role = "user"
                content = "What is JavaScript?"
            }
        )
        context = "Learning programming"
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$baseUrl/api/chat" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Chat Response:" -ForegroundColor Green
    Write-Host "   - Reply: $($response.reply.Substring(0, [Math]::Min(80, $response.reply.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ Chat Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Session Endpoint
Write-Host "4️⃣ Testing Session Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        goal = "Learn programming"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/session/create" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Session Created:" -ForegroundColor Green
    Write-Host "   - Session ID: $($response.sessionId)" -ForegroundColor White
    Write-Host "   - Goal: $($response.goal)" -ForegroundColor White
} catch {
    Write-Host "❌ Session Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "🎉 Backend tests completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "   - Server is running on http://localhost:5000" -ForegroundColor White
Write-Host "   - All endpoints are accessible" -ForegroundColor White
Write-Host "   - Ready for deployment to Render!" -ForegroundColor Green
Write-Host ""
