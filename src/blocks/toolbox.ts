export const toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  <category name="Setup" colour="#5C81A6">
    <block type="mod_setup"></block>
  </category>

  <category name="Items" colour="#5CA65C">
    <block type="register_item">
      <value name="MAX_STACK"><block type="math_number"><field name="NUM">64</field></block></value>
      <value name="FOOD_AMOUNT"><block type="math_number"><field name="NUM">4</field></block></value>
      <value name="FOOD_SATURATION"><block type="math_number"><field name="NUM">0.3</field></block></value>
    </block>
    <block type="register_armor">
      <value name="PROTECTION"><block type="math_number"><field name="NUM">3</field></block></value>
    </block>
  </category>

  <category name="Blocks" colour="#A65C5C">
    <block type="register_block">
      <value name="HARDNESS"><block type="math_number"><field name="NUM">2</field></block></value>
      <value name="LIGHT"><block type="math_number"><field name="NUM">0</field></block></value>
    </block>
  </category>

  <category name="Mobs" colour="#A65CA6">
    <block type="register_mob">
      <value name="HEALTH"><block type="math_number"><field name="NUM">40</field></block></value>
      <value name="SPEED"><block type="math_number"><field name="NUM">0.3</field></block></value>
      <value name="DAMAGE"><block type="math_number"><field name="NUM">6</field></block></value>
    </block>
  </category>

  <category name="Emotes" colour="#5CA6A6">
    <block type="register_emote">
      <value name="DURATION"><block type="math_number"><field name="NUM">2</field></block></value>
    </block>
  </category>

  <category name="Global Events" colour="#D65C5C">
    <block type="register_command"></block>
    <block type="on_player_join"></block>
    <block type="on_player_death"></block>
    <block type="on_player_respawn"></block>
    <block type="on_server_tick"></block>
  </category>

  <category name="Item Events" colour="#CF8B34">
    <block type="on_right_click"></block>
    <block type="on_shift_right_click"></block>
    <block type="on_hit_entity"></block>
  </category>

  <category name="Block Events" colour="#CF8B34">
    <block type="on_block_interact"></block>
    <block type="on_block_step"></block>
    <block type="on_block_break"></block>
  </category>

  <category name="Logic" colour="#5C81A6">
    <block type="logic_if_health_below">
      <value name="PERCENT"><block type="math_number"><field name="NUM">50</field></block></value>
    </block>
    <block type="logic_random_chance">
      <value name="PERCENT"><block type="math_number"><field name="NUM">50</field></block></value>
    </block>
    <block type="logic_if_sneaking"></block>
    <block type="logic_if_not_sneaking"></block>
    <block type="logic_repeat">
      <value name="TIMES"><block type="math_number"><field name="NUM">3</field></block></value>
    </block>
  </category>

  <category name="Player Actions" colour="#5C68A6">
    <block type="action_send_message"></block>
    <block type="action_broadcast_message"></block>
    <block type="action_show_title"></block>
    <block type="action_heal">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">5</field></block></value>
    </block>
    <block type="action_deal_damage">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">5</field></block></value>
    </block>
    <block type="action_damage_target">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">5</field></block></value>
    </block>
    <block type="action_give_effect">
      <value name="DURATION"><block type="math_number"><field name="NUM">5</field></block></value>
      <value name="AMPLIFIER"><block type="math_number"><field name="NUM">1</field></block></value>
    </block>
    <block type="action_remove_effect"></block>
    <block type="action_clear_effects"></block>
    <block type="action_teleport">
      <value name="X"><block type="math_number"><field name="NUM">0</field></block></value>
      <value name="Y"><block type="math_number"><field name="NUM">1</field></block></value>
      <value name="Z"><block type="math_number"><field name="NUM">0</field></block></value>
    </block>
    <block type="action_teleport_to">
      <value name="X"><block type="math_number"><field name="NUM">0</field></block></value>
      <value name="Y"><block type="math_number"><field name="NUM">64</field></block></value>
      <value name="Z"><block type="math_number"><field name="NUM">0</field></block></value>
    </block>
    <block type="action_give_item">
      <value name="COUNT"><block type="math_number"><field name="NUM">1</field></block></value>
    </block>
    <block type="action_give_xp">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">10</field></block></value>
    </block>
    <block type="action_set_hunger">
      <value name="AMOUNT"><block type="math_number"><field name="NUM">20</field></block></value>
    </block>
    <block type="action_knockback">
      <value name="STRENGTH"><block type="math_number"><field name="NUM">1</field></block></value>
    </block>
    <block type="action_burn">
      <value name="SECONDS"><block type="math_number"><field name="NUM">5</field></block></value>
    </block>
    <block type="action_extinguish"></block>
    <block type="action_run_command"></block>
  </category>

  <category name="World Actions" colour="#8B5CA6">
    <block type="action_lightning"></block>
    <block type="action_explosion">
      <value name="POWER"><block type="math_number"><field name="NUM">2</field></block></value>
    </block>
    <block type="action_set_time">
      <value name="TIME"><block type="math_number"><field name="NUM">6000</field></block></value>
    </block>
    <block type="action_set_weather_clear">
      <value name="SECONDS"><block type="math_number"><field name="NUM">60</field></block></value>
    </block>
    <block type="action_summon_mob">
      <value name="COUNT"><block type="math_number"><field name="NUM">1</field></block></value>
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
    <block type="ai_flee_player">
      <value name="HEALTH_PERCENT"><block type="math_number"><field name="NUM">30</field></block></value>
      <value name="RANGE"><block type="math_number"><field name="NUM">8</field></block></value>
    </block>
    <block type="ai_ranged_attack">
      <value name="RANGE"><block type="math_number"><field name="NUM">12</field></block></value>
    </block>
  </category>

  <category name="Mob Animations" colour="#A65CA6">
    <block type="anim_when_idle"></block>
    <block type="anim_when_moving"></block>
    <block type="anim_when_attacking"></block>
    <block type="anim_when_hurt"></block>
  </category>

  <category name="Math" colour="#5C81A6">
    <block type="math_number"></block>
  </category>
</xml>
`
