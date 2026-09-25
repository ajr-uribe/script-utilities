import type {
  BlockCustomComponent,
  VectorXZ,
  Block,
} from '@minecraft/server';

type BlockParams = {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
  northwest?: string;
  northeast?: string;
  southwest?: string;
  southeast?: string;
  all?: string;
  replace?: boolean;
};

function handleReplace(
  target: Block | undefined,
  blockId: string | boolean,
  replace: boolean | undefined
) {
  if (typeof blockId !== 'string') return;

  if (replace || replace === undefined) {
    target?.setType(blockId);
  } else {
    if (target?.isAir) {
      target?.setType(blockId);
    }
  }
}

export default {
  onPlace: ({ block }, { params }: { params: BlockParams }) => {
    const DIRECTION_OFFSETS: Record<string, VectorXZ> = {
      east: { x: 1, z: 0 },
      west: { x: -1, z: 0 },
      south: { x: 0, z: 1 },
      north: { x: 0, z: -1 },

      northwest: { x: -1, z: -1 },
      northeast: { x: 1, z: -1 },
      southwest: { x: -1, z: 1 },
      southeast: { x: 1, z: 1 },
    };

    const center = block.location;
    const dimension = block.dimension;

    if (params.all) {
      for (const offset of Object.values(DIRECTION_OFFSETS)) {
        const target = dimension.getBlock({
          x: center.x + offset.x,
          y: center.y,
          z: center.z + offset.z,
        });

        handleReplace(target, params.all, params.replace);
      }

      return;
    }

    for (const [direction, blockId] of Object.entries(params)) {
      if (direction === 'all' || direction === 'replace')
        continue;

      const offset = DIRECTION_OFFSETS[direction];

      if (!offset || !blockId) continue;

      const target = dimension.getBlock({
        x: center.x + offset.x,
        y: center.y,
        z: center.z + offset.z,
      });

      handleReplace(target, blockId, params.replace);
    }
  },
} as BlockCustomComponent;
