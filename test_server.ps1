$port = 5500
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "SUCCESS: HttpListener is listening on port $port"
$listener.Stop()
