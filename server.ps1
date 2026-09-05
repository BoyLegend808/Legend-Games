# Ultra-Reliable PowerShell Static Web Server (TcpListener)
param(
    [int]$port = 8080
)

$localIP = [System.Net.IPAddress]::Any
$listener = [System.Net.Sockets.TcpListener]::new($localIP, $port)

try {
    $listener.Start()
    $baseDir = (Get-Location).Path
    Write-Host "======================================================"
    Write-Host " NAIJAPLAY / LEGEND GAMES SERVER IS LIVE!"
    Write-Host " URL: http://localhost:$port/home/home.html"
    Write-Host " URL: http://127.0.0.1:$port/home/home.html"
    Write-Host " Serving files from: $baseDir"
    Write-Host "======================================================"

    # Launch browser only AFTER listener is active
    Start-Process "http://localhost:$port/home/home.html"

    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
        
        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($requestLine)) {
            $client.Close()
            continue
        }

        $parts = $requestLine.Split(" ")
        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }

        $rawPath = $parts[1].Split('?')[0].TrimStart('/')
        if ([string]::IsNullOrEmpty($rawPath)) {
            $rawPath = "home/home.html"
        }

        # Consume remaining headers
        while (-not [string]::IsNullOrWhiteSpace($reader.ReadLine())) {}

        $decodedPath = [System.Uri]::UnescapeDataString($rawPath).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $decodedPath))

        if ($filePath.StartsWith($baseDir) -and (Test-Path $filePath -PathType Leaf)) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".webp" { "image/webp" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
        } else {
            $msg = "<h2>404 Not Found</h2><p>$decodedPath</p><a href='/home/home.html'>Go Home</a>"
            $msgBytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html; charset=utf-8`r`nContent-Length: $($msgBytes.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($msgBytes, 0, $msgBytes.Length)
        }

        $stream.Flush()
        $client.Close()
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    $listener.Stop()
}
