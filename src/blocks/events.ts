import * as Blockly from 'blockly'
import { EVENT_COLOR, GLOBAL_COLOR } from './colors'

export function registerEventBlocks(): void {
  Blockly.Blocks['on_right_click'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player right-clicks')
      this.setPreviousStatement(true, 'ItemBehavior')
      this.setNextStatement(true, 'ItemBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_shift_right_click'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player shift-right-clicks')
      this.setPreviousStatement(true, 'ItemBehavior')
      this.setNextStatement(true, 'ItemBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_hit_entity'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player hits entity with item')
      this.setPreviousStatement(true, 'ItemBehavior')
      this.setNextStatement(true, 'ItemBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_block_interact'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player interacts with block')
      this.setPreviousStatement(true, 'BlockBehavior')
      this.setNextStatement(true, 'BlockBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_block_step'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player steps on block')
      this.setPreviousStatement(true, 'BlockBehavior')
      this.setNextStatement(true, 'BlockBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_block_break'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player breaks block')
      this.setPreviousStatement(true, 'BlockBehavior')
      this.setNextStatement(true, 'BlockBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['register_command'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Command')
        .appendField('/')
        .appendField(new Blockly.FieldTextInput('healme'), 'COMMAND_NAME')
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When command runs')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(GLOBAL_COLOR)
    }
  }

  Blockly.Blocks['on_player_join'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player joins server')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(GLOBAL_COLOR)
    }
  }

  Blockly.Blocks['on_player_death'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player dies')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(GLOBAL_COLOR)
    }
  }

  Blockly.Blocks['on_player_respawn'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('When player respawns')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(GLOBAL_COLOR)
    }
  }

  Blockly.Blocks['on_server_tick'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField('Every server tick (use sparingly!)')
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('Do')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(GLOBAL_COLOR)
    }
  }
}
