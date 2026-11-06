import { formatNumber, formatDuration } from '../game/format';
import { DiamondIcon, GearIcon } from './Icons';

export default function Hud({
  level,
  xp,
  xpNeeded,
  oxygen,
  rate,
  gems,
  boostActive,
  boostRemaining,
  onOpenBoosters,
  onOpenSettings,
}) {
  const circumference = 2 * Math.PI * 25;
  const progress = Math.min(1, xp / Math.max(1, xpNeeded));

  return (
    <>
      <div className="scrim-top" />
      <div className="hud">
        <div className="hud-inner">
          <div className="level-pill" title={`${xp} / ${xpNeeded} xp`}>
            <svg viewBox="0 0 60 60" className="level-ring">
              <circle cx="30" cy="30" r="25" className="level-ring-bg" />
              <circle
                cx="30"
                cy="30"
                r="25"
                className="level-ring-fg"
                strokeDasharray={`${progress * circumference} ${circumference}`}
              />
            </svg>
            <span className="level-value">{level}</span>
            <span className="level-label">lvl</span>
          </div>

          <div className="currency-pill">
            <span className="orb" />
            <span className="currency-stack">
              <span className="currency-value">{formatNumber(oxygen)}</span>
              <span className="currency-rate">{formatNumber(rate)}/sec</span>
            </span>
          </div>

          <div className="hud-right">
            <div className="gem-pill">
              <DiamondIcon width="15" height="15" />
              <span>{gems}</span>
            </div>
            <button type="button" className="gear-btn" onClick={onOpenSettings} aria-label="Settings">
              <GearIcon width="18" height="18" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`boost-chip ${boostActive ? 'is-active' : ''}`}
        onClick={onOpenBoosters}
      >
        <span className="boost-bolt">x2</span>
        <span className="boost-text">
          {boostActive ? formatDuration(boostRemaining) : 'Boosters'}
        </span>
      </button>
    </>
  );
}
