import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BOOSTER_BY_ID,
  MAX_PLANT_LEVEL,
  PLANT_BY_ID,
  SLOT_COUNT,
  UPGRADE_BY_KEY,
  entryRate,
  gardenRate,
  growSeconds,
  isBloomed,
  shopUpgradeCost,
  upgradeCost,
  xpForLevel,
} from './plants';
import { formatNumber } from './format';

const SAVE_KEY = 'seedling.save.v1';
const OFFLINE_CAP_MS = 2 * 60 * 60 * 1000;
const GEMS_PER_LEVEL = 8;

function startingState() {
  const now = Date.now();
  const slots = Array.from({ length: SLOT_COUNT }, () => null);
  slots[0] = { plantId: 'daisy', plantedAt: now - 40_000, level: 1, bloomXp: true };
  slots[2] = { plantId: 'daisy', plantedAt: now - 40_000, level: 2, bloomXp: true };
  slots[3] = { plantId: 'peony', plantedAt: now - 60_000, level: 1, bloomXp: true };
  slots[5] = { plantId: 'peony', plantedAt: now - 6_000, level: 1 };
  return {
    oxygen: 150,
    gems: 115,
    level: 1,
    xp: 0,
    slots,
    upgrades: { fertilizer: 0, soil: 0, trowel: 0 },
    boostUntil: 0,
    createdAt: now,
  };
}

function addXp(state, amount) {
  let { level, xp, gems } = state;
  xp += amount;
  let needed = xpForLevel(level);
  while (xp >= needed) {
    xp -= needed;
    level += 1;
    gems += GEMS_PER_LEVEL;
    needed = xpForLevel(level);
  }
  return { level, xp, gems };
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { state: startingState(), offlineGain: 0 };
    const saved = JSON.parse(raw);
    const base = startingState();
    // A saved garden is authoritative: an empty pot stays empty. Only a save
    // without a slots array at all falls back to the starter planting.
    const savedSlots = Array.isArray(saved?.slots) ? saved.slots : base.slots;
    const state = {
      ...base,
      ...saved,
      slots: Array.from({ length: SLOT_COUNT }, (_, i) => savedSlots[i] ?? null),
      upgrades: { ...base.upgrades, ...(saved.upgrades || {}) },
    };
    const away = Math.min(Math.max(0, Date.now() - (saved.lastSeen || Date.now())), OFFLINE_CAP_MS);
    const offlineGain = away > 5000 ? gardenRate(state) * (away / 1000) * 0.5 : 0;
    return { state: { ...state, oxygen: state.oxygen + offlineGain }, offlineGain };
  } catch {
    return { state: startingState(), offlineGain: 0 };
  }
}

