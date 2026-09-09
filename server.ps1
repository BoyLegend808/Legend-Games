# Ultra-Reliable PowerShell Static Web Server (TcpListener) + API Support
param(
    [int]$port = 3000
)

$localIP = [System.Net.IPAddress]::Any
$listener = New-Object System.Net.Sockets.TcpListener($localIP, $port)
$listener.Server.SetSocketOption([System.Net.Sockets.SocketOptionLevel]::Socket, [System.Net.Sockets.SocketOptionName]::ReuseAddress, $true)
$baseDir = (Get-Item -LiteralPath $PSScriptRoot).FullName

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.webp' = 'image/webp'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
}

function Send-Response {
    param($stream, $statusCode, $statusText, $contentType, $bodyBytes)
    $header = "HTTP/1.1 $statusCode $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($bodyBytes.Length)`r`nConnection: close`r`nAccess-Control-Allow-Origin: *`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
    $stream.Flush()
}

try {
    $listener.Start()

    Write-Host ""
    Write-Host "======================================================"
    Write-Host " LEGEND GAMES SERVER IS LIVE!"
    Write-Host " Web App:   http://localhost:$port"
    Write-Host " Games API: http://localhost:$port/api/games"
    Write-Host " Serving:   $baseDir"
    Write-Host "======================================================"
    Write-Host ""

    while ($true) {
        $client = $null
        $stream = $null
        try {
            $client = $listener.AcceptTcpClient()
            $client.ReceiveTimeout = 3000
            $stream = $client.GetStream()

            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
            $requestLine = $reader.ReadLine()

            # Consume all request headers
            $line = $reader.ReadLine()
            while (-not [string]::IsNullOrWhiteSpace($line)) {
                $line = $reader.ReadLine()
            }

            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) { continue }

            # Decode and sanitize the URL path
            $rawUrl = $parts[1]
            $rawPath = $rawUrl.Split('?')[0].Split('#')[0]

            try {
                $rawPath = [System.Uri]::UnescapeDataString($rawPath)
            } catch { }

            # Strip leading slash and normalize separators
            $rawPath = $rawPath.TrimStart('/').TrimStart('\')
            $rawPath = $rawPath -replace '[/\\]+', '\'

            # API route handling
            if ($rawPath -eq 'api\games' -or $rawPath -eq 'api\games\') {
                $dbPath = [System.IO.Path]::Combine($baseDir, 'db\games.json')
                if (Test-Path $dbPath) {
                    $bytes = [System.IO.File]::ReadAllBytes($dbPath)
                    Send-Response $stream 200 'OK' 'application/json; charset=utf-8' $bytes
                    Write-Host "  200  /api/games"
                    continue
                }
            }

            # Remove any path traversal attempts
            $rawPath = $rawPath -replace '\.\.\\', '' -replace '\.\./', ''

            # Default route
            if ([string]::IsNullOrWhiteSpace($rawPath)) {
                $rawPath = 'home\home.html'
            }

            # Route aliases (clean URLs)
            $routeMap = @{
                'home'          = 'home\home.html'
                'home\'         = 'home\home.html'
                'consoles\ps5'  = 'consoles\ps5\ps5.html'
                'consoles\ps4'  = 'consoles\ps4\ps4.html'
                'consoles\ps3'  = 'consoles\ps3\ps3.html'
                'consoles\xbox' = 'consoles\xbox\xbox.html'
                'disk'          = 'disk\disk.html'
                'discs-only'    = 'discs-only\discs-only.html'
                'pc-games'      = 'pc-games\pc-games.html'
                'accessories'   = 'accessories\accessories.html'
                'wraps'         = 'wraps\wraps.html'
                'request-form'  = 'request-form\request-form.html'
                'cart'          = 'cart\cart.html'
                'order-tracking'= 'order-tracking\order-tracking.html'
                'how-it-works'  = 'how-it-works\how-it-works.html'
                'faq'           = 'faq\faq.html'
                'price-list'    = 'price-list\price-list.html'
            }
            if ($routeMap.ContainsKey($rawPath)) {
                $rawPath = $routeMap[$rawPath]
            }

            # Resolve file path safely
            $filePath = $null
            try {
                $combined = [System.IO.Path]::Combine($baseDir, $rawPath)
                $filePath  = [System.IO.Path]::GetFullPath($combined)
            } catch {
                $body = [System.Text.Encoding]::UTF8.GetBytes('<h2>400 Bad Request</h2>')
                Send-Response $stream 400 'Bad Request' 'text/html; charset=utf-8' $body
                continue
            }

            # Security: must stay inside baseDir
            if (-not $filePath.StartsWith($baseDir)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('<h2>403 Forbidden</h2>')
                Send-Response $stream 403 'Forbidden' 'text/html; charset=utf-8' $body
                continue
            }

            # If it's a directory, try index.html inside it
            if (Test-Path $filePath -PathType Container) {
                $filePath = [System.IO.Path]::Combine($filePath, 'index.html')
            }

            # Serve the file
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime  = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
                Send-Response $stream 200 'OK' $mime $bytes
                Write-Host "  200  $rawPath"
            } else {
                $notFound = "<html><body style='background:#090a10;color:#fff;font-family:sans-serif;text-align:center;padding:60px'><h2>404 - Page Not Found</h2><p style='color:#94a3b8'>$rawPath</p><a href='/home/home.html' style='color:#39ff14;text-decoration:none;font-weight:bold'>&#8592; Go Home</a></body></html>"
                $body = [System.Text.Encoding]::UTF8.GetBytes($notFound)
                Send-Response $stream 404 'Not Found' 'text/html; charset=utf-8' $body
                Write-Host "  404  $rawPath"
            }

        } catch {
            # Silently ignore per-request errors
        } finally {
            if ($stream) { try { $stream.Close() } catch {} }
            if ($client) { try { $client.Close() } catch {} }
        }
    }

} catch {
    Write-Error $_.Exception.Message
} finally {
    $listener.Stop()
}
