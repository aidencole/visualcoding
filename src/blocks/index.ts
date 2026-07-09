import * as Blockly from 'blockly'

const MOD_COLOR = '#5C81A6'
const ITEM_COLOR = '#5CA65C'
const BLOCK_COLOR = '#A65C5C'
const MOB_COLOR = '#A65CA6'
const EVENT_COLOR = '#CF8B34'
const ACTION_COLOR = '#5C68A6'
const EFFECT_COLOR = '#8B5CA6'
const EMOTE_COLOR = '#5CA6A6'

export function registerBlocks(): void {
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
      this.setHelpUrl('')
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
      this.appendStatementInput('BEHAVIORS')
        .setCheck('ItemBehavior')
        .appendField('Behaviors')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(ITEM_COLOR)
      this.setTooltip('Creates a custom item.')
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
      this.appendStatementInput('BEHAVIORS')
        .setCheck('BlockBehavior')
        .appendField('Behaviors')
      this.setPreviousStatement(true, 'Definition')
      this.setNextStatement(true, 'Definition')
      this.setColour(BLOCK_COLOR)
      this.setTooltip('Creates a custom block.')
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
      this.setTooltip('Creates a custom armor piece.')
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
      this.setTooltip('Creates an animated mob with AI.')
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
      this.setTooltip('Player emote triggered by command.')
    }
  }

  Blockly.Blocks['on_right_click'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck('Action')
        .appendField('When player right-clicks')
      this.setPreviousStatement(true, 'ItemBehavior')
      this.setNextStatement(true, 'ItemBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

  Blockly.Blocks['on_block_interact'] = {
    init: function (this: Blockly.Block) {
      this.appendStatementInput('ACTIONS')
        .setCheck('Action')
        .appendField('When player interacts with block')
      this.setPreviousStatement(true, 'BlockBehavior')
      this.setNextStatement(true, 'BlockBehavior')
      this.setColour(EVENT_COLOR)
    }
  }

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

  Blockly.Blocks['action_send_message'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Send message')
        .appendField(new Blockly.FieldTextInput('Hello!'), 'MESSAGE')
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_deal_damage'] = {
    init: function (this: Blockly.Block) {
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('Deal damage')
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_give_effect'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Give effect')
        .appendField(
          new Blockly.FieldDropdown([
            ['Speed', 'SPEED'],
            ['Slowness', 'SLOWNESS'],
            ['Strength', 'STRENGTH'],
            ['Regeneration', 'REGENERATION'],
            ['Poison', 'POISON'],
            ['Glowing', 'GLOWING']
          ]),
          'EFFECT'
        )
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('for seconds')
      this.appendValueInput('AMPLIFIER')
        .setCheck('Number')
        .appendField('level')
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
      this.setColour(ACTION_COLOR)
    }
  }

  Blockly.Blocks['action_spawn_particle'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Spawn particle')
        .appendField(new Blockly.FieldTextInput('textures/particle/spark.png'), 'TEXTURE')
      this.appendValueInput('COUNT')
        .setCheck('Number')
        .appendField('count')
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
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
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['action_play_sound'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Play sound')
        .appendField(
          new Blockly.FieldDropdown([
            ['Explosion', 'EXPLODE'],
            ['Enderman teleport', 'ENDERMAN_TELEPORT'],
            ['Anvil land', 'ANVIL_LAND'],
            ['Level up', 'LEVEL_UP']
          ]),
          'SOUND'
        )
      this.setPreviousStatement(true, 'Action')
      this.setNextStatement(true, 'Action')
      this.setColour(EFFECT_COLOR)
    }
  }

  Blockly.Blocks['math_number'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'NUM')
      this.setOutput(true, 'Number')
      this.setColour('#5C81A6')
    }
  }
}

export const toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  <category name="Setup" colour="#5C81A6">
    <block type="mod_setup"></block>
  </category>
  <category name="Items" colour="#5CA65C">
    <block type="register_item">
      <statement name="BEHAVIORS">
        <block type="on_right_click">
          <statement name="ACTIONS">
            <block type="action_send_message"></block>
          </statement>
        </block>
      </statement>
    </block>
    <block type="register_armor">
      <value name="PROTECTION">
        <block type="math_number"><field name="NUM">3</field></block>
      </value>
    </block>
  </category>
  <category name="Blocks" colour="#A65C5C">
    <block type="register_block">
      <value name="HARDNESS">
        <block type="math_number"><field name="NUM">2</field></block>
      </value>
    </block>
  </category>
  <category name="Mobs" colour="#A65CA6">
    <block type="register_mob">
      <value name="HEALTH"><block type="math_number"><field name="NUM">40</field></block></value>
      <value name="SPEED"><block type="math_number"><field name="NUM">0.3</field></block></value>
      <value name="DAMAGE"><block type="math_number"><field name="NUM">6</field></block></value>
      <statement name="AI">
        <block type="ai_chase_player">
          <value name="RANGE"><block type="math_number"><field name="NUM">16</field></block></value>
          <next>
            <block type="ai_melee_attack">
              <value name="RANGE"><block type="math_number"><field name="NUM">2</field></block></value>
              <next>
                <block type="ai_idle_wander"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
      <statement name="ANIMATIONS">
        <block type="anim_when_idle">
          <next>
            <block type="anim_when_moving">
              <next>
                <block type="anim_when_attacking"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </category>
  <category name="Emotes" colour="#5CA6A6">
    <block type="register_emote">
      <value name="DURATION">
        <block type="math_number"><field name="NUM">2</field></block>
      </value>
    </block>
  </category>
  <category name="Events" colour="#CF8B34">
    <block type="on_right_click"></block>
    <block type="on_block_interact"></block>
  </category>
  <category name="Actions" colour="#5C68A6">
    <block type="action_send_message"></block>
    <block type="action_deal_damage">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">5</field></block></value>
    </block>
    <block type="action_give_effect">
      <value name="DURATION"><block type="math_number"><field name="NUM">5</field></block></value>
      <value name="AMPLIFIER"><block type="math_number"><field name="NUM">1</field></block></value>
    </block>
    <block type="action_spawn_particle">
      <value name="COUNT"><block type="math_number"><field name="NUM">10</field></block></value>
    </block>
    <block type="action_screenshake">
      <value name="INTENSITY"><block type="math_number"><field name="NUM">0.5</field></block></value>
      <value name="DURATION"><block type="math_number"><field name="NUM">0.3</field></block></value>
    </block>
    <block type="action_play_sound"></block>
  </category>
  <category name="Mob AI" colour="#A65CA6">
    <block type="ai_idle_wander"></block>
    <block type="ai_chase_player">
      <value name="RANGE"><block type="math_number"><field name="NUM">16</field></block></value>
    </block>
    <block type="ai_melee_attack">
      <value name="RANGE"><block type="math_number"><field name="NUM">2</field></block></value>
    </block>
  </category>
  <category name="Mob Animations" colour="#A65CA6">
    <block type="anim_when_idle"></block>
    <block type="anim_when_moving"></block>
    <block type="anim_when_attacking"></block>
  </category>
  <category name="Math" colour="#5C81A6">
    <block type="math_number"></block>
  </category>
</xml>
`
