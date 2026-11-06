import { PLANTS, entryRate, growthProgress, isBloomed, upgradeCost, MAX_PLANT_LEVEL } from '../game/plants';
import { formatNumber } from '../game/format';
import PlantIcon from './PlantIcon';

export default function SeedsPanel({
  slots,
  upgrades,
  level,
  oxygen,
  emptySlots,
  now,
  onPlant,
  onUpgrade,
}) {
  return (
    <ul className="row-list">
      {PLANTS.map((plant) => {
        const planted = slots
          .map((entry, index) => (entry && entry.plantId === plant.id ? { entry, index } : null))
          .filter(Boolean)
          .sort((a, b) => b.entry.level - a.entry.level);
        const main = planted[0];
        const locked = level < plant.unlockLevel;
        const poor = oxygen < plant.cost;
        const blooming = main && isBloomed(main.entry, upgrades, now);
        const growPct = main && !blooming ? growthProgress(main.entry, upgrades, now) : 1;
        const upCost = main ? upgradeCost(main.entry) : 0;
        const maxed = main ? main.entry.level >= MAX_PLANT_LEVEL : false;

        return (
          <li key={plant.id} className={`seed-row ${locked ? 'is-locked' : ''}`}>
            <div className="seed-icon">
              <PlantIcon plant={plant} size={40} />
            </div>

            <div className="seed-info">
              <div className="seed-line">
                <span className="seed-name">{plant.name}</span>
                <span className={`badge ${main ? 'badge-bloom' : 'badge-seed'}`}>
                  {main ? 'Bloom' : 'Seed'}
                </span>
              </div>

              {locked ? (
                <div className="seed-meta">Unlocks at level {plant.unlockLevel}</div>
              ) : main ? (
                <>
                  <div className="seed-meta">
                    Level {main.entry.level}/50 · {formatNumber(entryRate(main.entry, upgrades))}/s
                    {planted.length > 1 ? ` · ${planted.length} in pots` : ''}
                  </div>
                  <div className="seed-bar">
                    <span className="seed-bar-fill" style={{ width: `${growPct * 100}%` }} />
                    <span className="seed-bar-label">
                      {blooming ? 'Blooming' : `Growing ${Math.round(growPct * 100)}%`}
                    </span>
                  </div>
                </>
              ) : (
                <div className="seed-meta">
                  {formatNumber(plant.rate)}/s · grows in {plant.growTime}s
                </div>
              )}
            </div>

            <div className="seed-actions">
              {!locked && (
                <button
                  type="button"
                  className={`btn btn-plant ${poor ? 'is-poor' : ''}`}
                  disabled={emptySlots === 0}
                  onClick={() => onPlant(plant.id)}
                >
                  {emptySlots === 0 ? 'FULL' : 'PLANT'}
                  {emptySlots > 0 && <small>{formatNumber(plant.cost)}</small>}
                </button>
              )}
              {main && !locked && (
                <button
                  type="button"
                  className={`btn btn-upgrade ${oxygen < upCost ? 'is-poor' : ''}`}
                  disabled={maxed}
                  onClick={() => onUpgrade(main.index)}
                >
                  {maxed ? 'MAX' : 'UPGRADE'}
                  {!maxed && <small>{formatNumber(upCost)}</small>}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
