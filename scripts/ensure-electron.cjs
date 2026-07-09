const { spawnSync } = require('child_process')
const { join } = require('path')

const fixScript = join(__dirname, 'fix-electron.cjs')
const result = spawnSync(process.execPath, [fixScript], { stdio: 'inherit' })
process.exit(result.status ?? 1)
