const { existsSync, readFileSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')

const electronDir = join(__dirname, '..', 'node_modules', 'electron')
const pathFile = join(electronDir, 'path.txt')
const installScript = join(electronDir, 'install.js')

function electronBinaryExists() {
  if (!existsSync(pathFile)) return false
  try {
    const relativePath = readFileSync(pathFile, 'utf8').trim()
    const binaryPath = join(electronDir, relativePath)
    return existsSync(binaryPath)
  } catch {
    return false
  }
}

if (!existsSync(installScript)) {
  console.warn('[visualcoding] electron package not found — run npm install first.')
  process.exit(0)
}

if (!electronBinaryExists()) {
  console.log('[visualcoding] Electron app binary is missing. Downloading now...')
  const result = spawnSync(process.execPath, [installScript], {
    stdio: 'inherit',
    cwd: electronDir,
    env: process.env
  })
  if (result.status !== 0) {
    console.error(
      '[visualcoding] Electron download failed. Try: npm run fix-electron'
    )
    process.exit(result.status ?? 1)
  }
  console.log('[visualcoding] Electron installed successfully.')
}
