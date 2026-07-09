import { registerActionBlocks } from './actions'
import { registerDefinitionBlocks } from './definitions'
import { registerEventBlocks } from './events'
import { registerLogicBlocks } from './logic'
import { registerMobBlocks, registerMathBlocks } from './mobs'

export { toolboxXml } from './toolbox'

export function registerBlocks(): void {
  registerDefinitionBlocks()
  registerEventBlocks()
  registerLogicBlocks()
  registerActionBlocks()
  registerMobBlocks()
  registerMathBlocks()
}
