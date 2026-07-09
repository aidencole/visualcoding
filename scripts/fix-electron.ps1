# VisualCoding — Windows Electron installer (downloads into excluded project folder)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ElectronDir = Join-Path $Root "node_modules\electron"
$Dist = Join-Path $ElectronDir "dist"
$Cache = Join-Path $Root ".electron-cache"
$Pkg = Get-Content (Join-Path $ElectronDir "package.json") | ConvertFrom-Json
$Version = $Pkg.version
$Zip = Join-Path $Cache "electron-v$Version-win32-x64.zip"
$Url = "https://github.com/electron/electron/releases/download/v$Version/electron-v$Version-win32-x64.zip"

Write-Host "[visualcoding] Electron version: $Version"
Write-Host "[visualcoding] Download URL: $Url"

New-Item -ItemType Directory -Force -Path $Cache | Out-Null
if (Test-Path $Dist) { Remove-Item -Recurse -Force $Dist }
New-Item -ItemType Directory -Force -Path $Dist | Out-Null

Write-Host "[visualcoding] Downloading (may take a few minutes)..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $Url -OutFile $Zip -UseBasicParsing

Write-Host "[visualcoding] Extracting..."
Expand-Archive -Path $Zip -DestinationPath $Dist -Force

$Exe = Join-Path $Dist "electron.exe"
if (-not (Test-Path $Exe)) {
    foreach ($dir in Get-ChildItem $Dist -Directory) {
        $nested = Join-Path $dir.FullName "electron.exe"
        if (Test-Path $nested) {
            Write-Host "[visualcoding] Moving files from nested folder..."
            Get-ChildItem $dir.FullName | ForEach-Object {
                Move-Item $_.FullName -Destination $Dist -Force
            }
            Remove-Item $dir.FullName -Recurse -Force
            break
        }
    }
}

if (-not (Test-Path $Exe)) {
    $files = (Get-ChildItem $Dist | Select-Object -ExpandProperty Name) -join ", "
    Write-Error "electron.exe still missing. dist contains: $files"
}

Set-Content -Path (Join-Path $ElectronDir "path.txt") -Value "electron.exe" -NoNewline
Write-Host "[visualcoding] SUCCESS: $Exe"
Get-Item $Exe | Select-Object FullName, Length, LastWriteTime
