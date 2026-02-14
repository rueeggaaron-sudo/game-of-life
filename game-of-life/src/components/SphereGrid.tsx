import { useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Grid } from '../game/types';

interface SphereGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
}

const Sphere = ({ grid, setCell }: SphereGridProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.DataTexture>(null);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  // Create DataTexture buffer
  const data = useMemo(() => new Uint8Array(rows * cols * 4), [rows, cols]);

  // Update texture data when grid changes
  useEffect(() => {
    if (!textureRef.current) return;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Flip Y so grid[0] (top) is at texture Y=rows-1 (top)
        const textureY = rows - 1 - y;
        const i = (textureY * cols + x) * 4;

        const isAlive = grid[y][x];

        if (isAlive) {
            // Tailwind Green-500: #22c55e -> R34 G197 B94
            data[i] = 34;
            data[i + 1] = 197;
            data[i + 2] = 94;
            data[i + 3] = 255;
        } else {
            // Black/Transparent
            data[i] = 2; // Very dark blue/black
            data[i + 1] = 6;
            data[i + 2] = 23; // Gray-950 equivalent
            data[i + 3] = 255;
        }
      }
    }

    textureRef.current.needsUpdate = true;
  }, [grid, data, rows, cols]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); // Prevent orbit controls from messing up click if we want strict control

    // Only handle left click for drawing
    if (e.button === 0) {
        const uv = e.uv;
        if (!uv) return;

        // Map UV to Grid
        // UV (0,0) is bottom-left
        // Grid (0,0) is top-left
        // x = uv.x * cols
        // y = (1 - uv.y) * rows

        let x = Math.floor(uv.x * cols);
        let y = Math.floor((1 - uv.y) * rows);

        // Bounds check
        if (x >= cols) x = cols - 1;
        if (x < 0) x = 0;
        if (y >= rows) y = rows - 1;
        if (y < 0) y = 0;

        // Toggle cell
        setCell(x, y, !grid[y][x]);
    }
  };

  return (
    <mesh ref={meshRef} onPointerDown={handlePointerDown}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial roughness={0.1} metalness={0.1} emissive="#0f172a" emissiveIntensity={0.2}>
        <dataTexture
            ref={textureRef}
            attach="map"
            args={[data, cols, rows]}
            format={THREE.RGBAFormat}
            type={THREE.UnsignedByteType}
            magFilter={THREE.NearestFilter}
            minFilter={THREE.NearestFilter}
        />
      </meshStandardMaterial>
    </mesh>
  );
};

export const SphereGrid = ({ grid, setCell }: SphereGridProps) => {
  return (
    <div className="w-full h-full bg-gray-950 relative">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <color attach="background" args={['#020617']} />

            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color="#4ade80" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Sphere grid={grid} setCell={setCell} />

            <OrbitControls enablePan={false} minDistance={3.5} maxDistance={10} />
        </Canvas>

        <div className="absolute bottom-4 right-4 pointer-events-none bg-black/50 backdrop-blur text-[10px] md:text-xs text-gray-400 p-2 rounded border border-gray-800 z-10 hidden md:block">
            <div>Linke Maustaste: Zelle umschalten</div>
            <div>Rechte Maustaste / Ziehen: Ansicht drehen</div>
            <div>Mausrad: Zoom</div>
        </div>
    </div>
  );
};
