$gamesJsPath = 'c:\Users\HP\OneDrive\Documenten\Legends Codes\Legend Games\shared\data\games.js'
$dbDir = 'c:\Users\HP\OneDrive\Documenten\Legends Codes\Legend Games\db'
if (-not (Test-Path $dbDir)) { New-Item -ItemType Directory -Path $dbDir -Force | Out-Null }

$content = Get-Content $gamesJsPath -Raw

# Extract games JSON
$jsonStart = $content.IndexOf('[')
$jsonEnd = $content.LastIndexOf(']')
$rawArray = $content.Substring($jsonStart, $jsonEnd - $jsonStart + 1)

# Clean up JS identifiers to valid JSON if needed or parse manually
# Let's use node or regex in PowerShell
$games = @()
$gameBlocks = [regex]::Matches($rawArray, '\{\s*id:\s*''([^'']+)''[\s\S]*?\}')

$sqlLines = @(
    "-- Master Seed Data for Legend Games",
    "-- Contains all 72 PlayStation 4 / PC / Xbox games",
    "BEGIN TRANSACTION;",
    ""
)

$jsonList = @()

foreach ($m in $gameBlocks) {
    $block = $m.Value
    
    $id = if ($block -match 'id:\s*''([^'']+)''') { $matches[1] } else { '' }
    $title = if ($block -match 'title:\s*''([^'']+)''') { $matches[1] } else { '' }
    $genre = if ($block -match 'genre:\s*''([^'']+)''') { $matches[1] } else { '' }
    $rating = if ($block -match 'rating:\s*([0-9.]+)') { [double]$matches[1] } else { 9.0 }
    $year = if ($block -match 'year:\s*([0-9]+)') { [int]$matches[1] } else { 2022 }
    $badge = if ($block -match 'badge:\s*''([^'']+)''') { $matches[1] } else { '' }
    $ps4Size = if ($block -match 'ps4SizeGB:\s*([0-9]+)') { [int]$matches[1] } else { 0 }
    $pcSize = if ($block -match 'pcSizeGB:\s*([0-9]+)') { [int]$matches[1] } else { 0 }
    $cdPrice = if ($block -match 'cdPrice:\s*([0-9]+)') { [int]$matches[1] } else { 15000 }
    $onlinePrice = if ($block -match 'onlinePrice:\s*([0-9]+)') { [int]$matches[1] } else { 5000 }
    $moddedPrice = if ($block -match 'moddedPrice:\s*([0-9]+)') { [int]$matches[1] } else { 2000 }
    $cover = if ($block -match 'cover:\s*''([^'']+)''') { $matches[1] } else { '' }
    $desc = if ($block -match 'description:\s*''([^'']+)''') { $matches[1] } else { '' }
    
    $platforms = @()
    if ($block -match 'platforms:\s*\[([^\]]+)\]') {
        $platMatches = [regex]::Matches($matches[1], '''([^'']+)''')
        foreach ($pm in $platMatches) { $platforms += $pm.Groups[1].Value }
    }

    $gameObject = [PSCustomObject]@{
        id = $id
        title = $title
        genre = $genre
        rating = $rating
        year = $year
        badge = $badge
        platforms = $platforms
        ps4SizeGB = $ps4Size
        pcSizeGB = $pcSize
        cdPrice = $cdPrice
        onlinePrice = $onlinePrice
        moddedPrice = $moddedPrice
        cover = $cover
        description = $desc
    }
    $jsonList += $gameObject

    # Build SQL Insert
    $escapedTitle = $title.Replace("'", "''")
    $escapedDesc = $desc.Replace("'", "''")
    $escapedBadge = $badge.Replace("'", "''")
    $escapedGenre = $genre.Replace("'", "''")

    $sqlLines += "INSERT INTO games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description) VALUES ('$id', '$escapedTitle', '$escapedGenre', $rating, $year, '$escapedBadge', $ps4Size, $pcSize, $cdPrice, $onlinePrice, $moddedPrice, '$cover', '$escapedDesc');"
    
    foreach ($p in $platforms) {
        $sqlLines += "INSERT INTO game_platforms (game_id, platform) VALUES ('$id', '$p');"
    }
}

$sqlLines += ""
$sqlLines += "COMMIT;"

# Write seed.sql
[System.IO.File]::WriteAllLines('c:\Users\HP\OneDrive\Documenten\Legends Codes\Legend Games\db\seed.sql', $sqlLines, [System.Text.Encoding]::UTF8)

# Write games.json
$jsonStr = ConvertTo-Json -InputObject $jsonList -Depth 5
[System.IO.File]::WriteAllText('c:\Users\HP\OneDrive\Documenten\Legends Codes\Legend Games\db\games.json', $jsonStr, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText('c:\Users\HP\OneDrive\Documenten\Legends Codes\Legend Games\shared\data\games.json', $jsonStr, [System.Text.Encoding]::UTF8)

Write-Host "Generated db/games.json with $($jsonList.Count) items and db/seed.sql with $($sqlLines.Count) lines!"
