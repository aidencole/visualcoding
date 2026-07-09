import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import { join, dirname } from 'path'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  cpSync,
  readdirSync,
  statSync
} from 'fs'

let mainWindow: BrowserWindow | null = null
let runningProcess: ChildProcess | null = null

function getTemplatesPath(): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'templates')
  }
  return join(app.getAppPath(), 'templates')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'VisualCoding',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (runningProcess) {
    runningProcess.kill()
    runningProcess = null
  }
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('dialog:openProject', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Open or Create Project Folder'
  })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
})

ipcMain.handle('dialog:pickFile', async (_event, filters?: { name: string; extensions: string[] }[]) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: filters ?? [{ name: 'All Files', extensions: ['*'] }],
    title: 'Select File'
  })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
})

ipcMain.handle('project:init', async (_event, projectPath: string, modId: string, modName: string) => {
  const templatePath = join(getTemplatesPath(), 'fabric-mod')
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`)
  }

  mkdirSync(projectPath, { recursive: true })
  mkdirSync(join(projectPath, 'assets'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'geo'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'animations'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'textures'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'textures', 'entity'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'textures', 'item'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'textures', 'block'), { recursive: true })
  mkdirSync(join(projectPath, 'assets', 'textures', 'particle'), { recursive: true })
  mkdirSync(join(projectPath, 'generated'), { recursive: true })

  cpSync(templatePath, join(projectPath, 'generated'), { recursive: true })

  const projectMeta = {
    modId,
    modName,
    minecraftVersion: '26.2',
    loader: 'fabric',
    createdAt: new Date().toISOString()
  }
  writeFileSync(join(projectPath, 'project.json'), JSON.stringify(projectMeta, null, 2))

  const workspace = { blocks: { languageVersion: 0, blocks: [] } }
  writeFileSync(join(projectPath, 'workspace.json'), JSON.stringify(workspace, null, 2))

  return projectMeta
})

ipcMain.handle('project:load', async (_event, projectPath: string) => {
  const metaPath = join(projectPath, 'project.json')
  const workspacePath = join(projectPath, 'workspace.json')
  if (!existsSync(metaPath)) {
    throw new Error('Not a VisualCoding project (missing project.json)')
  }
  const meta = JSON.parse(readFileSync(metaPath, 'utf-8'))
  const workspace = existsSync(workspacePath)
    ? JSON.parse(readFileSync(workspacePath, 'utf-8'))
    : { blocks: { languageVersion: 0, blocks: [] } }
  return { meta, workspace, projectPath }
})

ipcMain.handle('project:saveWorkspace', async (_event, projectPath: string, workspace: unknown) => {
  writeFileSync(join(projectPath, 'workspace.json'), JSON.stringify(workspace, null, 2))
})

ipcMain.handle('project:cleanGeneratedSources', async (_event, projectPath: string) => {
  const generatedRoot = join(projectPath, 'generated')
  for (const sub of ['src/main/java', 'src/client/java', 'src/main/resources']) {
    const target = join(generatedRoot, sub)
    if (existsSync(target)) rmSync(target, { recursive: true, force: true })
  }
})

ipcMain.handle('project:writeGeneratedFiles', async (_event, projectPath: string, files: Record<string, string>) => {
  const generatedRoot = join(projectPath, 'generated')
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = join(generatedRoot, relativePath)
    mkdirSync(dirname(fullPath), { recursive: true })
    writeFileSync(fullPath, content, 'utf-8')
  }
})

ipcMain.handle('project:syncBuildFiles', async (_event, projectPath: string) => {
  const templatePath = join(getTemplatesPath(), 'fabric-mod')
  const generatedRoot = join(projectPath, 'generated')
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`)
  }

  const rootFiles = ['build.gradle', 'settings.gradle', 'gradlew', 'gradlew.bat', 'LICENSE']
  for (const file of rootFiles) {
    const src = join(templatePath, file)
    if (existsSync(src)) {
      cpSync(src, join(generatedRoot, file))
    }
  }

  const gradleWrapper = join(templatePath, 'gradle')
  if (existsSync(gradleWrapper)) {
    cpSync(gradleWrapper, join(generatedRoot, 'gradle'), { recursive: true })
  }
})

ipcMain.handle('project:copyAssets', async (_event, projectPath: string) => {
  const assetsSrc = join(projectPath, 'assets')
  const assetsDest = join(projectPath, 'generated', 'src', 'main', 'resources', 'assets')
  if (!existsSync(assetsSrc)) return

  function copyRecursive(src: string, dest: string): void {
    mkdirSync(dest, { recursive: true })
    for (const entry of readdirSync(src)) {
      const srcPath = join(src, entry)
      const destPath = join(dest, entry)
      if (statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath)
      } else {
        cpSync(srcPath, destPath)
      }
    }
  }
  copyRecursive(assetsSrc, assetsDest)
})

ipcMain.handle('project:listAssets', async (_event, projectPath: string) => {
  const assetsRoot = join(projectPath, 'assets')
  if (!existsSync(assetsRoot)) return []

  const files: { path: string; type: string }[] = []
  function walk(dir: string, rel = ''): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      const relPath = rel ? `${rel}/${entry}` : entry
      if (statSync(full).isDirectory()) {
        walk(full, relPath)
      } else {
        const ext = entry.split('.').pop()?.toLowerCase() ?? ''
        let type = 'other'
        if (['png', 'jpg', 'jpeg'].includes(ext)) type = 'texture'
        else if (ext === 'json' && relPath.includes('geo')) type = 'geo'
        else if (ext === 'json' && relPath.includes('animations')) type = 'animation'
        else if (ext === 'json') type = 'json'
        files.push({ path: relPath.replace(/\\/g, '/'), type })
      }
    }
  }
  walk(assetsRoot)
  return files
})

function runGradle(projectPath: string, task: string): Promise<{ code: number; output: string }> {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32'
    const gradleCmd = isWin ? 'gradlew.bat' : './gradlew'
    const cwd = join(projectPath, 'generated')

    if (runningProcess) {
      runningProcess.kill()
      runningProcess = null
    }

    let output = ''
    const proc = spawn(gradleCmd, [task], {
      cwd,
      shell: isWin,
      env: { ...process.env }
    })
    runningProcess = proc

    proc.stdout.on('data', (data: Buffer) => {
      const text = data.toString()
      output += text
      mainWindow?.webContents.send('build:output', text)
    })
    proc.stderr.on('data', (data: Buffer) => {
      const text = data.toString()
      output += text
      mainWindow?.webContents.send('build:output', text)
    })
    proc.on('close', (code) => {
      runningProcess = null
      resolve({ code: code ?? 1, output })
    })
    proc.on('error', (err) => {
      output += `\nError: ${err.message}\n`
      runningProcess = null
      resolve({ code: 1, output })
    })
  })
}

ipcMain.handle('build:run', async (_event, projectPath: string, task: string) => {
  return runGradle(projectPath, task)
})

ipcMain.handle('build:stop', async () => {
  if (runningProcess) {
    runningProcess.kill()
    runningProcess = null
  }
})

ipcMain.handle('shell:openPath', async (_event, targetPath: string) => {
  await shell.openPath(targetPath)
})

ipcMain.handle('shell:showItemInFolder', async (_event, targetPath: string) => {
  shell.showItemInFolder(targetPath)
})
