import * as Blockly from 'blockly'
import { ProjectMeta } from './utils'
import { parseWorkspace } from './parser'
import { generateAllFiles } from './templates'

export function generateModProject(workspace: Blockly.Workspace, meta: ProjectMeta): Record<string, string> {
  const parsed = parseWorkspace(workspace, { ...meta })
  return generateAllFiles(parsed)
}

export type { ProjectMeta } from './utils'
