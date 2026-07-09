import React from 'react'

interface BuildLogProps {
  output: string
  visible: boolean
  onClose: () => void
}

export function BuildLog({ output, visible, onClose }: BuildLogProps): JSX.Element | null {
  if (!visible) return null

  return (
    <div className="build-log">
      <div className="build-log-header">
        <span>Build Output</span>
        <button onClick={onClose}>×</button>
      </div>
      <pre className="build-log-content">{output || 'Waiting for output...'}</pre>
    </div>
  )
}
