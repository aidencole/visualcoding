import * as Blockly from 'blockly'
import { LOGIC_COLOR } from './colors'

export function registerLogicBlocks(): void {
  Blockly.Blocks['logic_if_health_below'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('PERCENT')
        .setCheck('Number')
        .appendField('If health at or below')
      this.appendDummyInput().appendField('%')
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('then')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(LOGIC_COLOR)
    }
  }

  Blockly.Blocks['logic_random_chance'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('PERCENT')
        .setCheck('Number')
        .appendField('Random chance')
      this.appendDummyInput().appendField('%')
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('then')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(LOGIC_COLOR)
    }
  }

  Blockly.Blocks['logic_if_sneaking'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('If player is sneaking')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(LOGIC_COLOR)
    }
  }

  Blockly.Blocks['logic_if_not_sneaking'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('If player is NOT sneaking')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(LOGIC_COLOR)
    }
  }

  Blockly.Blocks['logic_repeat'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('TIMES')
        .setCheck('Number')
        .appendField('Repeat')
      this.appendDummyInput().appendField('times')
      this.appendStatementInput('ACTIONS')
        .setCheck(['Action', 'Logic'])
        .appendField('do')
      this.setPreviousStatement(true, ['Action', 'Logic'])
      this.setNextStatement(true, ['Action', 'Logic'])
      this.setColour(LOGIC_COLOR)
    }
  }
}
