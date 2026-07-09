const { existsSync, readFileSync, rmSync, readdirSync, statSync, cpSync, writeFileSync, mkdirSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')

const root = join(__dirname, '..')
const electronDir = join(root, 'node_modules', 'electron')
const distDir = join(electronDir, 'dist')
const pathFile = join(electronDir, 'path.txt')
const cacheDir = join(root, '.electron-cache')

function getExpectedBinaryName() {
  if (process.platform === 'win32') return 'electron.exe'
  if (process.platform === 'darwin') return join('Electron.app', 'Contents', 'MacOS', 'Electron')
  return 'electron'
}

function getPlatformPath() {
  if (process.platform === 'win32') return 'electron.exe'
  if (process.platform === 'darwin') return 'Electron.app/Contents/MacOS/Electron'
  return 'electron'
}

function getBinaryPath() {
  const name = getExpectedBinaryName()
  if (process.platform === 'darwin') return join(distDir, name)
  return join(distDir, process.platform === 'win32' ? 'electron.exe' : 'electron')
}

function binaryExists() {
  return existsSync(getBinaryPath())
}

function listDist() {
  try {
    const files = readdirSync(distDir)
    return files.length ? files.join(', ') : '(empty)'
  } catch {
    return '(missing)'
  }
}

function cleanInstall() {
  for (const target of [distDir, pathFile, join(electronDir, 'electron.d.ts')]) {
    if (existsSync(target)) rmSync(target, { recursive: true, force: true })
  }
  mkdirSync(distDir, { recursive: true })
}

function flattenNestedDist() {
  if (binaryExists()) return
  if (!existsSync(distDir)) return

  for (const entry of readdirSync(distDir)) {
    const sub = join(distDir, entry)
    if (!statSync(sub).isDirectory()) continue
    const nestedExe = join(sub, process.platform === 'win32' ? 'electron.exe' : 'electron')
    if (!existsSync(nestedExe)) continue
    for (const file of readdirSync(sub)) {
      const src = join(sub, file)
      const dest = join(distDir, file)
      if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
      cpSync(src, dest, { recursive: true })
    }
    rmSync(sub, { recursive: true, force: true })
    return
  }
}

function finalizeInstall(version) {
  flattenNestedDist()
  writeFileSync(pathFile, getPlatformPath())
  const electronDts = join(distDir, 'electron.d.ts')
  if (existsSync(electronDts)) {
    cpSync(electronDts, join(electronDir, 'electron.d.ts'))
    rmSync(electronDts, { force: true })
  }
  if (!existsSync(join(distDir, 'version'))) {
    writeFileSync(join(distDir, 'version'), `v${version}`)
  }
}

async function downloadIntoProject(version) {
  const { downloadArtifact } = require('@electron/get')
  const extract = require('extract-zip')

  mkdirSync(cacheDir, { recursive: true })
  console.log('[visualcoding] Downloading Electron', version, 'into project cache (inside your exclusion folder)...')
  console.log('[visualcoding] Cache:', cacheDir)

  const zipPath = await downloadArtifact({
    version,
    artifactName: 'electron',
    platform: process.platform === 'win32' ? 'win32' : process.platform,
    arch: process.arch,
    force: true,
    cacheRoot: cacheDir
  })

  console.log('[visualcoding] Zip downloaded:', zipPath)
  console.log('[visualcoding] Extracting to:', distDir)

  await extract(zipPath, { dir: distDir })
  console.log('[visualcoding] Extracted files:', listDist())
}

async function main() {
  const pkg = JSON.parse(readFileSync(join(electronDir, 'package.json'), 'utf8'))
  const version = pkg.version

  if (!existsSync(join(electronDir, 'install.js'))) {
    console.error('[visualcoding] Run npm install first.')
    process.exit(1)
  }

  if (binaryExists()) {
    console.log('[visualcoding] Electron OK:', getBinaryPath())
    return
  }

  console.log('[visualcoding] Electron binary missing.')
  console.log('[visualcoding] Current dist:', listDist())
  cleanInstall()

  try {
    await downloadIntoProject(version)
    finalizeInstall(version)
  } catch (err) {
    console.error('[visualcoding] Direct download failed:', err.message)
    if (process.platform === 'win32') {
      console.log('[visualcoding] Trying PowerShell fallback...')
      const ps = spawnSync(
        'powershell',
        ['-ExecutionPolicy', 'Bypass', '-File', join(__dirname, 'fix-electron.ps1')],
        { stdio: 'inherit', cwd: root }
      )
      if (ps.status !== 0) {
        printWindowsHelp()
        process.exit(ps.status ?? 1)
      }
    } else {
      printWindowsHelp()
      process.exit(1)
    }
  }

  flattenNestedDist()
  if (!binaryExists()) {
    console.error('\n[visualcoding] electron.exe is STILL missing after extract.')
    console.error('[visualcoding] dist contains:', listDist())
    printWindowsHelp()
    process.exit(1)
  }

  console.log('\n[visualcoding] Electron installed OK:', getBinaryPath())
}

function printWindowsHelp() {
  if (process.platform !== 'win32') return
  console.error(`
=== Windows fix checklist ===

Your exclusion is set, but Windows may STILL block Electron in these locations:
  • ${cacheDir}
  • ${join(process.env.LOCALAPPDATA || '', 'electron', 'Cache')}
  • ${process.env.TEMP || 'Temp'}

Add ALL of the above as exclusions, OR try the manual PowerShell installer:
  powershell -ExecutionPolicy Bypass -File scripts\\fix-electron.ps1

Last resort — manual install:
  1. Open: https://github.com/electron/electron/releases/tag/v33.4.11
  2. Download: electron-v33.4.11-win32-x64.zip
  3. Delete folder: node_modules\\electron\\dist
  4. Extract ALL zip contents into: node_modules\\electron\\dist
  5. Confirm electron.exe exists, then run: npm run dev
`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
