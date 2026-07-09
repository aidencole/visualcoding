import * as Blockly from 'blockly'
import { ActionContext, escapeJava, getNumber } from './utils'

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
  const { indent, playerVar = 'player' } = ctx
  const worldVar = 'world'
  const lines: string[] = []

  switch (block.type) {
    case 'action_send_message': {
      const msg = block.getFieldValue('MESSAGE')
      lines.push(`${indent}${playerVar}.sendSystemMessage(Component.literal("${escapeJava(msg)}"));`)
      break
    }
    case 'action_deal_damage': {
      const amount = getNumber(block, 'AMOUNT', 5)
      lines.push(`${indent}${playerVar}.hurt(${worldVar}.damageSources().magic(), ${amount}f);`)
      break
    }
    case 'action_give_effect': {
      const effect = block.getFieldValue('EFFECT')
      const duration = getNumber(block, 'DURATION', 5) * 20
      const amplifier = getNumber(block, 'AMPLIFIER', 0)
      lines.push(
        `${indent}${playerVar}.addEffect(new MobEffectInstance(MobEffects.${effect}, ${duration}, ${amplifier}));`
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
      const sound = block.getFieldValue('SOUND')
      lines.push(
        `${indent}${worldVar}.playSound(null, ${playerVar}.blockPosition(), SoundEvents.${sound}, SoundSource.PLAYERS, 1.0f, 1.0f);`
      )
      break
    }
  }
  return lines
}
