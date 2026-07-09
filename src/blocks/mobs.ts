import * as Blockly from 'blockly'
import { MOB_COLOR } from './colors'

export function registerMobBlocks(): void {
  Blockly.Blocks['ai_idle_wander'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('When idle → wander around')
      this.setPreviousStatement(true, 'MobAI')
      this.setNextStatement(true, 'MobAI')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['ai_chase_player'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('RANGE')
        .setCheck('Number')
        .appendField('When player within')
      this.appendDummyInput().appendField('blocks → chase player')
      this.setPreviousStatement(true, 'MobAI')
      this.setNextStatement(true, 'MobAI')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['ai_melee_attack'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('RANGE')
        .setCheck('Number')
        .appendField('When within')
      this.appendDummyInput().appendField('blocks → melee attack')
      this.setPreviousStatement(true, 'MobAI')
      this.setNextStatement(true, 'MobAI')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['ai_flee_player'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('HEALTH_PERCENT')
        .setCheck('Number')
        .appendField('When health below')
      this.appendDummyInput().appendField('% → flee from player within')
      this.appendValueInput('RANGE')
        .setCheck('Number')
        .appendField('')
      this.appendDummyInput().appendField('blocks')
      this.setPreviousStatement(true, 'MobAI')
      this.setNextStatement(true, 'MobAI')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['ai_ranged_attack'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('RANGE')
        .setCheck('Number')
        .appendField('Ranged attack within')
      this.appendDummyInput().appendField('blocks')
      this.setPreviousStatement(true, 'MobAI')
      this.setNextStatement(true, 'MobAI')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['anim_when_moving'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('When moving → play')
        .appendField(new Blockly.FieldTextInput('walk'), 'ANIM')
      this.setPreviousStatement(true, 'MobAnimation')
      this.setNextStatement(true, 'MobAnimation')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['anim_when_attacking'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('When attacking → play')
        .appendField(new Blockly.FieldTextInput('attack'), 'ANIM')
      this.setPreviousStatement(true, 'MobAnimation')
      this.setNextStatement(true, 'MobAnimation')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['anim_when_idle'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('When idle → play')
        .appendField(new Blockly.FieldTextInput('idle'), 'ANIM')
      this.setPreviousStatement(true, 'MobAnimation')
      this.setNextStatement(true, 'MobAnimation')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['anim_when_hurt'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('When hurt → play')
        .appendField(new Blockly.FieldTextInput('hurt'), 'ANIM')
      this.setPreviousStatement(true, 'MobAnimation')
      this.setNextStatement(true, 'MobAnimation')
      this.setColour(MOB_COLOR)
    }
  }
}

export function registerMathBlocks(): void {
  Blockly.Blocks['math_number'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'NUM')
      this.setOutput(true, 'Number')
      this.setColour('#5C81A6')
    }
  }
}
