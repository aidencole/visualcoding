import React, { useEffect, useRef } from 'react'
import * as Blockly from 'blockly'
import { registerBlocks, toolboxXml } from '../blocks'

interface BlocklyEditorProps {
  workspaceJson?: object
  onWorkspaceChange: (workspace: object) => void
}

export function BlocklyEditor({ workspaceJson, onWorkspaceChange }: BlocklyEditorProps): JSX.Element {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

  useEffect(() => {
    if (!blocklyDiv.current) return

    registerBlocks()

    const toolboxDom = Blockly.utils.xml.textToDom(toolboxXml)
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxDom,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#2a2a3e',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 2,
        minScale: 0.3
      },
      theme: Blockly.Theme.defineTheme('visualcoding', {
        base: Blockly.Themes.Zelos,
        componentStyles: {
          workspaceBackgroundColour: '#1a1a2e',
          toolboxBackgroundColour: '#16213e',
          toolboxForegroundColour: '#e8e8e8',
          flyoutBackgroundColour: '#16213e',
          flyoutForegroundColour: '#e8e8e8',
          scrollbarColour: '#4a4a6a',
          insertionMarkerColour: '#6c63ff',
          insertionMarkerOpacity: 0.4
        }
      }),
      trashcan: true,
      sounds: false
    })

    workspaceRef.current = workspace

    if (workspaceJson && Object.keys(workspaceJson).length > 0) {
      Blockly.serialization.workspaces.load(workspaceJson, workspace)
    }

    const changeListener = (): void => {
      const json = Blockly.serialization.workspaces.save(workspace)
      onWorkspaceChange(json)
    }
    workspace.addChangeListener(changeListener)

    return () => {
      workspace.removeChangeListener(changeListener)
      workspace.dispose()
    }
  }, [])

  useEffect(() => {
    if (!workspaceRef.current || !workspaceJson) return
    // Only load external workspace on first mount - handled above
  }, [workspaceJson])

  return <div ref={blocklyDiv} className="blockly-container" />
}

export function getWorkspaceFromEditor(): Blockly.Workspace | null {
  return null
}
