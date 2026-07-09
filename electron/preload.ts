import { contextBridge, ipcRenderer } from 'electron'

export interface ProjectMeta {
  modId: string
  modName: string
  minecraftVersion: string
  loader: string
  createdAt: string
}

contextBridge.exposeInMainWorld('visualCoding', {
  openProject: (): Promise<string | null> => ipcRenderer.invoke('dialog:openProject'),
  pickFile: (filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
    ipcRenderer.invoke('dialog:pickFile', filters),
  initProject: (projectPath: string, modId: string, modName: string): Promise<ProjectMeta> =>
    ipcRenderer.invoke('project:init', projectPath, modId, modName),
  loadProject: (projectPath: string): Promise<{ meta: ProjectMeta; workspace: unknown; projectPath: string }> =>
    ipcRenderer.invoke('project:load', projectPath),
  saveWorkspace: (projectPath: string, workspace: unknown): Promise<void> =>
    ipcRenderer.invoke('project:saveWorkspace', projectPath, workspace),
  cleanGeneratedSources: (projectPath: string): Promise<void> =>
    ipcRenderer.invoke('project:cleanGeneratedSources', projectPath),
    ipcRenderer.invoke('project:writeGeneratedFiles', projectPath, files),
  syncBuildFiles: (projectPath: string): Promise<void> =>
    ipcRenderer.invoke('project:syncBuildFiles', projectPath),
  copyAssets: (projectPath: string): Promise<void> => ipcRenderer.invoke('project:copyAssets', projectPath),
  listAssets: (projectPath: string): Promise<{ path: string; type: string }[]> =>
    ipcRenderer.invoke('project:listAssets', projectPath),
  buildRun: (projectPath: string, task: string): Promise<{ code: number; output: string }> =>
    ipcRenderer.invoke('build:run', projectPath, task),
  buildStop: (): Promise<void> => ipcRenderer.invoke('build:stop'),
  onBuildOutput: (callback: (text: string) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, text: string): void => callback(text)
    ipcRenderer.on('build:output', handler)
    return () => ipcRenderer.removeListener('build:output', handler)
  },
  openPath: (targetPath: string): Promise<void> => ipcRenderer.invoke('shell:openPath', targetPath),
  showItemInFolder: (targetPath: string): Promise<void> => ipcRenderer.invoke('shell:showItemInFolder', targetPath)
})
