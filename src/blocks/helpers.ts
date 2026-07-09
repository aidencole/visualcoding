import * as Blockly from 'blockly'

export type StmtCheck = string | string[]

export interface FieldSpec {
  label?: string
  name: string
  type: 'text' | 'number' | 'checkbox' | 'dropdown'
  value?: string | number | boolean
  options?: [string, string][]
}

export interface InputSpec {
  name: string
  label: string
  check: string
  kind: 'value' | 'statement'
  stmtCheck?: StmtCheck
}

export interface BlockSpec {
  type: string
  color: string
  label?: string
  tooltip?: string
  output?: string
  previous?: StmtCheck
  next?: StmtCheck
  fields?: FieldSpec[]
  inputs?: InputSpec[]
}

export function registerBlockSpec(spec: BlockSpec): void {
  Blockly.Blocks[spec.type] = {
    init: function (this: Blockly.Block) {
      if (spec.label) {
        this.appendDummyInput().appendField(spec.label)
      }
      for (const field of spec.fields ?? []) {
        const input = this.appendDummyInput()
        if (field.label) input.appendField(field.label)
        switch (field.type) {
          case 'text':
            input.appendField(new Blockly.FieldTextInput(String(field.value ?? '')), field.name)
            break
          case 'number':
            input.appendField(new Blockly.FieldNumber(Number(field.value ?? 0)), field.name)
            break
          case 'checkbox':
            input.appendField(new Blockly.FieldCheckbox(field.value ? 'TRUE' : 'FALSE'), field.name)
            break
          case 'dropdown':
            input.appendField(new Blockly.FieldDropdown(field.options ?? [['', '']]), field.name)
            break
        }
      }
      for (const input of spec.inputs ?? []) {
        if (input.kind === 'value') {
          this.appendValueInput(input.name).setCheck(input.check).appendField(input.label)
        } else {
          this.appendStatementInput(input.name)
            .setCheck(input.stmtCheck ?? ['Action', 'Logic'])
            .appendField(input.label)
        }
      }
      if (spec.output) this.setOutput(true, spec.output)
      if (spec.previous) this.setPreviousStatement(true, spec.previous)
      if (spec.next) this.setNextStatement(true, spec.next)
      this.setColour(spec.color)
      if (spec.tooltip) this.setTooltip(spec.tooltip)
    }
  }
}

export function registerBlockSpecs(specs: BlockSpec[]): void {
  for (const spec of specs) registerBlockSpec(spec)
}

export const STMT: StmtCheck = ['Action', 'Logic']
