import { ACTION_COLOR, EFFECT_COLOR, EVENT_COLOR, GLOBAL_COLOR, LOGIC_COLOR, MOB_COLOR } from './colors'
import { BlockSpec, STMT } from './helpers'

const VANILLA_MOB_OPTIONS: [string, string][] = [
  ['Zombie', 'ZOMBIE'],
  ['Skeleton', 'SKELETON'],
  ['Creeper', 'CREEPER'],
  ['Spider', 'SPIDER'],
  ['Enderman', 'ENDERMAN'],
  ['Witch', 'WITCH'],
  ['Blaze', 'BLAZE'],
  ['Slime', 'SLIME'],
  ['Villager', 'VILLAGER'],
  ['Iron Golem', 'IRON_GOLEM'],
  ['Wolf', 'WOLF'],
  ['Cat', 'CAT'],
  ['Bee', 'BEE'],
  ['Phantom', 'PHANTOM'],
  ['Warden', 'WARDEN']
]

const GAMEMODE_OPTIONS: [string, string][] = [
  ['Survival', 'SURVIVAL'],
  ['Creative', 'CREATIVE'],
  ['Adventure', 'ADVENTURE'],
  ['Spectator', 'SPECTATOR']
]

const DIFFICULTY_OPTIONS: [string, string][] = [
  ['Peaceful', 'PEACEFUL'],
  ['Easy', 'EASY'],
  ['Normal', 'NORMAL'],
  ['Hard', 'HARD']
]

const DIMENSION_OPTIONS: [string, string][] = [
  ['Overworld', 'OVERWORLD'],
  ['Nether', 'NETHER'],
  ['End', 'END']
]

const VANILLA_BLOCK_OPTIONS: [string, string][] = [
  ['Stone', 'STONE'],
  ['Dirt', 'DIRT'],
  ['Grass Block', 'GRASS_BLOCK'],
  ['TNT', 'TNT'],
  ['Obsidian', 'OBSIDIAN'],
  ['Glass', 'GLASS'],
  ['Diamond Block', 'DIAMOND_BLOCK'],
  ['Gold Block', 'GOLD_BLOCK'],
  ['Ice', 'ICE'],
  ['Torch', 'TORCH'],
  ['Chest', 'CHEST']
]

const stmt = { previous: STMT, next: STMT }

