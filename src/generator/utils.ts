import * as Blockly from 'blockly'

export function toClassName(id: string): string {
  return id
    .split(/[_-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('')
}

export function toConstant(id: string): string {
  return id.toUpperCase().replace(/[^A-Z0-9]/g, '_')
}

export function getNumber(block: Blockly.Block | null, input: string, fallback: number): number {
  if (!block) return fallback
  const target = block.getInputTargetBlock(input)
  if (!target) return fallback
  return Number(target.getFieldValue('NUM') ?? fallback)
}

export function escapeJava(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export interface ProjectMeta {
  modId: string
  modName: string
  minecraftVersion: string
}

export interface ActionContext {
  modId: string
  playerVar?: string
  indent: string
}

export interface MobAIConfig {
  wander: boolean
  chaseRange: number
  attackRange: number
}

export interface MobAnimConfig {
  idle: string
  walk: string
  attack: string
}

export interface ItemDef {
  id: string
  name: string
  texture: string
  className: string
  rightClickActions: string[]
}

export interface BlockDef {
  id: string
  name: string
  texture: string
  hardness: number
  className: string
  interactActions: string[]
}

export interface ArmorDef {
  id: string
  name: string
  texture: string
  slot: string
  protection: number
  className: string
}

export interface MobDef {
  id: string
  name: string
  geo: string
  animations: string
  texture: string
  health: number
  speed: number
  damage: number
  className: string
  ai: MobAIConfig
  anims: MobAnimConfig
}

export interface EmoteDef {
  id: string
  name: string
  animation: string
  command: string
  lockMovement: boolean
  duration: number
}
