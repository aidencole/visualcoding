import * as Blockly from 'blockly'
import { ActionContext, escapeJava, getNumber, toConstant } from './utils'

const EFFECT_MAP: Record<string, string> = {
  SPEED: 'MobEffects.MOVEMENT_SPEED',
  SLOWNESS: 'MobEffects.MOVEMENT_SLOWDOWN',
  STRENGTH: 'MobEffects.DAMAGE_BOOST',
  REGENERATION: 'MobEffects.REGENERATION',
  POISON: 'MobEffects.POISON',
  GLOWING: 'MobEffects.GLOWING',
  FIRE_RESISTANCE: 'MobEffects.FIRE_RESISTANCE',
  INVISIBILITY: 'MobEffects.INVISIBILITY',
  JUMP_BOOST: 'MobEffects.JUMP',
  WEAKNESS: 'MobEffects.WEAKNESS',
  HUNGER: 'MobEffects.HUNGER',
  NIGHT_VISION: 'MobEffects.NIGHT_VISION',
  WITHER: 'MobEffects.WITHER',
  LEVITATION: 'MobEffects.LEVITATION',
  RESISTANCE: 'MobEffects.DAMAGE_RESISTANCE'
}

const SOUND_MAP: Record<string, string> = {
  EXPLODE: 'SoundEvents.GENERIC_EXPLODE',
  ENDERMAN_TELEPORT: 'SoundEvents.ENDERMAN_TELEPORT',
  ANVIL_LAND: 'SoundEvents.ANVIL_LAND',
  LEVEL_UP: 'SoundEvents.PLAYER_LEVELUP',
  PORTAL: 'SoundEvents.PORTAL_TRIGGER',
  THUNDER: 'SoundEvents.LIGHTNING_BOLT_THUNDER',
  BELL: 'SoundEvents.BELL_BLOCK',
  DRAGON_GROWL: 'SoundEvents.ENDER_DRAGON_GROWL',
  WITHER_SPAWN: 'SoundEvents.WITHER_SPAWN',
  VILLAGER_YES: 'SoundEvents.VILLAGER_YES'
}

export function getActions(block: Blockly.Block | null, statement: string, ctx: ActionContext): string[] {
  const lines: string[] = []
  let current = block?.getInputTargetBlock(statement) ?? null
  while (current) {
    lines.push(...generateAction(current, ctx))
    current = current.getNextBlock()
  }
  return lines
}

