import { registerActionBlocks } from './actions'
import { registerCatalogBlocks, catalogToolboxXml } from './catalog'
import { registerDefinitionBlocks } from './definitions'
import { registerEventBlocks } from './events'
import { registerLogicBlocks } from './logic'
import { registerMobBlocks, registerMathBlocks } from './mobs'
import { toolboxXml as baseToolboxXml } from './toolbox'

export function registerBlocks(): void {
  registerDefinitionBlocks()
  registerEventBlocks()
  registerLogicBlocks()
  registerActionBlocks()
  registerCatalogBlocks()
  registerMobBlocks()
  registerMathBlocks()
}

export const toolboxXml = baseToolboxXml.replace('</xml>', `${catalogToolboxXml()}\n</xml>`)
