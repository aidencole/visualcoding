import * as Blockly from 'blockly'
import {
  ActionContext,
  ArmorDef,
  BlockDef,
  EmoteDef,
  ItemDef,
  MobAIConfig,
  MobAnimConfig,
  MobDef,
  ProjectMeta,
  getNumber,
  toClassName
} from './utils'
import { getActions } from './actions'

export interface ParsedProject {
  meta: ProjectMeta
  pkg: string
  items: ItemDef[]
  blocks: BlockDef[]
  armors: ArmorDef[]
  mobs: MobDef[]
  emotes: EmoteDef[]
}

function parseMobAI(block: Blockly.Block | null): MobAIConfig {
  const config: MobAIConfig = { wander: false, chaseRange: 16, attackRange: 2 }
  let current = block
  while (current) {
    if (current.type === 'ai_idle_wander') config.wander = true
    if (current.type === 'ai_chase_player') config.chaseRange = getNumber(current, 'RANGE', 16)
    if (current.type === 'ai_melee_attack') config.attackRange = getNumber(current, 'RANGE', 2)
    current = current.getNextBlock()
  }
  return config
}

function parseMobAnims(block: Blockly.Block | null): MobAnimConfig {
  const config: MobAnimConfig = { idle: 'idle', walk: 'walk', attack: 'attack' }
  let current = block
  while (current) {
    if (current.type === 'anim_when_idle') config.idle = current.getFieldValue('ANIM')
    if (current.type === 'anim_when_moving') config.walk = current.getFieldValue('ANIM')
    if (current.type === 'anim_when_attacking') config.attack = current.getFieldValue('ANIM')
    current = current.getNextBlock()
  }
  return config
}

export function parseWorkspace(workspace: Blockly.Workspace, meta: ProjectMeta): ParsedProject {
  const items: ItemDef[] = []
  const blocks: BlockDef[] = []
  const armors: ArmorDef[] = []
  const mobs: MobDef[] = []
  const emotes: EmoteDef[] = []

  const topBlocks = workspace.getTopBlocks(true)
  for (const block of topBlocks) {
    if (block.type === 'mod_setup') {
      meta.modId = block.getFieldValue('MOD_ID') || meta.modId
      meta.modName = block.getFieldValue('MOD_NAME') || meta.modName
    }
    if (block.type === 'register_item') {
      const id = block.getFieldValue('ITEM_ID')
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      const rightClickActions: string[] = []
      let behavior = block.getInputTargetBlock('BEHAVIORS')
      while (behavior) {
        if (behavior.type === 'on_right_click') {
          rightClickActions.push(...getActions(behavior, 'ACTIONS', ctx))
        }
        behavior = behavior.getNextBlock()
      }
      items.push({
        id,
        name: block.getFieldValue('ITEM_NAME'),
        texture: block.getFieldValue('TEXTURE'),
        className: `${toClassName(id)}Item`,
        rightClickActions
      })
    }
    if (block.type === 'register_block') {
      const id = block.getFieldValue('BLOCK_ID')
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      const interactActions: string[] = []
      let behavior = block.getInputTargetBlock('BEHAVIORS')
      while (behavior) {
        if (behavior.type === 'on_block_interact') {
          interactActions.push(...getActions(behavior, 'ACTIONS', ctx))
        }
        behavior = behavior.getNextBlock()
      }
      blocks.push({
        id,
        name: block.getFieldValue('BLOCK_NAME'),
        texture: block.getFieldValue('TEXTURE'),
        hardness: getNumber(block, 'HARDNESS', 2),
        className: `${toClassName(id)}Block`,
        interactActions
      })
    }
    if (block.type === 'register_armor') {
      const id = block.getFieldValue('ARMOR_ID')
      armors.push({
        id,
        name: block.getFieldValue('ARMOR_NAME'),
        texture: block.getFieldValue('TEXTURE'),
        slot: block.getFieldValue('SLOT'),
        protection: getNumber(block, 'PROTECTION', 3),
        className: `${toClassName(id)}ArmorItem`
      })
    }
    if (block.type === 'register_mob') {
      const id = block.getFieldValue('MOB_ID')
      mobs.push({
        id,
        name: block.getFieldValue('MOB_NAME'),
        geo: block.getFieldValue('GEO'),
        animations: block.getFieldValue('ANIMATIONS'),
        texture: block.getFieldValue('TEXTURE'),
        health: getNumber(block, 'HEALTH', 40),
        speed: getNumber(block, 'SPEED', 0.3),
        damage: getNumber(block, 'DAMAGE', 6),
        className: `${toClassName(id)}Entity`,
        ai: parseMobAI(block.getInputTargetBlock('AI')),
        anims: parseMobAnims(block.getInputTargetBlock('ANIMATIONS'))
      })
    }
    if (block.type === 'register_emote') {
      emotes.push({
        id: block.getFieldValue('EMOTE_ID'),
        name: block.getFieldValue('EMOTE_NAME'),
        animation: block.getFieldValue('ANIMATION'),
        command: block.getFieldValue('COMMAND'),
        lockMovement: block.getFieldValue('LOCK_MOVEMENT') === 'TRUE',
        duration: getNumber(block, 'DURATION', 2)
      })
    }
  }

  const pkg = `com.visualcoding.${meta.modId.replace(/[^a-z0-9_]/g, '')}`
  return { meta, pkg, items, blocks, armors, mobs, emotes }
}
