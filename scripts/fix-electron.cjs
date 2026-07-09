const { existsSync, readFileSync, rmSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')

const root = join(__dirname, '..')
const electronDir = join(root, 'node_modules', 'electron')
const installScript = join(electronDir, 'install.js')
const distDir = join(electronDir, 'dist')
const pathFile = join(electronDir, 'path.txt')

function getExpectedBinaryName() {
  if (process.platform === 'win32') return 'electron.exe'
  if (process.platform === 'darwin') return join('Electron.app', 'Contents', 'MacOS', 'Electron')
  return 'electron'
}

function getBinaryPath() {
  const name = getExpectedBinaryName()
  if (process.platform === 'darwin') {
    return join(distDir, name)
  }
  if (existsSync(pathFile)) {
    try {
      const relative = readFileSync(pathFile, 'utf8').trim()
      return join(distDir, relative)
    } catch {
      // fall through
    }
  }
  return join(distDir, name)
}

function binaryExists() {
  const direct = join(distDir, getExpectedBinaryName())
  if (existsSync(direct)) return true
  const fromPath = getBinaryPath()
  return existsSync(fromPath)
}

function listDist() {
  try {
    const { readdirSync } = require('fs')
    const files = readdirSync(distDir)
    return files.length ? files.join(', ') : '(empty)'
  } catch {
    return '(missing)'
  }
}

if (!existsSync(installScript)) {
  console.error('[visualcoding] Run npm install first — electron package is missing.')
  process.exit(1)
}

if (binaryExists()) {
  console.log('[visualcoding] Electron binary already present:', getBinaryPath())
  process.exit(0)
}

console.log('[visualcoding] Electron binary missing. Cleaning partial install...')
console.log('[visualcoding] Current dist contents:', listDist())

for (const target of [distDir, pathFile, join(electronDir, 'electron.d.ts')]) {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true })
  }
}

console.log('[visualcoding] Downloading Electron (this can take a minute)...')

const result = spawnSync(process.execPath, [installScript], {
  stdio: 'inherit',
  cwd: electronDir,
  env: {
    ...process.env,
    force_no_cache: 'true'
  }
})

if (result.status !== 0) {
  console.error('\n[visualcoding] Electron download failed.')
  printWindowsHelp()
  process.exit(result.status ?? 1)
}

if (!binaryExists()) {
  console.error('\n[visualcoding] Install reported success but electron.exe is STILL missing.')
  console.error('[visualcoding] dist folder now contains:', listDist())
  printWindowsHelp()
  process.exit(1)
}

console.log('\n[visualcoding] Electron installed OK:', getBinaryPath())

function printWindowsHelp() {
  if (process.platform !== 'win32') return
  console.error(`
Windows almost always causes this when antivirus deletes electron.exe right after download.

Try these steps:
  1. Open Windows Security → Virus & threat protection → Manage settings
  2. Add an exclusion for folder: ${root}
  3. Check Protection history for quarantined electron.exe → Restore it
  4. Run again: npm run fix-electron

If your PC uses Norton/McAfee/etc., add the same folder exclusion there too.
`)
}
