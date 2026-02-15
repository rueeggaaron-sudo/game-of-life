import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Grid, Rule } from '../game/types';
import { detectPatterns } from '../game/recognition';

interface SphereGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
  velocity?: { x: number; y: number };
  rule?: Rule;
}

const Sphere = ({ grid, setCell, velocity, rule }: SphereGridProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  // Create Canvas for Texture
  const { canvas, ctx, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    // Set resolution to grid size for pixel-perfect mapping (with NearestFilter)
    // We can upscale if we want smooth borders, but "Squares" implies sharp pixels.
    // However, to draw grid lines, we might need higher resolution.
    // User wants "connected raster". 1 pixel per cell = connected.
    canvas.width = cols || 100;
    canvas.height = rows || 50;
    const ctx = canvas.getContext('2d', { alpha: false }); // No transparency needed for base

    const texture = new THREE.CanvasTexture(canvas);
    // Important for "Squares": Keep pixels sharp
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false; // Not needed for NearestFilter usually

    return { canvas, ctx, texture };
  }, [rows, cols]);

  // Pattern Detection
  const patternGrid = useMemo(() => {
    if (!rule || rule.name !== 'Conway') return [];
    if (rows * cols > 50000) return [];
    return detectPatterns(grid);
  }, [grid, rows, cols, rule]);

  // Draw to Canvas when Grid updates
  useEffect(() => {
    if (!ctx || rows === 0 || cols === 0) return;

    // Background (Dead Cells) - Dark slate blueish to match previous aesthetic
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Live Cells
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x]) {
            const idx = y * cols + x;
            const pattern = patternGrid[idx];
            ctx.fillStyle = pattern?.hex || '#22c55e'; // Green or Pattern Color
            // Draw 1x1 pixel
            ctx.fillRect(x, y, 1, 1);
        } else {
            // Optional: Draw grid lines?
            // Since we fill background, we could draw lines.
            // But at 1px resolution, lines are impossible without sub-pixel (which means higher res).
            // User asked for "closed connected raster".
            // If we just draw pixels, they are connected.
            // Let's stick to simple pixels first. "Squares" are inherent.
        }
      }
    }

    texture.needsUpdate = true;
  }, [grid, rows, cols, ctx, canvas, texture, patternGrid]);


  // Rotation Animation
  useFrame((_state, delta) => {
     if (groupRef.current && velocity && cols > 0) {
         const speedLevelX = Math.abs(velocity.x);
         const directionX = Math.sign(velocity.x);

         const speedLevelY = Math.abs(velocity.y);
         const directionY = Math.sign(velocity.y);

         const radiansPerCell = (2 * Math.PI) / cols;

         // X-Axis Velocity -> Y-Axis Rotation
         const rotationSpeedY = -directionX * radiansPerCell * speedLevelX * delta;
         // Y-Axis Velocity -> X-Axis Rotation
         const rotationSpeedX = -directionY * radiansPerCell * speedLevelY * delta;

         groupRef.current.rotation.y += rotationSpeedY;
         groupRef.current.rotation.x += rotationSpeedX;
     }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Calculate Grid Coordinates from UV
    if (e.uv && cols > 0 && rows > 0) {
        // UV: (0,0) is usually bottom-left
        // Canvas: (0,0) is top-left
        // Texture mapping on Sphere:
        // u = 0..1 (around equator) -> x
        // v = 0..1 (south to north) -> y (inverted?)

        // Let's assume standard UV sphere mapping:
        // u goes 0->1 around.
        // v goes 0 (bottom) -> 1 (top).

        // Our grid[0] is top row.
        // So y = (1 - v) * rows.

        // Shift x by 0.25 (90 deg) because sphere textures start at a specific angle?
        // Usually standard sphere u=0 is at +Z or -Z.
        // We can just rely on visual clicking.

        const x = Math.floor(e.uv.x * cols) % cols;
        const y = Math.floor((1 - e.uv.y) * rows) % rows; // Invert Y to match canvas top-down

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            setCell(x, y, !grid[y][x]);
        }
    }
  };

  const radius = 2.8; // Slightly larger sphere

  return (
    <group ref={groupRef}>
        <mesh
            ref={meshRef}
            onPointerDown={handlePointerDown}
            rotation={[0, -Math.PI / 2, 0]} // Rotate to align texture seam if needed
        >
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.2}
                metalness={0.1}
                emissive="#000000"
            />
        </mesh>
    </group>
  );
};

// Simple Glow Texture Component
const Glow = () => {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)'); // Bright center
            gradient.addColorStop(0.4, 'rgba(186, 230, 253, 0.3)'); // Blueish mid
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade out
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    return (
        <mesh position={[0, 0, -4]}>
            <planeGeometry args={[15, 15]} />
            <meshBasicMaterial
                map={texture}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
};

export const SphereGrid = ({ grid, setCell, velocity, rule }: SphereGridProps) => {
  return (
    <div className="w-full h-full bg-gray-950 relative">
        <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
            <color attach="background" args={['#020617']} />

            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.0} />
            <pointLight position={[-10, -10, -5]} intensity={1.0} color="#38bdf8" />

            {/* The Backlight Glow */}
            <Glow />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Sphere grid={grid} setCell={setCell} velocity={velocity} rule={rule} />

            <OrbitControls enablePan={false} minDistance={4} maxDistance={15} />
        </Canvas>

        <div className="absolute bottom-4 right-4 pointer-events-none bg-black/50 backdrop-blur text-[10px] md:text-xs text-gray-400 p-2 rounded border border-gray-800 z-10 hidden md:block">
            <div>Linke Maustaste: Zelle umschalten</div>
            <div>Rechte Maustaste / Ziehen: Ansicht drehen</div>
            <div>Mausrad: Zoom</div>
            <div>Pfeiltasten: Automatische Rotation</div>
        </div>
    </div>
  );
};
