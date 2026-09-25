import { system } from '@minecraft/server';

import { HorizontalMultiBlockPlacer } from './blocks/index.js';

const blockComps = {
  'ajr:surround': HorizontalMultiBlockPlacer,
};

system.beforeEvents.startup.subscribe(
  ({ blockComponentRegistry }) => {
    for (const [name, comp] of Object.entries(blockComps)) {
      blockComponentRegistry.registerCustomComponent(name, comp);
    }
  }
);
