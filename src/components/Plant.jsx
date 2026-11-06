import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PLANT_BY_ID, growSeconds } from '../game/plants';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

/** A ring of flattened petals radiating from the flower centre. */
function PetalRing({
  count,
  radius,
  y = 0,
  tilt = -0.3,
  length,
  width,
  thickness,
  color,
  offset = 0,
  roughness = 0.55,
}) {
  const angles = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2 + offset),
    [count, offset],
  );
  return (
    <group>
      {angles.map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh
            position={[0, y, radius]}
            rotation={[tilt, 0, 0]}
            scale={[width, thickness, length]}
            castShadow
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={color} roughness={roughness} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DaisyHead({ plant }) {
  return (
    <group>
      <PetalRing
        count={10}
        radius={0.062}
        length={0.075}
        width={0.026}
        thickness={0.008}
        tilt={-0.22}
        color={plant.petal}
      />
      <PetalRing
        count={8}
        radius={0.04}
        y={0.012}
        length={0.05}
        width={0.022}
        thickness={0.008}
        tilt={-0.5}
        offset={0.3}
        color={plant.petalEdge}
      />
      <mesh scale={0.042} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={plant.center} roughness={0.5} />
      </mesh>
    </group>
  );
}

function PeonyHead({ plant }) {
  return (
    <group>
      <PetalRing
        count={7}
        radius={0.055}
        length={0.075}
        width={0.045}
        thickness={0.028}
        tilt={-0.4}
        color={plant.petal}
      />
      <PetalRing
        count={6}
        radius={0.036}
        y={0.018}
        length={0.055}
        width={0.04}
        thickness={0.026}
        tilt={-0.8}
        offset={0.5}
        color={plant.petalEdge}
      />
      <PetalRing
        count={4}
        radius={0.018}
        y={0.038}
        length={0.035}
        width={0.03}
        thickness={0.022}
        tilt={-1.1}
        offset={0.2}
        color={plant.center}
      />
    </group>
  );
}

function LotusHead({ plant }) {
  const rings = [
    { count: 9, radius: 0.052, tilt: 1.25, scale: [0.028, 0.115, 0.02], y: 0 },
    { count: 7, radius: 0.034, tilt: 0.85, scale: [0.026, 0.1, 0.018], y: 0.014 },
    { count: 5, radius: 0.016, tilt: 0.42, scale: [0.022, 0.08, 0.016], y: 0.028 },
  ];
  return (
    <group>
      {rings.map((ring, r) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = (i / ring.count) * Math.PI * 2 + r * 0.35;
          return (
            <group key={`${r}-${i}`} rotation={[0, angle, 0]}>
              <group position={[0, ring.y, ring.radius]} rotation={[ring.tilt, 0, 0]}>
                <mesh scale={ring.scale} castShadow>
                  <coneGeometry args={[1, 1, 5]} />
                  <meshStandardMaterial
                    color={r === 0 ? plant.petalEdge : plant.petal}
                    roughness={0.45}
                  />
                </mesh>
              </group>
            </group>
          );
        }),
      )}
      <mesh position={[0, 0.03, 0]} scale={0.03} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={plant.center} roughness={0.35} metalness={0.25} />
      </mesh>
    </group>
  );
}

function CamelliaHead({ plant }) {
  return (
    <group>
      <PetalRing
        count={8}
        radius={0.05}
        length={0.07}
        width={0.042}
        thickness={0.022}
        tilt={-0.35}
        color={plant.petalEdge}
      />
      <PetalRing
        count={7}
        radius={0.033}
        y={0.016}
        length={0.052}
        width={0.038}
        thickness={0.02}
        tilt={-0.7}
        offset={0.4}
        color={plant.petal}
      />
      <PetalRing
        count={5}
        radius={0.016}
        y={0.032}
        length={0.032}
        width={0.028}
        thickness={0.018}
        tilt={-1}
        offset={0.9}
        color={plant.petal}
      />
      <mesh position={[0, 0.03, 0]} scale={0.024} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={plant.center} roughness={0.4} />
      </mesh>
    </group>
  );
}

