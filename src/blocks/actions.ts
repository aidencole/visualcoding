import * as Blockly from 'blockly'
import { ACTION_COLOR, EFFECT_COLOR, MOB_COLOR } from './colors'
import { EFFECT_OPTIONS, SOUND_OPTIONS } from './colors'

export function registerActionBlocks(): void {
  Blockly.Blocks['action_send_message'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Send message to player')
        .appendField(new Blockly.FieldTextInput('Hello!'), 'MESSAGE')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_broadcast_message'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Broadcast message to all')
        .appendField(new Blockly.FieldTextInput('Server announcement!'), 'MESSAGE')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_show_title'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Show title')
        .appendField(new Blockly.FieldTextInput('Boss Fight!'), 'TITLE')
      this.appendDummyInput()
        .appendField('Subtitle')
        .appendField(new Blockly.FieldTextInput('Prepare yourself'), 'SUBTITLE')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_deal_damage'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Deal damage to player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_damage_target'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Deal damage to hit entity')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_heal'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Heal player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_give_effect'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Give effect')
        .appendField(new Blockly.FieldDropdown(EFFECT_OPTIONS), 'EFFECT')
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('for seconds')
      this.appendValueInput('AMPLIFIER')
        .setCheck('Number')
        .appendField('level')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_remove_effect'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Remove effect')
        .appendField(new Blockly.FieldDropdown(EFFECT_OPTIONS), 'EFFECT')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_clear_effects'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Clear all effects from player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_teleport'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Teleport player relative by')
      this.appendValueInput('X').setCheck('Number').appendField('X')
      this.appendValueInput('Y').setCheck('Number').appendField('Y')
      this.appendValueInput('Z').setCheck('Number').appendField('Z')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_teleport_to'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Teleport player to position')
      this.appendValueInput('X').setCheck('Number').appendField('X')
      this.appendValueInput('Y').setCheck('Number').appendField('Y')
      this.appendValueInput('Z').setCheck('Number').appendField('Z')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_give_item'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Give item')
        .appendField(new Blockly.FieldTextInput('magic_stick'), 'ITEM_ID')
      this.appendValueInput('COUNT').setCheck('Number').appendField('count')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_lightning'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Strike lightning at player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_explosion'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('POWER')
        .setCheck('Number')
        .appendField('Create explosion power')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_knockback'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('STRENGTH')
        .setCheck('Number')
        .appendField('Knockback player strength')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_give_xp'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Give XP to player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_set_hunger'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Set hunger to')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_burn'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('Set player on fire for seconds')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_extinguish'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Extinguish player')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_set_time'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('Set world time to')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_set_weather_clear'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('Clear weather for seconds')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_summon_mob'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Summon mob')
        .appendField(new Blockly.FieldTextInput('shadow_beast'), 'MOB_ID')
      this.appendValueInput('COUNT').setCheck('Number').appendField('count')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['action_spawn_particle'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Spawn spark particles')
      this.appendValueInput('COUNT')
        .setCheck('Number')
        .appendField('count')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_screenshake'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('INTENSITY')
        .setCheck('Number')
        .appendField('Screen shake intensity')
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('for seconds')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_play_sound'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Play sound')
        .appendField(new Blockly.FieldDropdown(SOUND_OPTIONS), 'SOUND')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_run_command'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Run Minecraft command')
        .appendField(new Blockly.FieldTextInput('say Hello from VisualCoding!'), 'COMMAND')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(ACTION_COLOR)
    }
  }
}