export const EXTRA_ACTION_BLOCKS: BlockSpec[] = [
  { type: 'action_kill_player', color: ACTION_COLOR, label: 'Kill player', ...stmt },
  {
    type: 'action_set_health',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'AMOUNT', label: 'Set player health to', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_set_gamemode',
    color: ACTION_COLOR,
    ...stmt,
    fields: [{ label: 'Set gamemode to', name: 'MODE', type: 'dropdown', options: GAMEMODE_OPTIONS }]
  },
  { type: 'action_clear_inventory', color: ACTION_COLOR, label: 'Clear player inventory', ...stmt },
  {
    type: 'action_remove_item',
    color: ACTION_COLOR,
    ...stmt,
    fields: [{ label: 'Remove item', name: 'ITEM_ID', type: 'text', value: 'magic_stick' }],
    inputs: [{ name: 'COUNT', label: 'count', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_give_block',
    color: ACTION_COLOR,
    ...stmt,
    fields: [{ label: 'Give vanilla block item', name: 'BLOCK', type: 'dropdown', options: VANILLA_BLOCK_OPTIONS }],
    inputs: [{ name: 'COUNT', label: 'count', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_actionbar',
    color: ACTION_COLOR,
    ...stmt,
    fields: [{ label: 'Action bar message', name: 'MESSAGE', type: 'text', value: 'Action bar!' }]
  },
  {
    type: 'action_set_absorption',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'AMOUNT', label: 'Set absorption hearts', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_set_saturation',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'AMOUNT', label: 'Set saturation', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_add_levels',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'AMOUNT', label: 'Add XP levels', check: 'Number', kind: 'value' }]
  },
  { type: 'action_reset_fall_distance', color: ACTION_COLOR, label: 'Reset fall damage', ...stmt },
  { type: 'action_dismount', color: ACTION_COLOR, label: 'Dismount player', ...stmt },
  { type: 'action_kill_target', color: ACTION_COLOR, label: 'Kill hit entity', ...stmt },
  {
    type: 'action_heal_target',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'AMOUNT', label: 'Heal hit entity', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_launch_target',
    color: ACTION_COLOR,
    ...stmt,
    inputs: [{ name: 'STRENGTH', label: 'Launch hit entity strength', check: 'Number', kind: 'value' }]
  },
  { type: 'action_set_target_on_fire', color: EFFECT_COLOR, label: 'Set hit entity on fire', ...stmt },
  { type: 'action_remove_target', color: ACTION_COLOR, label: 'Remove hit entity', ...stmt },
  { type: 'action_glow_target', color: EFFECT_COLOR, label: 'Make hit entity glow', ...stmt },
  { type: 'action_start_rain', color: EFFECT_COLOR, label: 'Start rain', ...stmt },
  {
    type: 'action_start_thunder',
    color: EFFECT_COLOR,
    ...stmt,
    inputs: [{ name: 'SECONDS', label: 'Thunderstorm for seconds', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_set_difficulty',
    color: EFFECT_COLOR,
    ...stmt,
    fields: [{ label: 'Set difficulty', name: 'DIFFICULTY', type: 'dropdown', options: DIFFICULTY_OPTIONS }]
  },
  { type: 'action_time_day', color: EFFECT_COLOR, label: 'Set time to day', ...stmt },
  { type: 'action_time_noon', color: EFFECT_COLOR, label: 'Set time to noon', ...stmt },
  { type: 'action_time_night', color: EFFECT_COLOR, label: 'Set time to night', ...stmt },
  { type: 'action_time_midnight', color: EFFECT_COLOR, label: 'Set time to midnight', ...stmt },
  {
    type: 'action_spawn_vanilla_mob',
    color: MOB_COLOR,
    ...stmt,
    fields: [{ label: 'Summon vanilla mob', name: 'MOB', type: 'dropdown', options: VANILLA_MOB_OPTIONS }],
    inputs: [{ name: 'COUNT', label: 'count', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_kill_nearby_mobs',
    color: MOB_COLOR,
    ...stmt,
    inputs: [{ name: 'RANGE', label: 'Kill mobs within blocks', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_spawn_item_drop',
    color: EFFECT_COLOR,
    ...stmt,
    fields: [{ label: 'Drop item at player', name: 'ITEM_ID', type: 'text', value: 'magic_stick' }],
    inputs: [{ name: 'COUNT', label: 'count', check: 'Number', kind: 'value' }]
  },
  {
    type: 'action_set_block',
    color: EFFECT_COLOR,
    ...stmt,
    fields: [{ label: 'Place vanilla block', name: 'BLOCK', type: 'dropdown', options: VANILLA_BLOCK_OPTIONS }],
    inputs: [
      { name: 'X', label: 'offset X', check: 'Number', kind: 'value' },
      { name: 'Y', label: 'Y', check: 'Number', kind: 'value' },
      { name: 'Z', label: 'Z', check: 'Number', kind: 'value' }
    ]
  },
  {
    type: 'action_break_block',
    color: EFFECT_COLOR,
    ...stmt,
    inputs: [
      { name: 'X', label: 'Break block offset X', check: 'Number', kind: 'value' },
      { name: 'Y', label: 'Y', check: 'Number', kind: 'value' },
      { name: 'Z', label: 'Z', check: 'Number', kind: 'value' }
    ]
  },
  {
    type: 'action_launch_arrow',
    color: EFFECT_COLOR,
    ...stmt,
    inputs: [{ name: 'POWER', label: 'Shoot arrow power', check: 'Number', kind: 'value' }]
  },
  { type: 'action_launch_fireball', color: EFFECT_COLOR, label: 'Shoot fireball', ...stmt },
  {
    type: 'action_delay_ticks',
    color: LOGIC_COLOR,
    ...stmt,
    inputs: [
      { name: 'TICKS', label: 'Wait ticks then', check: 'Number', kind: 'value' },
      { name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }
    ]
  }
]

export const EXTRA_LOGIC_BLOCKS: BlockSpec[] = [
  {
    type: 'logic_if_health_above',
    color: LOGIC_COLOR,
    ...stmt,
    inputs: [
      { name: 'PERCENT', label: 'If health above', check: 'Number', kind: 'value' },
      { name: 'ACTIONS', label: '% then', check: 'Number', kind: 'statement', stmtCheck: STMT }
    ]
  },
  {
    type: 'logic_if_has_item',
    color: LOGIC_COLOR,
    ...stmt,
    fields: [{ label: 'If player has item', name: 'ITEM_ID', type: 'text', value: 'magic_stick' }],
    inputs: [{ name: 'ACTIONS', label: 'then', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'logic_if_on_fire',
    color: LOGIC_COLOR,
    label: 'If player is on fire',
    ...stmt,
    inputs: [{ name: 'ACTIONS', label: 'then', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'logic_if_raining',
    color: LOGIC_COLOR,
    label: 'If it is raining',
    ...stmt,
    inputs: [{ name: 'ACTIONS', label: 'then', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'logic_if_in_dimension',
    color: LOGIC_COLOR,
    ...stmt,
    fields: [{ label: 'If player in', name: 'DIMENSION', type: 'dropdown', options: DIMENSION_OPTIONS }],
    inputs: [{ name: 'ACTIONS', label: 'then', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'logic_if_gamemode',
    color: LOGIC_COLOR,
    ...stmt,
    fields: [{ label: 'If gamemode is', name: 'MODE', type: 'dropdown', options: GAMEMODE_OPTIONS }],
    inputs: [{ name: 'ACTIONS', label: 'then', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  }
]

export const EXTRA_EVENT_BLOCKS: BlockSpec[] = [
  {
    type: 'on_player_damage',
    color: GLOBAL_COLOR,
    previous: 'Definition',
    next: 'Definition',
    label: 'When player takes damage',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'on_player_chat',
    color: GLOBAL_COLOR,
    previous: 'Definition',
    next: 'Definition',
    label: 'When player sends chat',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'on_block_place',
    color: GLOBAL_COLOR,
    previous: 'Definition',
    next: 'Definition',
    label: 'When player places any block',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'on_item_pickup',
    color: GLOBAL_COLOR,
    previous: 'Definition',
    next: 'Definition',
    label: 'When player picks up item',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'on_left_click_block',
    color: EVENT_COLOR,
    previous: 'ItemBehavior',
    next: 'ItemBehavior',
    label: 'When player left-clicks block with item',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  },
  {
    type: 'on_finish_using',
    color: EVENT_COLOR,
    previous: 'ItemBehavior',
    next: 'ItemBehavior',
    label: 'When player finishes using item',
    inputs: [{ name: 'ACTIONS', label: 'do', check: 'Number', kind: 'statement', stmtCheck: STMT }]
  }
]