export function generateAction(block: Blockly.Block, ctx: ActionContext): string[] {
  const { indent } = ctx
  const playerVar = ctx.playerVar ?? 'player'
  const worldVar = ctx.worldVar ?? 'world'
  const targetVar = ctx.targetVar ?? 'target'
  const lines: string[] = []

  switch (block.type) {
    case 'logic_if_health_below': {
      const percent = getNumber(block, 'PERCENT', 50)
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(
          `${indent}if (${playerVar}.getHealth() / ${playerVar}.getMaxHealth() <= ${percent / 100}f) {`
        )
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      break
    }
    case 'logic_random_chance': {
      const percent = getNumber(block, 'PERCENT', 50)
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (${worldVar}.getRandom().nextFloat() < ${percent / 100}f) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      break
    }
    case 'logic_if_sneaking': {
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (${playerVar}.isShiftKeyDown()) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      break
    }
    case 'logic_if_not_sneaking': {
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}if (!${playerVar}.isShiftKeyDown()) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      break
    }
    case 'logic_repeat': {
      const times = getNumber(block, 'TIMES', 3)
      const inner = getActions(block, 'ACTIONS', { ...ctx, indent: indent + '    ' })
      if (inner.length) {
        lines.push(`${indent}for (int i = 0; i < ${times}; i++) {`)
        lines.push(...inner)
        lines.push(`${indent}}`)
      }
      break
    }
    case 'action_send_message': {
      const msg = block.getFieldValue('MESSAGE')
      lines.push(`${indent}${playerVar}.sendSystemMessage(Component.literal("${escapeJava(msg)}"));`)
      break
    }
    case 'action_broadcast_message': {
      const msg = block.getFieldValue('MESSAGE')
      lines.push(
        `${indent}${worldVar}.getServer().getPlayerList().broadcastSystemMessage(Component.literal("${escapeJava(msg)}"), false);`
      )
      break
    }
    case 'action_show_title': {
      const title = block.getFieldValue('TITLE')
      const subtitle = block.getFieldValue('SUBTITLE')
      lines.push(
        `${indent}${playerVar}.connection.send(new net.minecraft.network.protocol.game.ClientboundSetTitlesAnimationPacket(10, 40, 10));`
      )
      lines.push(
        `${indent}${playerVar}.connection.send(new net.minecraft.network.protocol.game.ClientboundSetTitleTextPacket(Component.literal("${escapeJava(title)}")));`
      )
      lines.push(
        `${indent}${playerVar}.connection.send(new net.minecraft.network.protocol.game.ClientboundSetSubtitleTextPacket(Component.literal("${escapeJava(subtitle)}")));`
      )
      break
    }
    case 'action_deal_damage': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${playerVar}.hurt(${worldVar}.damageSources().magic(), ${amount}f);`)
      break
    }
    case 'action_damage_target': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${targetVar}.hurt(${worldVar}.damageSources().playerAttack(${playerVar}), ${amount}f);`)
      break
    }
    case 'action_heal': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${playerVar}.heal(${amount}f);`)
      break
    }
    case 'action_give_effect': {
      const effect = EFFECT_MAP[block.getFieldValue('EFFECT')] ?? 'MobEffects.MOVEMENT_SPEED'
      const duration = getNumber(block, 'DURATION', 5) * 20
      const amplifier = getNumber(block, 'AMPLIFIER', 0)
      lines.push(
        `${indent}${playerVar}.addEffect(new MobEffectInstance(${effect}, ${duration}, ${amplifier}));`
      )
      break
    }
    case 'action_remove_effect': {
      const effect = EFFECT_MAP[block.getFieldValue('EFFECT')] ?? 'MobEffects.MOVEMENT_SPEED'
      lines.push(`${indent}${playerVar}.removeEffect(${effect});`)
      break
    }
    case 'action_clear_effects': {
      lines.push(`${indent}${playerVar}.removeAllEffects();`)
      break
    }
    case 'action_teleport': {
      const x = getNumber(block, 'X', 0)
      const y = getNumber(block, 'Y', 1)
      const z = getNumber(block, 'Z', 0)
      lines.push(
        `${indent}VisualEffects.teleport(${playerVar}, ${playerVar}.getX() + ${x}, ${playerVar}.getY() + ${y}, ${playerVar}.getZ() + ${z});`
      )
      break
    }
    case 'action_teleport_to': {
      const x = getNumber(block, 'X', 0)
      const y = getNumber(block, 'Y', 64)
      const z = getNumber(block, 'Z', 0)
      lines.push(`${indent}VisualEffects.teleport(${playerVar}, ${x}, ${y}, ${z});`)
      break
    }
    case 'action_give_item': {
      const itemId = block.getFieldValue('ITEM_ID')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(
        `${indent}VisualEffects.giveItem(${playerVar}, ModItems.${toConstant(itemId)}, ${count});`
      )
      break
    }
    case 'action_lightning': {
      lines.push(
        `${indent}VisualEffects.strikeLightning(${worldVar}, ${playerVar}.blockPosition());`
      )
      break
    }
    case 'action_explosion': {
      const power = getNumber(block, 'POWER', 2)
      lines.push(
        `${indent}VisualEffects.explode(${worldVar}, ${playerVar}.blockPosition(), ${power}f);`
      )
      break
    }
    case 'action_knockback': {
      const strength = getNumber(block, 'STRENGTH', 1)
      lines.push(`${indent}VisualEffects.knockback(${playerVar}, ${strength}f);`)
      break
    }
    case 'action_give_xp': {
      const amount = getNumber(block, 'AMOUNT', 10)
      lines.push(`${indent}${playerVar}.giveExperiencePoints(${amount});`)
      break
    }
    case 'action_set_hunger': {
      const amount = getNumber(block, 'AMOUNT', 10)
      lines.push(`${indent}${playerVar}.getFoodData().setFoodLevel(${amount});`)
      break
    }
    case 'action_burn': {
      const seconds = getNumber(block, 'SECONDS', 5)
      lines.push(`${indent}${playerVar}.setRemainingFireTicks(${seconds} * 20);`)
      break
    }
    case 'action_extinguish': {
      lines.push(`${indent}${playerVar}.clearFire();`)
      break
    }
    case 'action_set_time': {
      const time = getNumber(block, 'TIME', 6000)
      lines.push(`${indent}${worldVar}.setDayTime(${time}L);`)
      break
    }
    case 'action_set_weather_clear': {
      const seconds = getNumber(block, 'SECONDS', 60)
      lines.push(`${indent}VisualEffects.setClearWeather(${worldVar}, ${seconds});`)
      break
    }
    case 'action_summon_mob': {
      const mobId = block.getFieldValue('MOB_ID')
      const count = getNumber(block, 'COUNT', 1)
      lines.push(
        `${indent}VisualEffects.summonMob(${worldVar}, ModEntities.${toConstant(mobId)}, ${playerVar}.blockPosition(), ${count});`
      )
      break
    }
    case 'action_spawn_particle': {
      const count = getNumber(block, 'COUNT', 10)
      lines.push(
        `${indent}VisualEffects.spawnParticles(${worldVar}, ${playerVar}.blockPosition(), ModParticles.SPARK, ${count});`
      )
      break
    }
    case 'action_screenshake': {
      const intensity = getNumber(block, 'INTENSITY', 0.5)
      const duration = getNumber(block, 'DURATION', 0.3)
      lines.push(`${indent}VisualEffects.shakeScreen(${playerVar}, ${intensity}f, ${duration}f);`)
      break
    }
    case 'action_play_sound': {
      const sound = SOUND_MAP[block.getFieldValue('SOUND')] ?? 'SoundEvents.GENERIC_EXPLODE'
      lines.push(
        `${indent}${worldVar}.playSound(null, ${playerVar}.blockPosition(), ${sound}, SoundSource.PLAYERS, 1.0f, 1.0f);`
      )
      break
    }
    case 'action_run_command': {
      const cmd = block.getFieldValue('COMMAND')
      lines.push(
        `${indent}${worldVar}.getServer().getCommands().performPrefixedCommand(${playerVar}.createCommandSourceStack(), "${escapeJava(cmd)}");`
      )
      break
    }
  }
  return lines
}

export function parseBehaviorActions(
  behavior: Blockly.Block | null,
  inputName: string,
  ctx: ActionContext
): string[] {
  if (!behavior) return []
  return getActions(behavior, inputName, ctx)
}
