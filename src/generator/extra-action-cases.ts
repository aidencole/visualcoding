import * as Blockly from 'blockly'
import { ActionContext, escapeJava, getNumber, toConstant } from './utils'
import { getActions } from './actions'

const VANILLA_MOB_ID: Record<string, string> = {
  ZOMBIE: 'zombie',
  SKELETON: 'skeleton',
  CREEPER: 'creeper',
  SPIDER: 'spider',
  ENDERMAN: 'enderman',
  WITCH: 'witch',
  BLAZE: 'blaze',
  SLIME: 'slime',
  VILLAGER: 'villager',
  IRON_GOLEM: 'iron_golem',
  WOLF: 'wolf',
  CAT: 'cat',
  BEE: 'bee',
  PHANTOM: 'phantom',
  WARDEN: 'warden'
}

export function generateExtraAction(block: Blockly.Block, ctx: ActionContext): string[] | null {
  const { indent } = ctx
  const playerVar = ctx.playerVar ?? 'player'
  const worldVar = ctx.worldVar ?? 'world'
  const targetVar = ctx.targetVar ?? 'target'
  const lines: string[] = []

  switch (block.type) {
    case 'logic_if_health_above': {
      const percent = getNumber(block, 'PERCENT', 50)
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(
          `${indent}if (${playerVar}.getHealth() / ${playerVar}.getMaxHealth() > ${percent / 100}f) {`
        )
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'logic_if_has_item': {
      const itemId = block.getFieldValue('ITEM_ID')
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(
          `${indent}if (VisualCodingActions.hasItem(${playerVar}, ModItems.${toConstant(itemId)})) {`
        )
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'logic_if_on_fire': {
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (${playerVar}.isOnFire()) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'logic_if_raining': {
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (${worldVar}.isRaining()) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'logic_if_in_dimension': {
      const dim = block.getFieldValue('DIMENSION')
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (VisualCodingActions.isDimension(${playerVar}, "${dim}")) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'logic_if_gamemode': {
      const mode = block.getFieldValue('MODE')
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(
          `${indent}if (${playerVar} instanceof ServerPlayer sp && sp.gameMode.getGameModeForPlayer() == net.minecraft.world.level.GameType.${mode === 'SURVIVAL' ? 'SURVIVAL' : mode === 'CREATIVE' ? 'CREATIVE' : mode === 'ADVENTURE' ? 'ADVENTURE' : 'SPECTATOR'}) {`
        )
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      return lines
    }
    case 'action_kill_player':
      lines.push(`${indent}${playerVar}.kill();`)
      return lines
    case 'action_set_health': {
      const amount = getNumber(block, 'AMOUNT', 20)
      lines.push(`${indent}${playerVar}.setHealth(${amount}f);`)
      return lines
    }
    case 'action_set_gamemode': {
      const mode = block.getFieldValue('MODE')
      lines.push(
        `${indent}if (${playerVar} instanceof ServerPlayer sp) VisualCodingActions.setGamemode(sp, "${mode}");`
      )
      return lines
    }
    case 'action_clear_inventory':
      lines.push(`${indent}${playerVar}.getInventory().clearContent();`)
      return lines
    case 'action_remove_item': {
      const itemId = block.getFieldValue('ITEM_ID')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(
        `${indent}VisualCodingActions.removeItem(${playerVar}, ModItems.${toConstant(itemId)}, ${count});`
      )
      return lines
    }
    case 'action_give_block': {
      const blockKey = block.getFieldValue('BLOCK')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(`${indent}VisualCodingActions.giveBlockItem(${playerVar}, "${blockKey}", ${count});`)
      return lines
    }
    case 'action_actionbar': {
      const msg = block.getFieldValue('MESSAGE')
      lines.push(
        `${indent}if (${playerVar} instanceof ServerPlayer sp) VisualCodingActions.actionBar(sp, "${escapeJava(msg)}");`
      )
      return lines
    }
    case 'action_set_absorption': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${playerVar}.setAbsorptionAmount(${amount}f);`)
      return lines
    }
    case 'action_set_saturation': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${playerVar}.getFoodData().setSaturation(${amount}f);`)
      return lines
    }
    case 'action_add_levels': {
      const amount = getNumber(block, 'AMOUNT', 1)
      lines.push(`${indent}${playerVar}.giveExperienceLevels(${amount});`)
      return lines
    }
    case 'action_reset_fall_distance':
      lines.push(`${indent}${playerVar}.resetFallDistance();`)
      return lines
    case 'action_dismount':
      lines.push(`${indent}${playerVar}.stopRiding();`)
      return lines
    case 'action_kill_target':
      lines.push(`${indent}${targetVar}.discard();`)
      return lines
    case 'action_heal_target': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}if (${targetVar} instanceof LivingEntity living) living.heal(${amount}f);`)
      return lines
    }
    case 'action_launch_target': {
      const strength = getNumber(block, 'STRENGTH', 1)
      lines.push(
        `${indent}if (${targetVar} instanceof LivingEntity living) VisualCodingActions.launchEntity(living, ${strength}f);`
      )
      return lines
    }
    case 'action_set_target_on_fire':
      lines.push(`${indent}${targetVar}.igniteForSeconds(5);`)
      return lines
    case 'action_remove_target':
      lines.push(`${indent}${targetVar}.discard();`)
      return lines
    case 'action_glow_target':
      lines.push(`${indent}${targetVar}.setGlowingTag(true);`)
      return lines
    case 'action_start_rain':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.startRain(sl, 60);`
      )
      return lines
    case 'action_start_thunder': {
      const seconds = getNumber(block, 'SECONDS', 60)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.startThunder(sl, ${seconds});`
      )
      return lines
    }
    case 'action_set_difficulty': {
      const diff = block.getFieldValue('DIFFICULTY')
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.setDifficulty(sl, "${diff}");`
      )
      return lines
    }
    case 'action_time_day':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.setTime(sl, 1000L);`
      )
      return lines
    case 'action_time_noon':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.setTime(sl, 6000L);`
      )
      return lines
    case 'action_time_night':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.setTime(sl, 13000L);`
      )
      return lines
    case 'action_time_midnight':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.setTime(sl, 18000L);`
      )
      return lines
    case 'action_spawn_vanilla_mob': {
      const mob = block.getFieldValue('MOB')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.summonVanillaMob(sl, "${mob}", ${playerVar}.blockPosition(), ${count});`
      )
      return lines
    }
    case 'action_kill_nearby_mobs': {
      const range = getNumber(block, 'RANGE', 8)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.killNearbyMobs(sl, ${playerVar}, ${range});`
      )
      return lines
    }
    case 'action_spawn_item_drop': {
      const itemId = block.getFieldValue('ITEM_ID')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.dropItem(sl, ${playerVar}, ModItems.${toConstant(itemId)}, ${count});`
      )
      return lines
    }
    case 'action_set_block': {
      const blockKey = block.getFieldValue('BLOCK')
      const x = getNumber(block, 'X', 0)
      const y = getNumber(block, 'Y', 0)
      const z = getNumber(block, 'Z', 0)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.placeBlock(sl, ${playerVar}.blockPosition().offset(${x}, ${y}, ${z}), "${blockKey}");`
      )
      return lines
    }
    case 'action_break_block': {
      const x = getNumber(block, 'X', 0)
      const y = getNumber(block, 'Y', 0)
      const z = getNumber(block, 'Z', 0)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.breakBlock(sl, ${playerVar}.blockPosition().offset(${x}, ${y}, ${z}));`
      )
      return lines
    }
    case 'action_launch_arrow': {
      const power = getNumber(block, 'POWER', 1.5)
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.shootArrow(sl, ${playerVar}, ${power}f);`
      )
      return lines
    }
    case 'action_launch_fireball':
      lines.push(
        `${indent}if (${worldVar} instanceof ServerLevel sl) VisualCodingActions.shootFireball(sl, ${playerVar});`
      )
      return lines
    case 'action_delay_ticks': {
      const ticks = getNumber(block, 'TICKS', 20)
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '        ' })
      if (inner.length) {
        lines.push(`${indent}if (${worldVar} instanceof ServerLevel sl) {`)
        lines.push(`${indent}    VisualCodingActions.schedule(sl, ${ticks}, () -> {`)
        lines.push(...inner)
        lines.push(`${indent}    });`)
        lines.push(`${indent}}`)
      }
      return lines
    }
  }
  return null
}
