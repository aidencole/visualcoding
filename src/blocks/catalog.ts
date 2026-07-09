import { registerBlockSpecs } from './helpers'
import { EXTRA_ACTION_BLOCKS, EXTRA_EVENT_BLOCKS, EXTRA_LOGIC_BLOCKS } from './catalog-data'

export function registerCatalogBlocks(): void {
  registerBlockSpecs(EXTRA_ACTION_BLOCKS)
  registerBlockSpecs(EXTRA_LOGIC_BLOCKS)
  registerBlockSpecs(EXTRA_EVENT_BLOCKS)
}

export function catalogToolboxXml(): string {
  const actionBlocks = EXTRA_ACTION_BLOCKS.map((b) => `    <block type="${b.type}"></block>`).join('\n')
  const logicBlocks = EXTRA_LOGIC_BLOCKS.map((b) => `    <block type="${b.type}"></block>`).join('\n')
  const eventBlocks = EXTRA_EVENT_BLOCKS.map((b) => `    <block type="${b.type}"></block>`).join('\n')

  return `
  <category name="More Actions" colour="#5C68A6">
${actionBlocks}
  </category>
  <category name="More Logic" colour="#5C81A6">
${logicBlocks}
  </category>
  <category name="More Events" colour="#D65C5C">
${eventBlocks}
  </category>`
}
