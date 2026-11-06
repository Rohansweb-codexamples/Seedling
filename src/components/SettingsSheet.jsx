import Sheet from './Sheet';

export default function SettingsSheet({ onClose, onReset }) {
  return (
    <Sheet title="SETTINGS" onClose={onClose}>
      <ul className="row-list">
        <li className="seed-row">
          <div className="seed-info">
            <div className="seed-line">
              <span className="seed-name">Your garden</span>
            </div>
            <div className="seed-meta">
              Progress saves automatically in this browser. Resetting plants a brand new garden
              and can&apos;t be undone.
            </div>
          </div>
          <div className="seed-actions">
            <button type="button" className="btn btn-danger" onClick={onReset}>
              RESET
            </button>
          </div>
        </li>
        <li className="seed-row">
          <div className="seed-info">
            <div className="seed-line">
              <span className="seed-name">How to play</span>
            </div>
            <div className="seed-meta">
              Tap an empty pot to sow a seed. Plants bloom over time and then breathe out oxygen
              every second — tap a bloomed plant for a bonus.
            </div>
          </div>
        </li>
      </ul>
    </Sheet>
  );
}
