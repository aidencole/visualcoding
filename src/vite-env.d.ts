export interface ProjectMeta {
  modId: string
  modName: string
  minecraftVersion: string
  loader: string
  createdAt: string
}

export interface VisualCodingAPI {
  openProject: () => Promise<string | null>
  pickFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>
  initProject: (projectPath: string, modId: string, modName: string) => Promise<ProjectMeta>
  loadProject: (projectPath: string) => Promise<{ meta: ProjectMeta; workspace: unknown; projectPath: string }>
  saveWorkspace: (projectPath: string, workspace: unknown) => Promise<void>
  cleanGeneratedSources: (projectPath: string) => Promise<void>
  writeGeneratedFiles: (projectPath: string, files: Record<string, string>) => Promise<void>
  syncBuildFiles: (projectPath: string) => Promise<void>
  copyAssets: (projectPath: string) => Promise<void>
  listAssets: (projectPath: string) => Promise<{ path: string; type: string }[]>
  buildRun: (projectPath: string, task: string) => Promise<{ code: number; output: string }>
  buildStop: () => Promise<void>
  onBuildOutput: (callback: (text: string) => void) => () => void
  openPath: (targetPath: string) => Promise<void>
  showItemInFolder: (targetPath: string) => Promise<void>
}

declare global {
  interface Window {
    visualCoding: VisualCodingAPI
  }
}

export {}
