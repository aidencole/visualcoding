import React from 'react'

interface AssetPanelProps {
  assets: { path: string; type: string }[]
  projectPath: string | null
}

export function AssetPanel({ assets, projectPath }: AssetPanelProps): JSX.Element {
  if (!projectPath) {
    return (
      <aside className="side-panel">
        <h3>Assets</h3>
        <p className="hint">Open a project to see assets.</p>
        <p className="hint small">
          Put models in <code>assets/geo/</code>, animations in <code>assets/animations/</code>, and
          textures in <code>assets/textures/</code>.
        </p>
      </aside>
    )
  }

  return (
    <aside className="side-panel">
      <h3>Project Assets</h3>
      <p className="hint small">Reference these paths in your blocks.</p>
      <ul className="asset-list">
        {assets.length === 0 && <li className="hint">No assets yet — add files to the assets folder.</li>}
        {assets.map((a) => (
          <li key={a.path} className={`asset-item asset-${a.type}`}>
            <span className="asset-type">{a.type}</span>
            <span className="asset-path">{a.path}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