export function useGame() {
  const [boot] = useState(loadGame);
  const [state, setState] = useState(boot.state);
  const [now, setNow] = useState(() => Date.now());
  const [toasts, setToasts] = useState([]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const pushToast = useCallback((text, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list.slice(-2), { id, text, kind }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  useEffect(() => {
    if (boot.offlineGain > 1) {
      pushToast(`Welcome back · +${formatNumber(boot.offlineGain)} oxygen`, 'good');
    }
  }, [boot, pushToast]);

  const lastLevel = useRef(state.level);
  useEffect(() => {
    if (state.level > lastLevel.current) {
      pushToast(`Level ${state.level} · +${GEMS_PER_LEVEL} gems`, 'good');
    }
    lastLevel.current = state.level;
  }, [state.level, pushToast]);

  // Passive production.
  useEffect(() => {
    let last = Date.now();
    const id = window.setInterval(() => {
      const t = Date.now();
      const dt = Math.min((t - last) / 1000, 5);
      last = t;
      setNow(t);
      setState((s) => {
        const boost = t < s.boostUntil ? 2 : 1;
        const gain = gardenRate(s, t) * boost * dt;

        // First bloom of each planting pays out a little xp as well.
        let bloomXp = 0;
        const slots = s.slots.map((entry) => {
          if (!entry || entry.bloomXp || !isBloomed(entry, s.upgrades, t)) return entry;
          bloomXp += Math.round((PLANT_BY_ID[entry.plantId]?.cost ?? 0) / 10);
          return { ...entry, bloomXp: true };
        });

        if (gain <= 0 && bloomXp === 0) return s;
        return {
          ...s,
          slots,
          oxygen: s.oxygen + gain,
          ...(bloomXp > 0 ? addXp(s, bloomXp) : {}),
        };
      });
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  // Persistence: debounce a write after every change, plus one when the tab hides.
  const saveNow = useCallback(() => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ ...stateRef.current, lastSeen: Date.now() }),
      );
    } catch {
      /* storage unavailable — the garden just won't persist */
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(saveNow, 400);
    return () => window.clearTimeout(id);
  }, [state, saveNow]);

  useEffect(() => {
    const onHide = () => saveNow();
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
      saveNow();
    };
  }, [saveNow]);

  const rate = useMemo(() => {
    const boost = now < state.boostUntil ? 2 : 1;
    return gardenRate(state, now) * boost;
  }, [state, now]);

  const boostActive = now < state.boostUntil;
  const boostRemaining = Math.max(0, state.boostUntil - now);
  const xpNeeded = xpForLevel(state.level);
  const emptySlots = state.slots.filter((s) => !s).length;

  const plant = useCallback(
    (plantId, preferredSlot = null) => {
      const plantDef = PLANT_BY_ID[plantId];
      const s = stateRef.current;
      if (!plantDef) return;
      if (s.level < plantDef.unlockLevel) {
        pushToast(`${plantDef.name} unlocks at level ${plantDef.unlockLevel}`, 'warn');
        return;
      }
      if (s.oxygen < plantDef.cost) {
        pushToast('Not enough oxygen', 'warn');
        return;
      }
      const preferred =
        preferredSlot !== null && !s.slots[preferredSlot] ? preferredSlot : -1;
      const slotIndex = preferred >= 0 ? preferred : s.slots.findIndex((slot) => !slot);
      if (slotIndex < 0) {
        pushToast('Every pot is full', 'warn');
        return;
      }
      const plantedAt = Date.now();
      setState((prev) => {
        const slots = prev.slots.slice();
        slots[slotIndex] = { plantId, plantedAt, level: 1 };
        return {
          ...prev,
          slots,
          oxygen: prev.oxygen - plantDef.cost,
          ...addXp(prev, Math.round(plantDef.cost / 6)),
        };
      });
      pushToast(`${plantDef.name} planted`, 'good');
    },
    [pushToast],
  );

  const upgrade = useCallback(
    (slotIndex) => {
      const s = stateRef.current;
      const entry = s.slots[slotIndex];
      if (!entry) return;
      if (entry.level >= MAX_PLANT_LEVEL) {
        pushToast('This plant is maxed out', 'warn');
        return;
      }
      const cost = upgradeCost(entry);
      if (s.oxygen < cost) {
        pushToast('Not enough oxygen', 'warn');
        return;
      }
      setState((prev) => {
        const slots = prev.slots.slice();
        const current = slots[slotIndex];
        if (!current) return prev;
        slots[slotIndex] = { ...current, level: current.level + 1 };
        return {
          ...prev,
          slots,
          oxygen: prev.oxygen - cost,
          ...addXp(prev, Math.round(cost / 10)),
        };
      });
      pushToast(`${PLANT_BY_ID[entry.plantId]?.name ?? 'Plant'} · level ${entry.level + 1}`, 'good');
    },
    [pushToast],
  );

  const tap = useCallback(
    (slotIndex) => {
      const s = stateRef.current;
      const entry = s.slots[slotIndex];
      if (!entry) return;
      if (!isBloomed(entry, s.upgrades)) {
        pushToast('Still growing…', 'info');
        return;
      }
      const boost = Date.now() < s.boostUntil ? 2 : 1;
      const gain = entryRate(entry, s.upgrades) * 2 * Math.pow(2, s.upgrades.trowel) * boost;
      setState((prev) => ({ ...prev, oxygen: prev.oxygen + gain }));
      pushToast(`+${formatNumber(gain)} oxygen`, 'good');
    },
    [pushToast],
  );

  const buyUpgrade = useCallback(
    (key) => {
      const def = UPGRADE_BY_KEY[key];
      const s = stateRef.current;
      if (!def) return;
      const level = s.upgrades[key] ?? 0;
      if (level >= def.max) return;
      const cost = shopUpgradeCost(def, level);
      if (s.oxygen < cost) {
        pushToast('Not enough oxygen', 'warn');
        return;
      }
      setState((prev) => ({
        ...prev,
        oxygen: prev.oxygen - cost,
        upgrades: { ...prev.upgrades, [key]: (prev.upgrades[key] ?? 0) + 1 },
      }));
      pushToast(`${def.name} improved`, 'good');
    },
    [pushToast],
  );

  const activateBooster = useCallback(
    (id) => {
      const def = BOOSTER_BY_ID[id];
      const s = stateRef.current;
      if (!def) return;
      if (s.gems < def.gems) {
        pushToast('Not enough gems', 'warn');
        return;
      }
      if (id === 'rush') {
        const from = Math.max(Date.now(), s.boostUntil);
        setState((prev) => ({
          ...prev,
          gems: prev.gems - def.gems,
          boostUntil: from + def.duration,
        }));
        pushToast('Oxygen rush active · x2', 'good');
      } else if (id === 'sprout') {
        const t = Date.now();
        setState((prev) => ({
          ...prev,
          gems: prev.gems - def.gems,
          slots: prev.slots.map((entry) =>
            entry
              ? { ...entry, plantedAt: t - growSeconds(entry, prev.upgrades) * 1000 }
              : entry,
          ),
        }));
        pushToast('Every plant is blooming', 'good');
      } else if (id === 'harvest') {
        const boost = Date.now() < s.boostUntil ? 2 : 1;
        const gain = gardenRate(s) * 120 * boost;
        setState((prev) => ({ ...prev, gems: prev.gems - def.gems, oxygen: prev.oxygen + gain }));
        pushToast(`+${formatNumber(gain)} oxygen`, 'good');
      }
    },
    [pushToast],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    setState(startingState());
    pushToast('Fresh garden planted', 'info');
  }, [pushToast]);

  return {
    state,
    now,
    rate,
    boostActive,
    boostRemaining,
    xpNeeded,
    emptySlots,
    toasts,
    plant,
    upgrade,
    tap,
    buyUpgrade,
    activateBooster,
    reset,
    pushToast,
  };
}
