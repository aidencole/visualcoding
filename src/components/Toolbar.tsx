import React from 'react'

interface ToolbarProps {
  projectName: string
  projectPath: string | null
  isBuilding: boolean
  onNewProject: () => void
  onOpenProject: () => void
  onSave: () => void
  onExport: () => void
  onPlay: () => void
  onStop: () => void
  onOpenAssets: () => void
}

export function Toolbar({
  projectName,
  projectPath,
  isBuilding,
  onNewProject,
  onOpenProject,
  onSave,
  onExport,
  onPlay,
  onStop,
  onOpenAssets
}: ToolbarProps): JSX.Element {
  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <h1 className="logo">VisualCoding</h1>
        <span className="project-label">
          {projectPath ? projectName : 'No project open'}
        </span>
      </div>
      <div className="toolbar-actions">
        <button onClick={onNewProject} title="Create new project">
          New
        </button>
        <button onClick={onOpenProject} title="Open existing project">
          Open
        </button>
        <button onClick={onSave} disabled={!projectPath} title="Save workspace">
          Save
        </button>
        <button onClick={onOpenAssets} disabled={!projectPath} title="Open assets folder">
          Assets
        </button>
        <button onClick={onExport} disabled={!projectPath || isBuilding} className="primary" title="Generate mod code">
          Export Mod
        </button>
        <button
          onClick={onPlay}
          disabled={!projectPath || isBuilding}
          className="play"
          title="Launches a separate Fabric dev Minecraft (not your normal launcher) with your mod loaded"
        >
          ▶ Test Mod (Fabric)
        </button>
        {isBuilding && (
          <button onClick={onStop} className="danger">
            Stop
          </button>
        )}
      </div>
    </header>
  )
}
