import { UPGRADES, shopUpgradeCost } from '../game/plants';
import { formatNumber } from '../game/format';

export default function ShopPanel({ upgrades, oxygen, onBuy }) {
  return (
    <ul className="row-list">
      {UPGRADES.map((upgrade) => {
        const level = upgrades[upgrade.key] ?? 0;
        const maxed = level >= upgrade.max;
        const cost = shopUpgradeCost(upgrade, level);
        return (
          <li key={upgrade.key} className="seed-row">
            <div className="boost-orb" style={{ background: upgrade.accent }} />
            <div className="seed-info">
              <div className="seed-line">
                <span className="seed-name">{upgrade.name}</span>
                <span className="badge badge-level">
                  {level}/{upgrade.max}
                </span>
              </div>
              <div className="seed-meta">{upgrade.blurb}</div>
              <div className="pips">
                {Array.from({ length: upgrade.max }).map((_, i) => (
                  <span key={i} className={`pip ${i < level ? 'is-on' : ''}`} />
                ))}
              </div>
            </div>
            <div className="seed-actions">
              <button
                type="button"
                className={`btn btn-plant ${oxygen < cost ? 'is-poor' : ''}`}
                disabled={maxed}
                onClick={() => onBuy(upgrade.key)}
              >
                {maxed ? 'MAX' : 'BUY'}
                {!maxed && <small>{formatNumber(cost)}</small>}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
