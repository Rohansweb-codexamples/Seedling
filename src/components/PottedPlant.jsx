import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { growSeconds, isBloomed } from '../game/plants';
import Plant from './Plant';

const RING_SEGMENTS = 64;

function GrowthRing({ entry, upgrades }) {
  const arcRef = useRef();
  const growMs = Math.max(1, growSeconds(entry, upgrades) * 1000);

  useFrame(() => {
    const geometry = arcRef.current?.geometry;
    if (!geometry) return;
    const progress = Math.min(1, Math.max(0, (Date.now() - entry.plantedAt) / growMs));
    // Torus indices run segment by segment (6 per segment): reveal the arc as
    // the plant grows instead of rebuilding geometry every frame.
    const segments = Math.max(1, Math.floor(RING_SEGMENTS * progress));
    geometry.setDrawRange(0, segments * 6);
  });

  return (
    <group position={[0, 1.0, 0.02]}>
      <mesh>
        <torusGeometry args={[0.085, 0.011, 6, RING_SEGMENTS]} />
        <meshBasicMaterial color="#3a2a1c" transparent opacity={0.18} />
      </mesh>
      <mesh ref={arcRef} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.085, 0.011, 6, RING_SEGMENTS]} />
        <meshBasicMaterial color="#7be07d" />
      </mesh>
    </group>
  );
}

function EmptyMarker() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = 0.72 + Math.sin(clock.getElapsedTime() * 2) * 0.025;
    ref.current.rotation.y = clock.getElapsedTime() * 0.4;
  });
  return (
    <group ref={ref} position={[0, 0.72, 0]}>
      <mesh>
        <boxGeometry args={[0.1, 0.028, 0.028]} />
        <meshStandardMaterial color="#8fe08c" emissive="#3f8f3a" emissiveIntensity={0.35} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.028, 0.1, 0.028]} />
        <meshStandardMaterial color="#8fe08c" emissive="#3f8f3a" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export default function PottedPlant({ slot, entry, upgrades, onPot }) {
  const bloomed = entry ? isBloomed(entry, upgrades) : false;

  return (
    <group position={[slot.x, slot.y, 0.05]}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.245, 0.175, 0.34, 22]} />
        <meshStandardMaterial color="#c97a4b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.325, 0]} castShadow>
        <cylinderGeometry args={[0.268, 0.252, 0.075, 22]} />
        <meshStandardMaterial color="#b96b3d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.345, 0]} receiveShadow>
        <cylinderGeometry args={[0.228, 0.228, 0.035, 22]} />
        <meshStandardMaterial color="#48301f" roughness={1} />
      </mesh>

      {entry ? <Plant entry={entry} upgrades={upgrades} /> : <EmptyMarker />}
      {entry && !bloomed && <GrowthRing entry={entry} upgrades={upgrades} />}

      <mesh
        position={[0, 0.55, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onPot(slot.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <cylinderGeometry args={[0.33, 0.33, 1.15, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
