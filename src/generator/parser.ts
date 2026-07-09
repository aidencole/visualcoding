import * as Blockly from 'blockly'
import {
  ActionContext,
  ArmorDef,
  BlockDef,
  CommandDef,
  EmoteDef,
  GlobalEventDef,
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
  commands: CommandDef[]
  globalEvents: GlobalEventDef[]
}

function parseMobAI(block: Blockly.Block | null): MobAIConfig {
  const config: MobAIConfig = {
    wander: false,
    chaseRange: 16,
    attackRange: 2,
    fleeHealthPercent: 0,
    fleeRange: 8,
    rangedAttack: false,
    rangedRange: 12
  }
  let current = block
  while (current) {
    switch (current.type) {
      case 'ai_idle_wander':
        config.wander = true
        break
      case 'ai_chase_player':
        config.chaseRange = getNumber(current, 'RANGE', 16)
        break
      case 'ai_melee_attack':
        config.attackRange = getNumber(current, 'RANGE', 2)
        break
      case 'ai_flee_player':
        config.fleeHealthPercent = getNumber(current, 'HEALTH_PERCENT', 30)
        config.fleeRange = getNumber(current, 'RANGE', 8)
        break
      case 'ai_ranged_attack':
        config.rangedAttack = true
        config.rangedRange = getNumber(current, 'RANGE', 12)
        break
    }
    current = current.getNextBlock()
  }
  return config
}

function parseMobAnims(block: Blockly.Block | null): MobAnimConfig {
  const config: MobAnimConfig = { idle: 'idle', walk: 'walk', attack: 'attack', hurt: 'hurt' }
  let current = block
  while (current) {
    if (current.type === 'anim_when_idle') config.idle = current.getFieldValue('ANIM')
    if (current.type === 'anim_when_moving') config.walk = current.getFieldValue('ANIM')
    if (current.type === 'anim_when_attacking') config.attack = current.getFieldValue('ANIM')
    if (current.type === 'anim_when_hurt') config.hurt = current.getFieldValue('ANIM')
    current = current.getNextBlock()
  }
  return config
}

function parseItemBehaviors(block: Blockly.Block, modId: string): Pick<
  ItemDef,
  | 'rightClickActions'
  | 'shiftRightClickActions'
  | 'hitEntityActions'
  | 'leftClickBlockActions'
  | 'finishUsingActions'
> {
  const ctx: ActionContext = { modId, indent: '            ' }
  const hitCtx: ActionContext = { modId, indent: '            ', targetVar: 'target' }
  const rightClickActions: string[] = []
  const shiftRightClickActions: string[] = []
  const hitEntityActions: string[] = []
  const leftClickBlockActions: string[] = []
  const finishUsingActions: string[] = []

  let behavior = block.getInputTargetBlock('BEHAVIORS')
  while (behavior) {
    if (behavior.type === 'on_right_click') {
      rightClickActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    if (behavior.type === 'on_shift_right_click') {
      shiftRightClickActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    if (behavior.type === 'on_hit_entity') {
      hitEntityActions.push(...getActions(behavior, 'ACTIONS', hitCtx))
    }
    if (behavior.type === 'on_left_click_block') {
      leftClickBlockActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    if (behavior.type === 'on_finish_using') {
      finishUsingActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    behavior = behavior.getNextBlock()
  }

  return {
    rightClickActions,
    shiftRightClickActions,
    hitEntityActions,
    leftClickBlockActions,
    finishUsingActions
  }
}

function parseBlockBehaviors(block: Blockly.Block, modId: string): Pick<
  BlockDef,
  'interactActions' | 'stepOnActions' | 'breakActions'
> {
  const ctx: ActionContext = { modId, indent: '            ' }
  const interactActions: string[] = []
  const stepOnActions: string[] = []
  const breakActions: string[] = []

  let behavior = block.getInputTargetBlock('BEHAVIORS')
  while (behavior) {
    if (behavior.type === 'on_block_interact') {
      interactActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    if (behavior.type === 'on_block_step') {
      stepOnActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    if (behavior.type === 'on_block_break') {
      breakActions.push(...getActions(behavior, 'ACTIONS', ctx))
    }
    behavior = behavior.getNextBlock()
  }

  return { interactActions, stepOnActions, breakActions }
}

export function parseWorkspace(workspace: Blockly.Workspace, meta: ProjectMeta): ParsedProject {
  const items: ItemDef[] = []
  const blocks: BlockDef[] = []
  const armors: ArmorDef[] = []
  const mobs: MobDef[] = []
  const emotes: EmoteDef[] = []
  const commands: CommandDef[] = []
  const globalEvents: GlobalEventDef[] = []

  const topBlocks = workspace.getTopBlocks(true)
  for (const block of topBlocks) {
    if (block.type === 'mod_setup') {
      meta.modId = block.getFieldValue('MOD_ID') || meta.modId
      meta.modName = block.getFieldValue('MOD_NAME') || meta.modName
    }

    if (block.type === 'register_item') {
      const id = block.getFieldValue('ITEM_ID')
      const behaviors = parseItemBehaviors(block, meta.modId)
      items.push({
        id,
        name: block.getFieldValue('ITEM_NAME'),
        texture: block.getFieldValue('TEXTURE'),
        className: `${toClassName(id)}Item`,
        maxStack: getNumber(block, 'MAX_STACK', 64),
        food: block.getFieldValue('IS_FOOD') === 'TRUE',
        foodNutrition: getNumber(block, 'FOOD_AMOUNT', 4),
        foodSaturation: getNumber(block, 'FOOD_SATURATION', 0.3),
        ...behaviors
      })
    }

    if (block.type === 'register_block') {
      const id = block.getFieldValue('BLOCK_ID')
      const behaviors = parseBlockBehaviors(block, meta.modId)
      blocks.push({
        id,
        name: block.getFieldValue('BLOCK_NAME'),
        texture: block.getFieldValue('TEXTURE'),
        hardness: getNumber(block, 'HARDNESS', 2),
        lightLevel: getNumber(block, 'LIGHT', 0),
        className: `${toClassName(id)}Block`,
        ...behaviors
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

    if (block.type === 'register_command') {
      const ctx: ActionContext = { modId: meta.modId, indent: '                ' }
      commands.push({
        name: block.getFieldValue('COMMAND_NAME'),
        actions: getActions(block, 'ACTIONS', ctx)
      })
    }

    if (block.type === 'on_player_join') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'player_join', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_player_death') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'player_death', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_player_respawn') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'player_respawn', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_server_tick') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ', worldVar: 'server.overworld()' }
      globalEvents.push({ type: 'server_tick', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_player_damage') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'player_damage', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_player_chat') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'player_chat', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_block_place') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'block_place', actions: getActions(block, 'ACTIONS', ctx) })
    }

    if (block.type === 'on_item_pickup') {
      const ctx: ActionContext = { modId: meta.modId, indent: '            ' }
      globalEvents.push({ type: 'item_pickup', actions: getActions(block, 'ACTIONS', ctx) })
    }
  }

  const pkg = `com.visualcoding.${meta.modId.replace(/[^a-z0-9_]/g, '')}`
  return { meta, pkg, items, blocks, armors, mobs, emotes, commands, globalEvents }
}