function HyacinthHead({ plant }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const t = i / 21;
        const angle = i * 2.399;
        const radius = 0.05 * (1 - t * 0.88);
        return {
          position: [Math.cos(angle) * radius, t * 0.19, Math.sin(angle) * radius],
          size: 0.02 - t * 0.006,
          color: i % 3 === 0 ? plant.center : i % 3 === 1 ? plant.petal : plant.petalEdge,
        };
      }),
    [plant],
  );
  return (
    <group>
      {dots.map((dot, i) => (
        <mesh key={i} position={dot.position} scale={dot.size} castShadow>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={dot.color} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.21, 0]} scale={[0.014, 0.03, 0.014]} castShadow>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color={plant.center} roughness={0.5} />
      </mesh>
    </group>
  );
}

function FlowerHead({ plant }) {
  switch (plant.flower) {
    case 'peony':
      return <PeonyHead plant={plant} />;
    case 'lotus':
      return <LotusHead plant={plant} />;
    case 'camellia':
      return <CamelliaHead plant={plant} />;
    case 'spike':
      return <HyacinthHead plant={plant} />;
    default:
      return <DaisyHead plant={plant} />;
  }
}

function Leaves({ plant, height }) {
  return (
    <group>
      <group rotation={[0, 0.4, 0]} position={[0, height * 0.35, 0]}>
        <mesh position={[0.06, 0.01, 0]} rotation={[0, 0, -0.55]} scale={[0.085, 0.012, 0.04]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={plant.leaf} roughness={0.7} />
        </mesh>
      </group>
      <group rotation={[0, 3.3, 0]} position={[0, height * 0.55, 0]}>
        <mesh position={[0.055, 0.01, 0]} rotation={[0, 0, -0.4]} scale={[0.07, 0.011, 0.034]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={plant.leaf} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function Bud({ plant }) {
  return (
    <group>
      <mesh scale={[0.032, 0.042, 0.032]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={plant.petalEdge} roughness={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[0.5, (i / 3) * Math.PI * 2, 0]}
          position={[0, -0.012, 0]}
          scale={[0.038, 0.03, 0.012]}
          castShadow
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={plant.stem} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/** A single growing plant: seed -> sprout -> bud -> bloom. */
export default function Plant({ entry, upgrades }) {
  const plant = PLANT_BY_ID[entry.plantId];
  const groupRef = useRef();
  const headRef = useRef();
  const stageRef = useRef(-1);
  const [stage, setStage] = useState(0);

  const growMs = Math.max(1, growSeconds(entry, upgrades) * 1000);
  const fullHeight = plant.height;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const elapsed = Date.now() - entry.plantedAt;
    const progress = Math.min(1, elapsed / growMs);
    const nextStage = progress >= 1 ? 3 : progress > 0.62 ? 2 : progress > 0.28 ? 1 : 0;
    if (nextStage !== stageRef.current) {
      stageRef.current = nextStage;
      setStage(nextStage);
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.55 + 0.45 * easeOutCubic(progress));
      groupRef.current.rotation.z = Math.sin(t * 1.2 + entry.plantedAt * 0.002) * 0.018;
    }
    if (headRef.current) {
      const bloom = Math.min(1, Math.max(0, (elapsed - growMs) / 420));
      headRef.current.scale.setScalar(stageRef.current === 3 ? easeOutBack(bloom) : 0.001);
    }
  });

  const stemHeight =
    stage === 0 ? fullHeight * 0.18 : stage === 1 ? fullHeight * 0.55 : fullHeight;

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      <mesh position={[0, stemHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.013, 0.022, stemHeight, 8]} />
        <meshStandardMaterial color={plant.stem} roughness={0.75} />
      </mesh>

      {stage === 0 && (
        <group position={[0, 0.03, 0]}>
          {[0.5, 2.6].map((angle, i) => (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.03, 0.01, 0]} rotation={[0, 0, -0.5]} scale={[0.045, 0.008, 0.022]} castShadow>
                <sphereGeometry args={[1, 8, 6]} />
                <meshStandardMaterial color={plant.leaf} roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {stage >= 1 && <Leaves plant={plant} height={stemHeight} />}

      {stage === 2 && (
        <group position={[0, stemHeight, 0]} scale={plant.headScale}>
          <Bud plant={plant} />
        </group>
      )}

      {stage === 3 && (
        <group ref={headRef} position={[0, stemHeight, 0]} scale={plant.headScale}>
          <FlowerHead plant={plant} />
        </group>
      )}
    </group>
  );
}
