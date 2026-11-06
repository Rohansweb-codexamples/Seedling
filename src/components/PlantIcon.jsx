const SHAPES = {
  daisy: { petals: 9, rx: 5.4, ry: 10.5, dist: 7.4, angle: 0, center: 5 },
  peony: { petals: 8, rx: 6.6, ry: 9, dist: 6, angle: 12, center: 4.6 },
  camellia: { petals: 7, rx: 7, ry: 8.6, dist: 5.6, angle: 8, center: 4.2 },
  lotus: { petals: 7, rx: 4.6, ry: 11, dist: 6.4, angle: 0, center: 4 },
  spike: { petals: 0, rx: 0, ry: 0, dist: 0, angle: 0, center: 0 },
};

function HyacinthIcon({ plant }) {
  const dots = [];
  for (let i = 0; i < 16; i += 1) {
    const t = i / 15;
    const row = Math.floor(i / 4);
    const col = i % 4;
    dots.push(
      <circle
        key={i}
        cx={10 + col * 5.4 + (row % 2 ? 2.4 : 0)}
        cy={16 + row * 5.6}
        r={3.6 - t * 1.1}
        fill={i % 3 === 0 ? plant.center : i % 3 === 1 ? plant.petal : plant.petalEdge}
      />,
    );
  }
  return <g>{dots}</g>;
}

/** Little illustrated flower used in the seeds list. */
export default function PlantIcon({ plant, size = 46 }) {
  const shape = SHAPES[plant.flower] ?? SHAPES.daisy;
  return (
    <svg viewBox="0 0 48 56" width={size} height={(size * 56) / 48} aria-hidden="true">
      <path d="M24 52V28" stroke={plant.stem} strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="15.5" cy="41" rx="7" ry="4" fill={plant.leaf} transform="rotate(-24 15.5 41)" />
      <ellipse cx="32.5" cy="45" rx="7" ry="4" fill={plant.leaf} transform="rotate(24 32.5 45)" />
      <g transform="translate(24 21)">
        {plant.flower === 'spike' ? (
          <g transform="translate(-24 -13)">
            <HyacinthIcon plant={plant} />
          </g>
        ) : (
          <>
            {Array.from({ length: shape.petals }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy={-shape.dist}
                rx={shape.rx}
                ry={shape.ry}
                fill={plant.petal}
                stroke={plant.petalEdge}
                strokeWidth="0.8"
                transform={`rotate(${(i * 360) / shape.petals + shape.angle})`}
              />
            ))}
            <circle cx="0" cy="0" r={shape.center} fill={plant.center} />
          </>
        )}
      </g>
    </svg>
  );
}
