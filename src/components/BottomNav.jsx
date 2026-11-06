import { BasketIcon, CanIcon, FlowerIcon } from './Icons';

const TABS = [
  { id: 'seeds', label: 'Seeds', Icon: FlowerIcon, badge: 'seeds' },
  { id: 'boosters', label: 'Boosters', Icon: CanIcon },
  { id: 'shop', label: 'Shop', Icon: BasketIcon },
];

export default function BottomNav({ active, onChange, seedsBadge }) {
  return (
    <nav className="nav wood">
      <div className="nav-inner">
        {TABS.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            type="button"
            className={`nav-btn ${active === id ? 'is-active' : ''}`}
            onClick={() => onChange(id)}
            aria-pressed={active === id}
          >
            <span className={`nav-icon nav-icon-${id}`}>
              <Icon width="26" height="26" />
              {badge === 'seeds' && seedsBadge > 0 && <span className="nav-dot" />}
            </span>
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
