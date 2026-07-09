import React, { useState } from 'react'

interface NewProjectDialogProps {
  onConfirm: (modId: string, modName: string) => void
  onCancel: () => void
}

export function NewProjectDialog({ onConfirm, onCancel }: NewProjectDialogProps): JSX.Element {
  const [modId, setModId] = useState('mymod')
  const [modName, setModName] = useState('My Mod')

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Project</h2>
        <label>
          Mod ID (lowercase, no spaces)
          <input value={modId} onChange={(e) => setModId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} />
        </label>
        <label>
          Mod Name
          <input value={modName} onChange={(e) => setModName(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="primary" onClick={() => onConfirm(modId, modName)} disabled={!modId}>
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
