import React, { useCallback, useEffect, useState } from 'react'
import * as Blockly from 'blockly'
import { BlocklyEditor } from './components/BlocklyEditor'
import { Toolbar } from './components/Toolbar'
import { BuildLog } from './components/BuildLog'
import { AssetPanel } from './components/AssetPanel'
import { NewProjectDialog } from './components/NewProjectDialog'
import { generateModProject, type ProjectMeta } from './generator'
import './App.css'

export default function App(): JSX.Element {
  const [projectPath, setProjectPath] = useState<string | null>(null)
  const [meta, setMeta] = useState<ProjectMeta | null>(null)
  const [workspaceJson, setWorkspaceJson] = useState<object>({})
  const [assets, setAssets] = useState<{ path: string; type: string }[]>([])
  const [buildOutput, setBuildOutput] = useState('')
  const [showBuildLog, setShowBuildLog] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)

  const refreshAssets = useCallback(async (path: string) => {
    const list = await window.visualCoding.listAssets(path)
    setAssets(list)
  }, [])

  const loadProject = useCallback(
    async (path: string) => {
      const data = await window.visualCoding.loadProject(path)
      setProjectPath(path)
      setMeta(data.meta)
      setWorkspaceJson(data.workspace as object)
      await refreshAssets(path)
    },
    [refreshAssets]
  )

  useEffect(() => {
    const unsub = window.visualCoding.onBuildOutput((text) => {
      setBuildOutput((prev) => prev + text)
    })
    return unsub
  }, [])

  const handleOpenProject = async (): Promise<void> => {
    const path = await window.visualCoding.openProject()
    if (!path) return
    try {
      await loadProject(path)
    } catch {
      setShowNewDialog(true)
      setProjectPath(path)
    }
  }

  const handleNewProject = (): void => {
    setShowNewDialog(true)
  }

  const handleCreateProject = async (modId: string, modName: string): Promise<void> => {
    let path = projectPath
    if (!path) {
      path = await window.visualCoding.openProject()
      if (!path) return
    }
    const projectMeta = await window.visualCoding.initProject(path, modId, modName)
    setShowNewDialog(false)
    await loadProject(path)
    setMeta(projectMeta)
  }

  const getActiveWorkspace = (): Blockly.Workspace | null => {
    return Blockly.getMainWorkspace() ?? null
  }

  const handleSave = async (): Promise<void> => {
    if (!projectPath) return
    await window.visualCoding.saveWorkspace(projectPath, workspaceJson)
  }

  const handleExport = async (): Promise<void> => {
    if (!projectPath || !meta) return
    const workspace = getActiveWorkspace()
    if (!workspace) return

    setBuildOutput('')
    setShowBuildLog(true)
    setBuildOutput('Generating mod files...\n')

    try {
      const files = generateModProject(workspace, {
        modId: meta.modId,
        modName: meta.modName,
        minecraftVersion: meta.minecraftVersion
      })
      await window.visualCoding.cleanGeneratedSources(projectPath)
      await window.visualCoding.writeGeneratedFiles(projectPath, files)
      await window.visualCoding.syncBuildFiles(projectPath)
      await window.visualCoding.copyAssets(projectPath)
      setBuildOutput((prev) => prev + `Generated ${Object.keys(files).length} files.\n`)
      setBuildOutput((prev) => prev + 'Gradle build files synced.\n')
      setBuildOutput((prev) => prev + 'Assets copied to mod resources.\n')
      await refreshAssets(projectPath)
    } catch (err) {
      setBuildOutput((prev) => prev + `Error: ${err instanceof Error ? err.message : String(err)}\n`)
    }
  }

  const handlePlay = async (): Promise<void> => {
    if (!projectPath || !meta) return
    setIsBuilding(true)
    setBuildOutput('')
    setShowBuildLog(true)

    try {
      await handleExport()
      setBuildOutput((prev) => prev + '\nLaunching Fabric dev client (Gradle runClient)...\n')
      setBuildOutput((prev) => prev + 'This is a separate test Minecraft with Fabric Loader + Fabric API + your mod.\n')
      setBuildOutput((prev) => prev + 'It is NOT your normal launcher — look for "Fabric" on the main menu.\n\n')
      const result = await window.visualCoding.buildRun(projectPath, 'runClient')
      if (result.code === 0) {
        setBuildOutput((prev) => prev + '\nMinecraft closed.\n')
      } else {
        setBuildOutput((prev) => prev + `\nBuild exited with code ${result.code}.\n`)
      }
    } catch (err) {
      setBuildOutput((prev) => prev + `Error: ${err instanceof Error ? err.message : String(err)}\n`)
    } finally {
      setIsBuilding(false)
    }
  }

  const handleStop = async (): Promise<void> => {
    await window.visualCoding.buildStop()
    setIsBuilding(false)
  }

  const handleOpenAssets = async (): Promise<void> => {
    if (!projectPath) return
    await window.visualCoding.openPath(`${projectPath}/assets`)
  }

  return (
    <div className="app">
      <Toolbar
        projectName={meta?.modName ?? 'VisualCoding'}
        projectPath={projectPath}
        isBuilding={isBuilding}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSave={handleSave}
        onExport={handleExport}
        onPlay={handlePlay}
        onStop={handleStop}
        onOpenAssets={handleOpenAssets}
      />

      <div className="main-content">
        <AssetPanel assets={assets} projectPath={projectPath} />
        <div className="editor-area">
          {!projectPath ? (
            <div className="welcome">
              <h2>Welcome to VisualCoding</h2>
              <p>Create visual Minecraft mods for Fabric 26.2 — no coding required.</p>
              <div className="welcome-actions">
                <button className="primary" onClick={handleNewProject}>
                  Create New Project
                </button>
                <button onClick={handleOpenProject}>Open Project</button>
              </div>
              <ul className="welcome-features">
                <li>Custom items, blocks, armor</li>
                <li>Animated mobs with AI (Geckolib)</li>
                <li>Player emotes</li>
                <li>Particles, screenshake, sounds</li>
                <li>▶ Test Mod (Fabric) — dev Minecraft with Fabric built in</li>
              </ul>
            </div>
          ) : (
            <BlocklyEditor workspaceJson={workspaceJson} onWorkspaceChange={setWorkspaceJson} />
          )}
        </div>
      </div>

      <BuildLog output={buildOutput} visible={showBuildLog} onClose={() => setShowBuildLog(false)} />

      {showNewDialog && (
        <NewProjectDialog
          onConfirm={handleCreateProject}
          onCancel={() => {
            setShowNewDialog(false)
            if (!meta) setProjectPath(null)
          }}
        />
      )}
    </div>
  )
}
