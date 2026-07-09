import * as Blockly from 'blockly'
import { BLOCK_COLOR, EMOTE_COLOR, ITEM_COLOR, MOD_COLOR, MOB_COLOR } from './colors'

export function registerDefinitionBlocks(): void {
  Blockly.Blocks['mod_setup'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Mod Setup')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('mymod'), 'MOD_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('My Mod'), 'MOD_NAME')
      this.setColour(MOD_COLOR)
      this.setTooltip('Basic mod settings. Only one per project.')
    }
  }

  Blockly.Blocks['register_item'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Item')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('magic_stick'), 'ITEM_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('Magic Stick'), 'ITEM_NAME')
      this.appendDummyInput()
        .appendField('Texture')
        .appendField(new Blockly.FieldTextInput('textures/item/magic_stick.png'), 'TEXTURE')
      this.appendValueInput('MAX_STACK')
        .setCheck('Number')
        .appendField('Max stack')
      this.appendDummyInput()
        .appendField('Is food')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'IS_FOOD')
      this.appendValueInput('FOOD_AMOUNT')
        .setCheck('Number')
        .appendField('Food amount')
      this.appendValueInput('FOOD_SATURATION')
        .setCheck('Number')
        .appendField('Saturation')
      this.appendStatementInput('BEHAVIORS')
        .setCheck('ItemBehavior')
        .appendField('Behaviors')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(ITEM_COLOR)
    }
  }

  Blockly.Blocks['register_block'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Block')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('crystal_block'), 'BLOCK_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('Crystal Block'), 'BLOCK_NAME')
      this.appendDummyInput()
        .appendField('Texture')
        .appendField(new Blockly.FieldTextInput('textures/block/crystal_block.png'), 'TEXTURE')
      this.appendValueInput('HARDNESS')
        .setCheck('Number')
        .appendField('Hardness')
      this.appendValueInput('LIGHT')
        .setCheck('Number')
        .appendField('Light level (0-15)')
      this.appendStatementInput('BEHAVIORS')
        .setCheck('BlockBehavior')
        .appendField('Behaviors')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(BLOCK_COLOR)
    }
  }

  Blockly.Blocks['register_armor'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Armor')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('ruby_helmet'), 'ARMOR_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('Ruby Helmet'), 'ARMOR_NAME')
      this.appendDummyInput()
        .appendField('Slot')
        .appendField(
          new Blockly.FieldDropdown([
            ['Helmet', 'HELMET'],
            ['Chestplate', 'CHESTPLATE'],
            ['Leggings', 'LEGGINGS'],
            ['Boots', 'BOOTS']
          ]),
          'SLOT'
        )
      this.appendDummyInput()
        .appendField('Texture')
        .appendField(new Blockly.FieldTextInput('textures/item/ruby_helmet.png'), 'TEXTURE')
      this.appendValueInput('PROTECTION')
        .setCheck('Number')
        .appendField('Protection')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(ITEM_COLOR)
    }
  }

  Blockly.Blocks['register_mob'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Mob')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('shadow_beast'), 'MOB_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('Shadow Beast'), 'MOB_NAME')
      this.appendDummyInput()
        .appendField('Model (geo)')
        .appendField(new Blockly.FieldTextInput('geo/shadow_beast.geo.json'), 'GEO')
      this.appendDummyInput()
        .appendField('Animations')
        .appendField(new Blockly.FieldTextInput('animations/shadow_beast.animation.json'), 'ANIMATIONS')
      this.appendDummyInput()
        .appendField('Texture')
        .appendField(new Blockly.FieldTextInput('textures/entity/shadow_beast.png'), 'TEXTURE')
      this.appendValueInput('HEALTH')
        .setCheck('Number')
        .appendField('Health')
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Speed')
      this.appendValueInput('DAMAGE')
        .setCheck('Number')
        .appendField('Attack Damage')
      this.appendStatementInput('AI')
        .setCheck('MobAI')
        .appendField('AI')
      this.appendStatementInput('ANIMATIONS')
        .setCheck('MobAnimation')
        .appendField('Animation Rules')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(MOB_COLOR)
    }
  }

  Blockly.Blocks['register_emote'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Register Emote')
        .appendField('ID')
        .appendField(new Blockly.FieldTextInput('wave'), 'EMOTE_ID')
        .appendField('Name')
        .appendField(new Blockly.FieldTextInput('Wave'), 'EMOTE_NAME')
      this.appendDummyInput()
        .appendField('Animation')
        .appendField(new Blockly.FieldTextInput('animations/emotes/wave.json'), 'ANIMATION')
      this.appendDummyInput()
        .appendField('Command')
        .appendField(new Blockly.FieldTextInput('wave'), 'COMMAND')
      this.appendDummyInput()
        .appendField('Lock movement')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'LOCK_MOVEMENT')
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Duration (seconds)')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(EMOTE_COLOR)
    }
  }
}
