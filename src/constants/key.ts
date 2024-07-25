const image = {
  spike: "spike",
  tiles: "tiles",
} as const;

const scene = {
  Boot: "boot",
  Game: "game",
} as const;

const spritesheet = {
  characters: "characters",
  player: "characters",
} as const;

const tilemap = {
  platformer: "tilemap",
  background: "background",
} as const;

export const key = {
  image,
  scene,
  spritesheet,
  tilemap,
} as const;
