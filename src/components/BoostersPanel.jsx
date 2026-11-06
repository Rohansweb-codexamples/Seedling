import { BOOSTERS } from '../game/plants';
import { formatDuration } from '../game/format';

export default function BoostersPanel({ gems, boostActive, boostRemaining, onActivate }) {
  return (
    <ul className="row-list">
      {BOOSTERS.map((booster) => {
        const active = booster.id === 'rush' && boostActive;
        return (
          <li key={booster.id} className="seed-row">
            <div className="boost-orb" style={{ background: booster.accent }} />
            <div className="seed-info">
              <div className="seed-line">
                <span className="seed-name">{booster.name}</span>
                {active && <span className="badge badge-bloom">{formatDuration(boostRemaining)}</span>}
              </div>
              <div className="seed-meta">{booster.blurb}</div>
            </div>
            <div className="seed-actions">
              <button
                type="button"
                className={`btn btn-gem ${gems < booster.gems ? 'is-poor' : ''}`}
                onClick={() => onActivate(booster.id)}
              >
                {active ? 'ADD' : 'USE'}
                <small>{booster.gems} gems</small>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
