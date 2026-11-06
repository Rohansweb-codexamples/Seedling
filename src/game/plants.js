export const MAX_PLANT_LEVEL = 50;

/**
 * Plant catalogue. `flower` picks the 3D builder, the colours drive both the
 * meshes and the little SVG icon in the seeds list.
 */
export const PLANTS = [
  {
    id: 'daisy',
    name: 'Daisy',
    cost: 15,
    growTime: 15,
    rate: 3,
    unlockLevel: 1,
    flower: 'daisy',
    height: 0.36,
    headScale: 1,
    petal: '#fdf6e8',
    petalEdge: '#e3d3b4',
    center: '#ffc63b',
    stem: '#4c9a44',
    leaf: '#5cb14f',
  },
  {
    id: 'peony',
    name: 'Peonies',
    cost: 150,
    growTime: 30,
    rate: 18,
    unlockLevel: 1,
    flower: 'peony',
    height: 0.34,
    headScale: 1,
    petal: '#f58fb4',
    petalEdge: '#d96a95',
    center: '#ffd6e4',
    stem: '#448c3e',
    leaf: '#54a84a',
  },
  {
    id: 'hyacinth',
    name: 'Hyacinth',
    cost: 1500,
    growTime: 60,
    rate: 120,
    unlockLevel: 2,
    flower: 'spike',
    height: 0.42,
    headScale: 1,
    petal: '#8e7ff0',
    petalEdge: '#6b5cd6',
    center: '#c3baff',
    stem: '#4f9a45',
    leaf: '#5cb14f',
  },
  {
    id: 'lotus',
    name: 'Black Lotus',
    cost: 15000,
    growTime: 120,
    rate: 900,
    unlockLevel: 4,
    flower: 'lotus',
    height: 0.4,
    headScale: 1.1,
    petal: '#4a2f6b',
    petalEdge: '#2a1745',
    center: '#e6c14a',
    stem: '#3d7a38',
    leaf: '#4f9a45',
  },
  {
    id: 'camellia',
    name: 'Camellia',
    cost: 150000,
    growTime: 240,
    rate: 8000,
    unlockLevel: 6,
    flower: 'camellia',
    height: 0.34,
    headScale: 1,
    petal: '#e8443f',
    petalEdge: '#b52c2b',
    center: '#ffd05a',
    stem: '#3a7a35',
    leaf: '#4a9a42',
  },
];

export const PLANT_BY_ID = Object.fromEntries(PLANTS.map((p) => [p.id, p]));

/** Shelf layout: three wooden boards, eight pots. y = board top surface. */
export const SHELVES = [
  { y: 1.35, width: 1.95 },
  { y: -0.05, width: 2.55 },
  { y: -1.45, width: 2.55 },
];

export const SLOTS = [
  { id: 0, x: -0.5, y: 1.35 },
  { id: 1, x: 0.5, y: 1.35 },
  { id: 2, x: -0.88, y: -0.05 },
  { id: 3, x: 0, y: -0.05 },
  { id: 4, x: 0.88, y: -0.05 },
  { id: 5, x: -0.88, y: -1.45 },
  { id: 6, x: 0, y: -1.45 },
  { id: 7, x: 0.88, y: -1.45 },
];

export const SLOT_COUNT = SLOTS.length;

export const BOOSTERS = [
  {
    id: 'rush',
    name: 'Oxygen Rush',
    blurb: 'Double every plant for 10 minutes.',
    gems: 25,
    duration: 10 * 60 * 1000,
    accent: '#ff7bb0',
  },
  {
    id: 'sprout',
    name: 'Sprout Boost',
    blurb: 'Every growing plant blooms instantly.',
    gems: 15,
    accent: '#57c26a',
  },
  {
    id: 'harvest',
    name: 'Harvest Boon',
    blurb: 'Pocket two minutes of oxygen right now.',
    gems: 8,
    accent: '#4cc3f0',
  },
];

export const BOOSTER_BY_ID = Object.fromEntries(BOOSTERS.map((b) => [b.id, b]));

export const UPGRADES = [
  {
    key: 'fertilizer',
    name: 'Fertilizer',
    blurb: '+20% oxygen from every plant.',
    max: 10,
    baseCost: 2500,
    growth: 3.2,
    accent: '#7bd06a',
  },
  {
    key: 'soil',
    name: 'Rich Soil',
    blurb: 'Plants grow 15% faster.',
    max: 5,
    baseCost: 5000,
    growth: 4.5,
    accent: '#c98d54',
  },
  {
    key: 'trowel',
    name: 'Golden Trowel',
    blurb: 'Tapping a bloomed plant gives double oxygen.',
    max: 3,
    baseCost: 1200,
    growth: 6,
    accent: '#f2c14e',
  },
];

export const UPGRADE_BY_KEY = Object.fromEntries(UPGRADES.map((u) => [u.key, u]));

export function growSeconds(entry, upgrades) {
  const plant = PLANT_BY_ID[entry.plantId];
  if (!plant) return 1;
  return plant.growTime * Math.pow(0.85, upgrades.soil ?? 0);
}

export function isBloomed(entry, upgrades, now = Date.now()) {
  return now - entry.plantedAt >= growSeconds(entry, upgrades) * 1000;
}

export function growthProgress(entry, upgrades, now = Date.now()) {
  const total = growSeconds(entry, upgrades) * 1000;
  if (!total) return 1;
  return Math.min(1, Math.max(0, (now - entry.plantedAt) / total));
}

export function entryRate(entry, upgrades) {
  const plant = PLANT_BY_ID[entry.plantId];
  if (!plant) return 0;
  return (
    plant.rate *
    Math.pow(1.55, entry.level - 1) *
    (1 + 0.2 * (upgrades.fertilizer ?? 0))
  );
}

export function gardenRate(state, now = Date.now()) {
  return state.slots.reduce((sum, entry) => {
    if (!entry) return sum;
    if (!isBloomed(entry, state.upgrades, now)) return sum;
    return sum + entryRate(entry, state.upgrades);
  }, 0);
}

export function upgradeCost(entry) {
  const plant = PLANT_BY_ID[entry.plantId];
  if (!plant) return 0;
  return Math.round(plant.cost * 0.85 * Math.pow(1.75, entry.level - 1));
}

export function shopUpgradeCost(def, level) {
  return Math.round(def.baseCost * Math.pow(def.growth, level));
}

export function xpForLevel(level) {
  return Math.round(90 * Math.pow(level, 1.35));
}
