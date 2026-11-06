import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SHELVES, SLOTS } from '../game/plants';
import PottedPlant from './PottedPlant';

function Shelf({ y, width }) {
  return (
    <group position={[0, y, 0.05]}>
      <mesh position={[0, -0.055, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.11, 0.6]} />
        <meshStandardMaterial color="#b07a48" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.055, 0.305]}>
        <boxGeometry args={[width, 0.11, 0.022]} />
        <meshStandardMaterial color="#96602f" roughness={0.85} />
      </mesh>
      {[-width / 2 + 0.18, width / 2 - 0.18].map((x, i) => (
        <mesh key={i} position={[x, -0.17, 0.02]} castShadow>
          <boxGeometry args={[0.055, 0.2, 0.32]} />
          <meshStandardMaterial color="#8a5528" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Window() {
  const frame = '#f7eddb';
  return (
    <group position={[0, 2.4, -0.55]}>
      {/* sky */}
      <mesh>
        <planeGeometry args={[1.15, 1.15]} />
        <meshStandardMaterial
          color="#cbe9f8"
          emissive="#bfe4f7"
          emissiveIntensity={0.55}
          roughness={1}
        />
      </mesh>
      {/* clouds, so the opening reads as a window */}
      {[
        { x: -0.26, y: 0.28, scale: 0.1 },
        { x: 0.22, y: -0.14, scale: 0.14 },
        { x: 0.34, y: 0.34, scale: 0.08 },
      ].map((cloud, i) => (
        <group key={i} position={[cloud.x, cloud.y, 0.012]}>
          <mesh scale={[cloud.scale * 1.6, cloud.scale * 0.62, 0.01]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={1} />
          </mesh>
          <mesh position={[cloud.scale * 0.9, cloud.scale * 0.35, 0]} scale={[cloud.scale, cloud.scale * 0.55, 0.01]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={1} />
          </mesh>
        </group>
      ))}
      {/* frame */}
      {[
        { position: [0, 0.61, 0.02], size: [1.32, 0.09, 0.09] },
        { position: [0, -0.61, 0.02], size: [1.32, 0.09, 0.09] },
        { position: [-0.61, 0, 0.02], size: [0.09, 1.32, 0.09] },
        { position: [0.61, 0, 0.02], size: [0.09, 1.32, 0.09] },
        { position: [0, 0, 0.01], size: [0.055, 1.15, 0.06] },
        { position: [0, 0.12, 0.01], size: [1.15, 0.055, 0.06] },
      ].map((part, i) => (
        <mesh key={i} position={part.position} castShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={frame} roughness={0.8} />
        </mesh>
      ))}
      {/* sill */}
      <mesh position={[0, -0.68, 0.12]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.28]} />
        <meshStandardMaterial color={frame} roughness={0.8} />
      </mesh>
      {/* open shutters */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.86, 0, 0.05]} rotation={[0, side * -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.44, 1.34, 0.055]} />
            <meshStandardMaterial color="#8fbfa2" roughness={0.85} />
          </mesh>
          {Array.from({ length: 5 }).map((_, s) => (
            <mesh key={s} position={[0, 0.44 - s * 0.22, 0.032]}>
              <boxGeometry args={[0.36, 0.09, 0.012]} />
              <meshStandardMaterial color="#7bab8e" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  const fitZ = useRef(7.2);

  useEffect(() => {
    const halfFov = (camera.fov * Math.PI) / 360;
    const aspect = size.width / Math.max(1, size.height);
    const zHeight = 4.9 / 2 / Math.tan(halfFov);
    const zWidth = 2.8 / 2 / (Math.tan(halfFov) * aspect);
    fitZ.current = Math.max(zHeight, zWidth);
  }, [camera.fov, size.width, size.height]);

  useFrame(({ pointer }, delta) => {
    const k = Math.min(1, delta * 4);
    camera.position.x += (0.4 + pointer.x * 0.45 - camera.position.x) * k;
    camera.position.y += (0.55 + pointer.y * 0.3 - camera.position.y) * k;
    camera.position.z += (fitZ.current - camera.position.z) * k;
    camera.lookAt(0, 0.25, 0);
  });

  return null;
}

export default function Scene({ slots, upgrades, onPot }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 38, position: [0.4, 0.55, 7.4] }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#cfa87c']} />
      <CameraRig />

      <hemisphereLight args={['#fff3df', '#7d5c3c', 0.85]} />
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[2.4, 4.4, 3.6]}
        intensity={2.1}
        color="#fff4e2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0007}
        shadow-camera-left={-3.2}
        shadow-camera-right={3.2}
        shadow-camera-top={4.2}
        shadow-camera-bottom={-4.2}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
      />
      <directionalLight position={[-3.2, 1.6, 2.4]} intensity={0.45} color="#ffd9b5" />

      {/* wall + window */}
      <mesh position={[0, 0.4, -0.62]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#d9c39d" roughness={0.95} />
      </mesh>
      <Window />

      {SHELVES.map((shelf, i) => (
        <Shelf key={i} y={shelf.y} width={shelf.width} />
      ))}

      {SLOTS.map((slot) => (
        <PottedPlant
          key={slot.id}
          slot={slot}
          entry={slots[slot.id]}
          upgrades={upgrades}
          onPot={onPot}
        />
      ))}
    </Canvas>
  );
}
