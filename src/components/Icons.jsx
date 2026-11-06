export function FlowerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx="12"
          cy="7.4"
          rx="2.9"
          ry="4.4"
          fill="currentColor"
          opacity="0.95"
          transform={`rotate(${i * 72} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.7" fill="#fff5cf" />
    </svg>
  );
}

export function CanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 4.5h6.5a1 1 0 0 1 1 1v2.2H9z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M16.8 5.2l3.4-1.4a.9.9 0 0 1 1.2.5.9.9 0 0 1-.5 1.2l-3.5 1.4z"
        fill="currentColor"
      />
      <rect x="7" y="7.5" width="10" height="12" rx="3.2" fill="currentColor" />
      <path d="M9 11.5h6" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BasketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 10.5h16l-1.7 8.2a2 2 0 0 1-2 1.6H7.7a2 2 0 0 1-2-1.6z" fill="currentColor" />
      <path
        d="M8.4 10.3L10.9 4.2M15.6 10.3L13.1 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M9.4 13.4v4M14.6 13.4v4" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function DiamondIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2.4l6.4 6.6-6.4 12.6L5.6 9z" fill="currentColor" />
      <path d="M12 2.4l6.4 6.6H5.6z" fill="#fff" fillOpacity="0.45" />
    </svg>
  );
}

export function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M19.3 13.6a7.6 7.6 0 0 0 0-3.2l1.6-1.2-1.9-3.3-1.9.8a7.6 7.6 0 0 0-2.8-1.6L14 2.6h-4l-.4 2.5a7.6 7.6 0 0 0-2.8 1.6l-1.9-.8-1.9 3.3 1.6 1.2a7.6 7.6 0 0 0 0 3.2l-1.6 1.2 1.9 3.3 1.9-.8a7.6 7.6 0 0 0 2.8 1.6l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.8-1.6l1.9.8 1.9-3.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function LeafIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 4c-9 0-14 4.2-14 10.2 0 2 .7 3.7 1.8 5C9.2 16.1 13.4 13.1 20 12c-4.6 2.2-7.6 4.6-9.4 8.2 1.2.5 2.4.8 3.7.8C19 21 20 13.7 20 4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor" />
      <path d="M8.6 10.3V8.2a3.4 3.4 0 0 1 6.8 0v2.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
